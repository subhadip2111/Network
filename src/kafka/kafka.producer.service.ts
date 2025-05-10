import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('KafkaProducer');
  private producer: Producer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER],
    });

    this.producer = kafka.producer();
    
    // Setup event listeners
    this.producer.on('producer.connect', () => {
      this.logger.log('Connected to Kafka broker');
    });
    
    this.producer.on('producer.disconnect', () => {
      this.logger.warn('Disconnected from Kafka broker');
    });
    
    this.producer.on('producer.network.request_timeout', () => {
      this.logger.error('Network request timeout');
    });

    try {
      await this.producer.connect();
      this.logger.log('Producer ready');
    } catch (err) {
      this.logger.error('Failed to connect producer', err);
      throw err;
    }
  }

  async produce(topic: string, message: any) {
    this.logger.debug(`Producing message to ${topic}`);
    const record: ProducerRecord = {
      topic,
      messages: [{ value: JSON.stringify(message) }],
    };
    
    try {
      const result = await this.producer.send(record);
      this.logger.debug(`Message produced to ${topic}`, {
        partition: result[0].partition,
        offset: result[0].offset
      });
      return result;
    } catch (err) {
      this.logger.error(`Failed to produce message to ${topic}`, err);
      throw err;
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      this.logger.log('Producer disconnected');
    } catch (err) {
      this.logger.error('Failed to disconnect producer', err);
    }
  }
}