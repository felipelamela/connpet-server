import { ProductType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  quantity: number;

  @IsDateString()
  @IsOptional()
  validatedAt?: string; // ou Date, dependendo de como você envia no body

  @IsNumber()
  price: number;

  @IsEnum(ProductType)
  type: ProductType;

  @IsUUID()
  clinicId: string;
}
