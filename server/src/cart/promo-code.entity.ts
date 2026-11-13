import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('promo_codes')
export class PromoCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'discount_percentage', type: 'int' })
  discountPercentage: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
