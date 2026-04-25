
const express = require('express');
const router = express.Router();
const { writeMetrics } = require('../config/influx');
const db = require('../config/db');
const redis = require('../config/redis');   

module.exports = (io) => {
  // This route receives data from the SDK
  router.post('/', async (req, res) => {
    try {
      // 1. Extract API Key (support header and body for backward compatibility)
      const apiKey = req.headers['x-project-key'] || req.body.apiKey;
      
      // 2. Extract Metrics (support 'events' and 'metrics' naming)
      let metricsData = req.body.events || req.body.metrics || [];

      if (!apiKey) {
        return res.status(400).json({ error: 'Project Key is required' });
      }

      // 3. Resolve Project ID (Cache-first)
      let projectId = await redis.get(`project_key:${apiKey}`);

      if (!projectId) {
        const projectResult = await db.query(
          'SELECT id FROM projects WHERE api_key = $1',
          [apiKey]
        );

        if (projectResult.rows.length === 0) {
          console.warn(`[INGEST] Unauthorized attempt with key: ${apiKey}`);
          return res.status(401).json({ error: 'Invalid Project Key' });
        }

        projectId = projectResult.rows[0].id;
        await redis.set(`project_key:${apiKey}`, projectId, 'EX', 3600);
      }
      
      // 4. Normalize and Separate Metrics
      // New SDK sends data at top level (excluding type/timestamp). 
      // We wrap it in .data for influx.js compatibility.
      const normalizedMetrics = metricsData.map(m => {
        const { type, timestamp, ...rest } = m;
        // If it already has .data (old SDK), keep it, otherwise use rest
        const data = m.data ? m.data : rest;
        return { type, data, timestamp: timestamp || Date.now() };
      });

      const logs = normalizedMetrics.filter(m => m.type === 'log');
      const otherMetrics = normalizedMetrics.filter(m => m.type !== 'log');

      // 5. Storage & Broadcast
      if (otherMetrics.length > 0) {
        writeMetrics(apiKey, otherMetrics);
      }

      if (logs.length > 0) {
        logs.forEach(log => {
          io.to(`project_${projectId}`).emit('new-log', {
            ...log.data,
            timestamp: log.timestamp
          });
        });
      }
      
      res.status(202).json({ status: 'accepted' });
    } catch (error) {
      console.error('Ingestion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
