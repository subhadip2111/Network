// src/modules/redis/redis.module.ts
import { Module, Logger } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisService } from './redis.service';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => {
        const logger = new Logger('RedisModule');
        logger.log(`Connecting to Redis at ${process.env.POST_SERVICE_REDIS_HOST}:${process.env.POST_SERVICE_REDIS_PORT}`);
        
        return {
          store: redisStore,
          host: process.env.POST_SERVICE_REDIS_HOST,
          port: parseInt(process.env.POST_SERVICE_REDIS_PORT),
          ttl: 0,
          retry_strategy: (options) => {
            if (options.error && options.error.code === 'ECONNREFUSED') {
              logger.error('Redis connection refused');
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
              logger.error('Redis retry time exhausted');
              return new Error('Retry time exhausted');
            }
            if (options.attempt > 10) {
              logger.error('Redis max attempts reached');
              return undefined;
            }
            return Math.min(options.attempt * 100, 5000);
          }
        } as any;
      }
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}