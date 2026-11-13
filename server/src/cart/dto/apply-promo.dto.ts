import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyPromoDto {
  @IsString()
  @IsNotEmpty({ message: 'Введите промокод' })
  code: string;
}
