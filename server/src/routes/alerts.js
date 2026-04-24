const express = require('express');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware to protect routes
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get rules for a project
router.get('/:projectId', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT a.* FROM alert_rules a JOIN projects p ON a.project_id = p.id WHERE p.id = $1 AND p.owner_id = $2',
      [req.params.projectId, req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create an alert rule
router.post('/', authenticate, async (req, res) => {
  const { projectId, metricType, threshold, webhookUrl } = req.body;
  
  try {
    // Verify project ownership
    const project = await db.query('SELECT id FROM projects WHERE id = $1 AND owner_id = $2', [projectId, req.userId]);
    if (project.rows.length === 0) return res.status(403).json({ error: 'Forbidden' });

    const result = await db.query(
      'INSERT INTO alert_rules (project_id, metric_type, threshold, webhook_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [projectId, metricType, threshold, webhookUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete a rule
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM alert_rules a USING projects p WHERE a.project_id = p.id AND a.id = $1 AND p.owner_id = $2',
      [req.params.id, req.userId]
    );
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get alert stats
router.get('/stats/:projectId', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT COUNT(*) FROM alert_history h JOIN projects p ON h.project_id = p.id WHERE p.id = $1 AND p.owner_id = $2',
      [req.params.projectId, req.userId]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
