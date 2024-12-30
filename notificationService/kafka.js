const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
    clientId: 'email-service',
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });

const connectConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Kafka Consumer connected');
  } catch (error) {
    console.error('Error connecting Kafka Consumer:', error);
  }
};

const subscribeToTopic = async (topic, callback) => {
  try {
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = JSON.parse(message.value.toString());
        callback(value);
      },
    });
  } catch (error) {
    console.error('Error subscribing to topic:', error);
  }
};

module.exports = { connectConsumer, subscribeToTopic };
