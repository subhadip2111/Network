const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka Producer connected');
  } catch (error) {
    console.error('Error connecting Kafka Producer:', error);
  }
};

const sendMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Message sent to topic ${topic}:`, message);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

module.exports = { connectProducer, sendMessage };
