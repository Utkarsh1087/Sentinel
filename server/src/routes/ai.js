const express = require('express');
const { analyzeError } = require('../services/aiService');
const router = express.Router();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware to protect AI routes
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

router.post('/explain-error', authenticate, async (req, res) => {
  const { errorLog } = req.body;

  if (!errorLog) {
    return res.status(400).json({ error: 'No error log provided' });
  }

  try {
    const analysis = await analyzeError(errorLog);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: 'AI Analysis failed' });
  }
});

module.exports = router;
