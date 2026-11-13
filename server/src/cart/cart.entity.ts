import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { CartItem } from './cart-item.entity';
import { PromoCode } from './promo-code.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'promo_code_id', type: 'int', nullable: true })
  promoCodeId: number | null;

  @ManyToOne(() => PromoCode, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'promo_code_id' })
  promoCode: PromoCode | null;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
