// import { Module } from '@nestjs/common';
// import { QueueService } from './queue.service';
// import { BullModule } from '@nestjs/bullmq';

// @Module({
//   imports:[ BullModule.registerQueue({
//     name: process.env.QUEUE_NAME,
//     connection: {
//       host: process.env.REDIS_HOST || '127.0.0.1',
//       port: parseInt(process.env.REDIS_PORT, 10) || 6379,
//     },
//   }),],
//   controllers: [],
//   providers: [QueueService],  
//   exports:[QueueService]
// })
// export class QueueModule {}

import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueProcessor } from './queue.processor';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined, // Enable TLS if needed
      },
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  providers: [QueueProcessor, QueueService],
  exports: [QueueService],
})
export class QueueModule {}
