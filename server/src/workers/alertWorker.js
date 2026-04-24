const { Queue, Worker, QueueScheduler } = require('bullmq');
const axios = require('axios');
const db = require('../config/db');
const { queryMetrics } = require('../config/influx');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const INFLUX_BUCKET = process.env.INFLUX_BUCKET;

// Logic to check rules and send alerts
const checkAlertRules = async () => {
  console.log('🔍 Checking alert rules...');
  
  try {
    // 1. Get all active rules and their project keys
    const result = await db.query(`
      SELECT a.*, p.name as project_name, p.api_key 
      FROM alert_rules a 
      JOIN projects p ON a.project_id = p.id 
      WHERE a.is_active = true
    `);
    
    const rules = result.rows;

    for (const rule of rules) {
      // 2. Query InfluxDB for the metric over the last 5 minutes
      const measurement = rule.metric_type === 'latency' ? 'api_performance' : 'system_metrics';
      const field = rule.metric_type === 'latency' ? 'duration' : rule.metric_type === 'cpu' ? 'cpuUsage' : 'ramUsage';

      const fluxQuery = `
        from(bucket: "${INFLUX_BUCKET}")
          |> range(start: -5m)
          |> filter(fn: (r) => r["_measurement"] == "${measurement}")
          |> filter(fn: (r) => r["project_key"] == "${rule.api_key}")
          |> filter(fn: (r) => r["_field"] == "${field}")
          |> mean()
      `;

      const data = await queryMetrics(fluxQuery);
      
      if (data.length > 0) {
        const averageValue = data[0]._value;

        // 3. Compare against threshold
        if (averageValue > rule.threshold) {
          await triggerAlert(rule, averageValue);
        }
      }
    }
  } catch (err) {
    console.error('Alert Check Error:', err);
  }
};

const triggerAlert = async (rule, currentValue) => {
  const message = `🚨 **Sentinel Alert: ${rule.project_name}**\n` +
                 `**Metric:** ${rule.metric_type.toUpperCase()}\n` +
                 `**Current Value:** ${currentValue.toFixed(2)}\n` +
                 `**Threshold:** ${rule.threshold}\n` +
                 `*Timestamp:* ${new Date().toISOString()}`;

  // 0. Save to History (Internal Tracking)
  try {
    await db.query(
      'INSERT INTO alert_history (project_id, rule_id, metric_type, value, threshold) VALUES ($1, $2, $3, $4, $5)',
      [rule.project_id, rule.id, rule.metric_type, currentValue, rule.threshold]
    );
  } catch (err) {
    console.error('Failed to save alert history:', err.message);
  }

  // 1. Discord/Slack Webhook
  if (rule.webhook_url) {
    try {
      await axios.post(rule.webhook_url, { content: message });
    } catch (err) {
      console.error('Failed to send webhook alert:', err.message);
    }
  }

  // 2. Telegram Integration
  if (process.env.TELEGRAM_BOT_TOKEN && rule.telegram_chat_id) {
    try {
      const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      await axios.post(telegramUrl, {
        chat_id: rule.telegram_chat_id,
        text: message.replace(/\*\*/g, ''), // Telegram Markdown is slightly different
        parse_mode: 'Markdown'
      });
    } catch (err) {
      console.error('Failed to send Telegram alert:', err.message);
    }
  }
};

// Setup BullMQ Worker
const alertWorker = new Worker('alert-queue', async (job) => {
  if (job.name === 'check-rules') {
    await checkAlertRules();
  }
}, { connection: { url: REDIS_URL } });

module.exports = { alertWorker };
