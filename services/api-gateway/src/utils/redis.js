const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
  
  try {
    redisClient = redis.createClient({
      url: redisUrl
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
    console.log('Running without Redis cache');
    return null;
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
