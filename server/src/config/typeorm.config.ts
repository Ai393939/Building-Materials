import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeOrmConfig(config: ConfigService): TypeOrmModuleOptions {
  const url = config.getOrThrow<string>('DATABASE_URL');
  const sslFlag = config.get<string>('DATABASE_SSL');
  const useSsl = sslFlag === 'true' || url.includes('sslmode=require');

  const options = {
    type: 'postgres' as const,
    url,
    autoLoadEntities: true,
    synchronize: config.get<string>('NODE_ENV') !== 'production',
    retryAttempts: 10,
    retryDelay: 3000,
  };

  if (!useSsl) {
    return options;
  }

  return {
    ...options,
    ssl: { rejectUnauthorized: false },
  };
}
