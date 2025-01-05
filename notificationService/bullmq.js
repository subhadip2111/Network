const { Queue } = require('bullmq');
const dotenv = require('dotenv');
const IORedis = require('ioredis');

dotenv.config();

// Create an ioredis client
const redisClient = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: 'default',
  password: process.env.REDIS_PASSWORD, 
   maxRetriesPerRequest: null,



});


(async () => {
  try {
    // Verify Redis connection
    await redisClient.ping();
    console.log('Redis client successfully connected');
    

  } catch (error) {
    console.error('Error during queue initialization:', error);
  }
})();

// Export email queue after initialization
module.exports = { redisClient };
