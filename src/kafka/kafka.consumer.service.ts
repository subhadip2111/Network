// src/modules/kafka/kafka.consumer.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { PostService } from 'src/post/post.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;

  constructor(private readonly postsService: PostService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER],
    });

    this.consumer = kafka.consumer({ 
      groupId: process.env.KAFKA_GROUP_ID 
    });

    await this.consumer.connect();
    await this.consumer.subscribe({ 
      topic: 'post-reactions', 
      fromBeginning: true 
    });

    await this.consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        const reactionEvent = JSON.parse(message.value.toString());
        // await this.postsService.processReactionEvent(reactionEvent);
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}