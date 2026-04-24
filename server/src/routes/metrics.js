const express = require('express');
const { queryMetrics } = require('../config/influx');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const INFLUX_BUCKET = process.env.INFLUX_BUCKET;

// Middleware to verify if user owns the project
const verifyProjectAccess = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { apiKey } = req.query; // Dashboard passes apiKey to fetch metrics

    const project = await db.query(
      'SELECT id FROM projects WHERE owner_id = $1 AND api_key = $2',
      [decoded.id, apiKey]
    );

    if (project.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden: Project access denied' });
    }

    req.apiKey = apiKey;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
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
      |> group()
      |> sort(columns: ["_value"], desc: true)
      |> limit(n: 5)
  `;

  try {
    const rows = await queryMetrics(fluxQuery);
    const formatted = rows.map(r => ({
      path: r.path || 'unknown',
      avgLatency: Math.round(r._value),
      calls: 'N/A' // Calls volume requires a different flux query (count)
    }));
    res.json(formatted);
  } catch (err) {
    console.error('❌ InfluxDB Error (Slow Endpoints):', err.message || err);
    res.status(500).json({ error: 'Failed to fetch endpoint analytics' });
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
