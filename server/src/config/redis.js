const Redis = require('ioredis');

let redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Force TLS for cloud environments (Upstash/Render)
const redisOptions = {};
if (!redisUrl.includes('localhost')) {
  redisOptions.tls = { rejectUnauthorized: false };
  // Force secure protocol if provided as redis://
  if (redisUrl.startsWith('redis://')) {
    redisUrl = redisUrl.replace('redis://', 'rediss://');
  }
}

const redis = new Redis(redisUrl, redisOptions);

redis.on('connect', () => {
  console.log('🔴 Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis Error:', err);
});

module.exports = redis;
