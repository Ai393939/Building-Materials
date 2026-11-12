import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

const decimalToNumber = {
  to: (value: number) => value,
  from: (value: string | null) => (value === null ? 0 : Number(value)),
};

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalToNumber })
  price: number;

  @Column({ type: 'float' })
  rating: number;

  @Column({ type: 'jsonb' })
  images: string[];

  @Column({ name: 'stock_quantity', type: 'int' })
  stockQuantity: number;

  @Column()
  category: string;

  @Column({ type: 'jsonb', nullable: true })
  specifications: Record<string, string> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', select: false })
  deletedAt?: Date;
}
