import { ProductType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsUUID()
  companyId: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
