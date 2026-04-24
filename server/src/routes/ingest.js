
const express = require('express');
const router = express.Router();
const { writeMetrics } = require('../config/influx');
const db = require('../config/db');
const redis = require('../config/redis');   

module.exports = (io) => {
  // This route receives data from the SDK
  router.post('/', async (req, res) => {
    try {
      const { apiKey, metrics, timestamp } = req.body;
      console.log(`📡 Ingest request from: ${apiKey}`);

      if (!apiKey) {
        return res.status(400).json({ error: 'API Key is required' });
      }

      // 1. Try Cache First (Redis)
      let projectId = await redis.get(`project_key:${apiKey}`);

      // 2. If not in cache, check Postgres
      if (!projectId) {
        const projectResult = await db.query(
          'SELECT id FROM projects WHERE api_key = $1',
          [apiKey]
        );

        if (projectResult.rows.length === 0) {
          console.warn(`[INGEST] Unauthorized attempt with key: ${apiKey}`);
          return res.status(401).json({ error: 'Invalid API Key' });
        }

        projectId = projectResult.rows[0].id;

        // 3. Store in Redis for 1 hour to optimize future hits
        await redis.set(`project_key:${apiKey}`, projectId, 'EX', 3600);
        console.log(`[INGEST] Map: Key ${apiKey.substring(0, 10)}... -> Project ID ${projectId}`);
      }
      
      // Separate logs from metrics for reporting
      const logs = metrics.filter(m => m.type === 'log');
      const otherMetrics = metrics.filter(m => m.type !== 'log');

      // Write standard metrics to InfluxDB
      if (otherMetrics.length > 0) {
        writeMetrics(apiKey, otherMetrics);
      }

      // Broadcast logs to the dashboard in real-time
      if (logs.length > 0) {
        logs.forEach(log => {
          console.log(`[INGEST] Broadcasting log to room: project_${projectId}`);
          io.to(`project_${projectId}`).emit('new-log', {
            ...log.data,
            timestamp: log.timestamp
          });
        });
      }
      
      console.log(`[INGEST] Data from ${apiKey}: ${otherMetrics.length} metrics, ${logs.length} logs`);

      res.status(202).json({ status: 'accepted' });
    } catch (error) {
      console.error('Ingestion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
