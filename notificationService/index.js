const express = require('express');
const nodemailer = require('nodemailer');
const { connectConsumer, subscribeToTopic } = require('./kafka');
const { emailQueue } = require('./bullmq');
const { Worker } = require('bullmq');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send email
const sendEmail = async (from, to, subject, text) => {
  try {
    await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Kafka Consumer Setup
connectConsumer();
subscribeToTopic(process.env.TOPIC, async (data) => {
  await emailQueue.add('emailList', data);

  const { name, HrEmail, companyName, position, HrName, MyEmail, skills } = data;

  const to = HrEmail;
  const from = MyEmail;
  const subject = `Job Application for ${position} at ${companyName}`;
  const text = `Dear Hr ${HrName},\n\nI hope this email finds you well. My name is ${name}, and I am writing to express my interest in the ${position} position at ${companyName}. I possess the following skills that align with the job requirements:\n\n${skills}.\n\nI am confident that my skills and experience make me a strong candidate for this position. Please feel free to contact me if you have any questions or require additional information.\n\nThank you for considering my application. I look forward to the opportunity to discuss how I can contribute to ${companyName}.\n\nBest Regards,\n${name}`;
  await sendEmail(from, to, subject, text);
});

// Worker options
const workerOptions = {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  limiter: {
    groupKey: 'emailQueue', 
    max: 10, 
    duration: 1000,
  },
  attempts: 3, 
  backoff: {
    type: 'exponential',
    delay: 1000, 
  },
};

// Define the email worker
const emailWorker = new Worker(
  'emailQueue', 
  async (job) => {
    const { HrEmail, MyEmail, subject, text } = job.data;

    try {
      await sendEmail(MyEmail, HrEmail, subject, text);
      console.log(`Email sent to ${HrEmail}`);

      return job.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error; 
    }
  },
  workerOptions
);

emailWorker.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

emailWorker.on('failed', (job, err) => {
  console.log(`Job failed: ${job.id}, Error: ${err.message}`);
});

app.get('/sendEmail', async (req, res) => {
  try {
 
    const job = await emailQueue.add('emailList', { /* job data */ });

    return res.status(200).json({
      message: 'Email processing started in the background.',
    });
  } catch (error) {
    console.error('Error starting email processing:', error);
    return res.status(500).json({ message: 'Error starting email processing', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Notification Service running at http://localhost:${PORT}`);
});
