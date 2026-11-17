import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyPromoDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Введите промокод' })
  code: string;
}
