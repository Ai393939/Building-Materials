import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RedisService } from './redis/redis.service';

@Controller()
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redis: RedisService,
  ) {}

  @Get('health')
  async check() {
    const database = await this.databaseStatus();
    const cache = await this.redisStatus();
    const body = {
      status: database === 'up' && cache === 'up' ? 'ok' : 'error',
      database,
      redis: cache,
    };

    if (body.status !== 'ok') {
      throw new ServiceUnavailableException(body);
    }

    return body;
  }

  private async databaseStatus(): Promise<'up' | 'down'> {
    try {
      await this.dataSource.query('SELECT 1');
      return 'up';
    } catch {
      return 'down';
    }
  }

  private async redisStatus(): Promise<'up' | 'down'> {
    try {
      const reply = await this.redis.ping();
      return reply === 'PONG' ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }
}
