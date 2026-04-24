require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { Queue } = require('bullmq');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger for debugging 404s
app.use((req, res, next) => {
  console.log(`🔍 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/ai', require('./routes/ai'));
app.use('/v1/ingest', require('./routes/ingest')(io));

const db = require('./config/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Socket.io Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('⚡ Dashboard secured connection:', socket.id);
  
  socket.on('join-project', async (projectId) => {
    try {
      // Verify ownership because anyone can emit 'join-project' with any ID
      const project = await db.query(
        'SELECT id FROM projects WHERE id = $1 AND owner_id = $2', 
        [projectId, socket.userId]
      );

      if (project.rows.length > 0) {
        socket.join(`project_${projectId}`);
        console.log(`📡 Dashboard verified & joined: project_${projectId}`);
      } else {
        console.warn(`🚨 Unauthorized attempt by ${socket.userId} to join project ${projectId}`);
      }
    } catch (err) {
      console.error('Socket room join error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Dashboard disconnected');
  });
});

// Initialize Alerting
const { alertWorker } = require('./workers/alertWorker');
const alertQueue = new Queue('alert-queue', { 
  connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } 
});

// Schedule alert check every 1 minute
alertQueue.add('check-rules', {}, {
  repeat: { pattern: '* * * * *' } 
}).then(() => console.log('⏰ Alert checker scheduled (every 1m)'));

server.listen(PORT, () => {
  console.log(`🚀 Sentinel Server running on port ${PORT}`);
});
