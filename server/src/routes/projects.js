const express = require('express');
const crypto = require('crypto');
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

// Get user's projects
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects WHERE owner_id = $1', [req.userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create a new project
router.post('/', authenticate, async (req, res) => {
  const { name } = req.body;
  const apiKey = `sn_${crypto.randomBytes(16).toString('hex')}`;
  
  try {
    const result = await db.query(
      'INSERT INTO projects (owner_id, name, api_key) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, name, apiKey]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update project name
router.put('/:id', authenticate, async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      'UPDATE projects SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING *',
      [name, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING api_key',
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    // Clean up Redis cache for this API key
    const apiKey = result.rows[0].api_key;
    const redis = require('../config/redis');
    await redis.del(`project_key:${apiKey}`);

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
