// src/modules/redis/redis.service.ts (alternative)
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger('RedisService');
  public readonly client: ReturnType<typeof createClient>;

  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.POST_SERVICE_REDIS_HOST,
        port: parseInt(process.env.POST_SERVICE_REDIS_PORT),
        reconnectStrategy: (retries) => {
          this.logger.warn(`Redis reconnecting attempt ${retries}`);
          return Math.min(retries * 100, 5000);
        }
      }
    });
    this.setupEventListeners();
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Redis connected successfully');
    } catch (err) {
      this.logger.error('Redis connection failed', err.message);
      throw err;
    }
  }

  private setupEventListeners() {
    this.client.on('connect', () => {
      this.logger.debug('Redis connecting...');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis error', err.message);
    });

    this.client.on('reconnecting', () => {
      this.logger.warn('Redis reconnecting...');
    });

    this.client.on('end', () => {
      this.logger.warn('Redis connection closed');
    });
  }
}