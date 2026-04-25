const os = require('os');
const axios = require('axios');

class Sentinel {
  constructor() {
    this.projectKey = null;
    this.ingestServer = 'http://127.0.0.1:5000';
    this.metricsQueue = [];
    this.intervalId = null;
    this.originalLog = console.log;
    this.originalError = console.error;
  }

  init(config) {
    this.projectKey = config.projectKey;
    this.serverUrl = config.serverUrl || config.ingestServer || 'http://127.0.0.1:5000';
    
    if (this.serverUrl.includes('localhost')) {
      this.serverUrl = this.serverUrl.replace('localhost', '127.0.0.1');
    }

    this.originalLog('✅ Sentinel SDK Initialized');
    
    this.setupLogInterception();
    this.startBackgroundMetrics();
  }

  setupLogInterception() {
    const self = this;
    
    console.log = function(...args) {
      self.originalLog.apply(console, args);
      self.queueLog('INFO', args.join(' '));
    };

    console.error = function(...args) {
      self.originalError.apply(console, args);
      self.queueLog('ERROR', args.join(' '));
    };

    process.on('uncaughtException', (err) => {
      this.originalError(`💥 FATAL ERROR: ${err.message}`);
      this.queueLog('CRITICAL', `Uncaught Exception: ${err.message}\n${err.stack}`);
      this.flush().then(() => {
        setTimeout(() => process.exit(1), 500);
      });
    });
  }

  queueLog(level, message) {
    this.queueMetric('log', { level: level.toUpperCase(), message });
  }

  log(message, level = 'INFO') {
    this.queueLog(level, message);
  }

  startTimer(label) {
    const start = process.hrtime();
    return {
      stop: () => {
        const diff = process.hrtime(start);
        const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
        this.queueMetric('custom_timer', {
          label,
          duration: parseFloat(durationMs)
        });
        return durationMs;
      }
    };
  }

  async trackQuery(queryFn, queryData = {}) {
    const start = process.hrtime();
    try {
      const result = await queryFn();
      const diff = process.hrtime(start);
      const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
      this.queueMetric('db_performance', {
        query: queryData.query || 'unnamed_query',
        duration: parseFloat(durationMs),
        success: true
      });
      return result;
    } catch (error) {
      const diff = process.hrtime(start);
      const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
      this.queueMetric('db_performance', {
        query: queryData.query || 'unnamed_query',
        duration: parseFloat(durationMs),
        success: false,
        error: error.message
      });
      throw error;
    }
  }

  middleware() {
    return (req, res, next) => {
      const start = process.hrtime();
      
      const originalEnd = res.end;
      res.end = (chunk, encoding, callback) => {
        if (res.statusCode >= 500) {
          this.queueLog('ERROR', `Critical Failure on ${req.method} ${req.path}`);
        }
        return originalEnd.call(res, chunk, encoding, callback);
      };

      res.on('finish', () => {
        const diff = process.hrtime(start);
        const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
        this.recordApiMetric({
          path: req.route ? req.route.path : req.path,
          method: req.method,
          statusCode: res.statusCode,
          duration: parseFloat(timeInMs)
        });
      });
      next();
    };
  }

  recordApiMetric(data) {
    this.queueMetric('api_performance', data);
  }

  startBackgroundMetrics() {
    if (this.intervalId) return;

    let lastCpus = os.cpus();

    this.intervalId = setInterval(() => {
      const currentCpus = os.cpus();
      let idleDifference = 0;
      let totalDifference = 0;

      for (let i = 0; i < currentCpus.length; i++) {
        const last = lastCpus[i].times;
        const cur = currentCpus[i].times;

        const idle = cur.idle - last.idle;
        const total = (cur.user - last.user) + (cur.nice - last.nice) + 
                      (cur.sys - last.sys) + (cur.irq - last.irq) + idle;
        
        idleDifference += idle;
        totalDifference += total;
      }

      const cpuPercent = totalDifference === 0 ? 0 : (1 - idleDifference / totalDifference) * 100;
      lastCpus = currentCpus;

      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const ramPercent = ((totalMem - freeMem) / totalMem) * 100;

      this.queueMetric('system_metrics', { 
        cpuPercent: parseFloat(cpuPercent.toFixed(2)), 
        ramPercent: parseFloat(ramPercent.toFixed(2))
      });
      this.flush();
    }, 5000); // High-frequency: 5 seconds
  }

  queueMetric(type, data) {
    this.metricsQueue.push({ type, ...data, timestamp: Date.now() });
  }

  async flush() {
    if (this.metricsQueue.length === 0 || !this.projectKey) return;
    
    const payload = {
      events: [...this.metricsQueue],
      timestamp: Date.now()
    };
    
    this.metricsQueue = [];
    
    try {
      await axios.post(`${this.serverUrl}/v1/ingest`, payload, {
        headers: {
          'x-project-key': this.projectKey,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      // Fail silently
    }
  }
}

const sentinel = new Sentinel();
module.exports = { sentinel };
