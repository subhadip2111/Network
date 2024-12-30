
const {Queue, Worker} =require('bullmq')

require('dotenv').config();
const emailQueue = new Queue('emailQueue',{
    connection:{
        host:process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});


const workerFunction = () => {
    const myWorker = new Worker('emailQueue', async (job) => {
      console.log("Processing job:", job.id, job.data);
      return job.data;
    }, {
      connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });
  
    myWorker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });
  
    myWorker.on('failed', (job, err) => {
      console.log(`Job ${job.id} failed with error:`, err);
    });
  };

module.exports = {emailQueue, workerFunction};