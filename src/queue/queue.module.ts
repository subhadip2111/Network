/* eslint-disable prettier/prettier */

import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueProcessor } from './queue.processor';
import { QueueService } from './queue.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    EmailModule,
    BullModule.forRootAsync({
      useFactory: () => {
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
        const redisUsername = process.env.REDIS_USERNAME || undefined;
        const redisPassword = process.env.REDIS_PASSWORD || undefined;
        const useTLS = process.env.REDIS_TLS === 'true';

        return {
          redis: {
            host: redisHost,
            port: redisPort,
            username: redisUsername,
            password: redisPassword,
            tls: useTLS ? {} : undefined,
          },
        };
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
