const express = require('express');
const { analyzeError } = require('../services/aiService');
const router = express.Router();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware to protect AI routes - Support both JWT and API Key
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  // 1. Check for API Key (Dashboard/SDK access)
  if (apiKey && apiKey.startsWith('sn_')) {
      return next();
  }

  // 2. Fallback to JWT (Admin access)
  if (!token) return res.status(401).json({ error: 'Unauthorized - No valid token or API Key' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid session token' });
  }
};

router.post('/explain-error', authenticate, async (req, res) => {
  const { errorLog } = req.body;
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!errorLog) {
    return res.status(400).json({ error: 'No error log provided' });
  }

  try {
    const db = require('../config/db');
    let userPlan = 'free';

    if (apiKey) {
      const result = await db.query(
        'SELECT u.plan FROM users u JOIN projects p ON u.id = p.owner_id WHERE p.api_key = $1',
        [apiKey]
      );
      userPlan = result.rows[0]?.plan || 'free';
    } else if (req.userId) {
      const result = await db.query('SELECT plan FROM users WHERE id = $1', [req.userId]);
      userPlan = result.rows[0]?.plan || 'free';
    }

    if (userPlan !== 'pro') {
      return res.status(403).json({ 
        error: 'Pro Feature Only', 
        message: 'AI error analysis is reserved for Pro members. Please upgrade your protocol.' 
      });
    }

    const analysis = await analyzeError(errorLog);
    res.json({ analysis });
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({ error: 'AI Analysis failed' });
  }
});

module.exports = router;
