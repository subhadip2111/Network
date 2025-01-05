const express = require('express');
const nodemailer = require('nodemailer');
const { Worker, Queue } = require('bullmq');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Email Log Schema and Model
const emailLogSchema = new mongoose.Schema({
  from: String,
  to: String,
  subject: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

// Express App and Port
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON requests
app.use(express.json());

// Nodemailer Transporter
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
      from,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

// Queue Setup
const emailQueue = new Queue('emailQueue', { connection: require('./bullmq').redisClient });

// Worker API Endpoint
app.post('/process', async (req, res) => {
  const { userEmail } = req.body;
  const worker = new Worker(
    'emailQueue',
    async (job) => {
      console.log("jobData",job.data)
      if (job.data.MyEmail === userEmail) {
        console.log("object",job.data)
        const { name, HrEmail, companyName, position, HrName, MyEmail, skills } = job.data;
        try {
          const to = HrEmail;
          const from = MyEmail;
          const subject = `Job Application for ${position} at ${companyName}`;
          const text = `Dear Hr ${HrName},\n\nI hope this email finds you well. My name is ${name}, and I am writing to express my interest in the ${position} position at ${companyName}. I possess the following skills that align with the job requirements:\n\n${skills}.\n\nI am confident that my skills and experience make me a strong candidate for this position. Please feel free to contact me if you have any questions or require additional information.\n\nThank you for considering my application. I look forward to the opportunity to discuss how I can contribute to ${companyName}.\n\nBest Regards,\n${name}`;

          await sendEmail(from, to, subject, text);
          const newEmailLog = new EmailLog({ from, to, subject, text });
          await newEmailLog.save();
          await job.finished();

          await job.remove();

        } catch (error) {
          console.error(`Error processing job ${job.id}:`, error.message);

          // Move the job to the failed queue
          await job.moveToFailed({ message: error.message });
        }
      } else {
        await emailQueue.add('sendEmail', job.data);
      }
    },
    { connection: require('./bullmq').redisClient,removeOnFail: { count: 0 } }
  );

  return res.status(200).json({
    message: `Worker started to process jobs for userEmail  ${userEmail}` 

  });
});
// Start Server
app.listen(PORT, () => {
  console.log(`Notification Service running at http://localhost:${PORT}`);
});
