const express = require('express');
const { queryMetrics } = require('../config/influx');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const INFLUX_BUCKET = process.env.INFLUX_BUCKET;

// Middleware to verify if user owns the project - Supports JWT or API Key
const verifyProjectAccess = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { apiKey } = req.query;

  // 1. Prioritize API Key (Used by Dashboard for specific project views)
  if (apiKey && apiKey.startsWith('sn_')) {
      req.apiKey = apiKey;
      return next();
  }

  // 2. Fallback to JWT (Required for Admin actions/Initial load)
  if (!token) return res.status(401).json({ error: 'Unauthorized - No valid token or API Key provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify database link if we only have the token
    const project = await db.query(
      'SELECT api_key FROM projects WHERE owner_id = $1 LIMIT 1',
      [decoded.id]
    );

    if (project.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden: No projects found for this account' });
    }

    req.apiKey = project.rows[0].api_key;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid session token' });
  }
};

// GET System Metrics (CPU/RAM)
router.get('/system', verifyProjectAccess, async (req, res) => {
  const { start, end } = req.query;
  const timeStart = start || '-1h';
  const timeEnd = end || 'now()';

  const fluxQuery = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: ${timeStart}, stop: ${timeEnd})
      |> filter(fn: (r) => r["_measurement"] == "system_metrics")
      |> filter(fn: (r) => r["project_key"] == "${req.apiKey}")
      |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
      |> yield(name: "mean")
  `;

  try {
    const rows = await queryMetrics(fluxQuery);
    
    // Transform Flux rows into a structure Recharts likes
    // { time: '10:00', cpuUsage: 25, ramUsage: 40 }
    const formattedData = rows.reduce((acc, row) => {
      const time = new Date(row._time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (!acc[time]) acc[time] = { time };
      acc[time][row._field] = parseFloat(row._value.toFixed(2));
      return acc;
    }, {});

    res.json(Object.values(formattedData));
  } catch (err) {
    console.error('❌ InfluxDB Error (System):', err.message || err);
    res.status(500).json({ error: 'Failed to fetch system metrics' });
  }
});

// GET Slowest Endpoints
router.get('/slow-endpoints', verifyProjectAccess, async (req, res) => {
  const fluxQuery = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: -24h)
      |> filter(fn: (r) => r["_measurement"] == "api_performance")
      |> filter(fn: (r) => r["project_key"] == "${req.apiKey}")
      |> filter(fn: (r) => r["_field"] == "duration")
      |> group(columns: ["path"])
      |> mean()
      |> yield(name: "mean")
  `;

  try {
    const rows = await queryMetrics(fluxQuery);
    
    // Gracefully handle empty datasets
    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    const formatted = rows.map(r => ({
      path: r.path || 'unknown',
      avgLatency: Math.round(r._value || 0),
      calls: 'N/A'
    }));
    res.json(formatted);
  } catch (err) {
    console.error('❌ InfluxDB Error (Slow Endpoints):', err.message || err);
    // Return empty array on query failure to keep UI stable
    res.json([]);
  }
});

// GET Database Performance
router.get('/db-performance', verifyProjectAccess, async (req, res) => {
  const fluxQuery = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: -24h)
      |> filter(fn: (r) => r["_measurement"] == "db_performance")
      |> filter(fn: (r) => r["project_key"] == "${req.apiKey}")
      |> filter(fn: (r) => r["_field"] == "duration")
      |> group(columns: ["query"])
      |> mean()
      |> yield(name: "mean")
  `;

  try {
    const data = await queryMetrics(fluxQuery);
    const formatted = data.map(r => ({
      query: r.query,
      avgLatency: r._value,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Flux query failed' });
  }
});

module.exports = router;
