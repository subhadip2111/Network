// redis.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class CacheService implements OnModuleInit {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: `redis://${process.env.POST_SERVICE_REDIS_HOST}:${process.env.POST_SERVICE_REDIS_PORT}`,
    });
    await this.client.connect();
  }

  async set(key: string, value: any) {
    await this.client.set(key, JSON.stringify(value));
  }

  // async get(key: string) {
  //   const data = await this.client.get(key);
  //   return data ? JSON.parse(data) : null;
  // }

  async increment(key: string) {
    return await this.client.incr(key);
  }

  async hSet(key: string, field: string, value: any) {
    await this.client.hSet(key, field, JSON.stringify(value));
  }

  // async hGetAll(key: string) {
  //   const data = await this.client.hGetAll(key);
  //   return Object.fromEntries(
  //     Object.entries(data).map(([k, v]) => [k, JSON.parse(v)])
  //   );
  // }

  async sAdd(key: string, value: string) {
    await this.client.sAdd(key, value);
  }

  async sMembers(key: string) {
    return await this.client.sMembers(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}