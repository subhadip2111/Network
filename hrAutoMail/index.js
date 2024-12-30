const express = require('express');
const multer = require('multer');
const path = require('path');
const { connectProducer, sendMessage } = require('./kafka');
require('dotenv').config();

const csvToJson = require('./utils/csvToJson.js');

const mongoose = require('mongoose');
const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 3001;
const TOPIC = process.env.TOPIC;

// Connect Kafka Producer
connectProducer();

// Upload CSV file and process
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, req.file.path);

    // Convert CSV to JSON
    const jsonData = await csvToJson(filePath);

    // Push data to Kafka
    for (const record of jsonData) {
      await sendMessage(TOPIC, record);
    }

   return  res.status(200).json({ message: 'File processed and data sent to Kafka.' });
  } catch (error) {
    console.error('Error processing file:', error);
   return  res.status(500).json({ error: 'Error processing file.' });
  }
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
})
app.listen(PORT, () => {
  console.log(`User Service running at http://localhost:${PORT}`);
});
