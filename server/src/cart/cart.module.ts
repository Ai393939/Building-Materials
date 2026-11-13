import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Product } from '../products/product.entity';
import { CartItem } from './cart-item.entity';
import { CartController } from './cart.controller';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { PromoCode } from './promo-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, PromoCode, Product]),
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
