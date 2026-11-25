import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { typeOrmConfig } from './config/typeorm.config';
import { HealthController } from './health.controller';
import { ProductsModule } from './products/products.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    RedisModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    CartModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
