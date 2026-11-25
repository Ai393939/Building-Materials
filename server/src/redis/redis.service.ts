import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(config: ConfigService) {
    const url = config.getOrThrow<string>('REDIS_URL');
    this.client = new Redis(url, { maxRetriesPerRequest: 3 });
    this.client.on('error', (error: Error) => {
      this.logger.error(error.message);
    });
  }

  ping(): Promise<string> {
    return this.client.ping();
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const keys: string[] = [];
    const stream = this.client.scanStream({ match: `${prefix}*`, count: 100 });

    for await (const batch of stream) {
      keys.push(...(batch as string[]));
    }

    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
