import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsArray()
  @ArrayMinSize(3)
  @IsUrl({}, { each: true })
  images: string[];

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @IsString()
  @MinLength(1)
  category: string;

  @IsOptional()
  @IsObject()
  specifications?: Record<string, string>;
}
