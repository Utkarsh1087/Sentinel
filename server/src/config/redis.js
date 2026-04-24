const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisOptions = redisUrl.includes('localhost') ? {} : { tls: { rejectUnauthorized: false } };

const redis = new Redis(redisUrl, redisOptions);

redis.on('connect', () => {
  console.log('🔴 Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis Error:', err);
});

module.exports = redis;
