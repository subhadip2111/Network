import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports:[ BullModule.registerQueue({
    name: 'emailQueue',
    connection: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
  }),],
  controllers: [QueueController],
  providers: [QueueService],  
})
export class QueueModule {}
