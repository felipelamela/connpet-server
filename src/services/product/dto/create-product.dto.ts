import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsNumber,
  IsDecimal,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Ração Premium para Cães',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome do produto é obrigatório.' })
  @MaxLength(255, {
    message: 'Nome do produto pode ter no máximo 255 caracteres.',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Ração premium com ingredientes naturais para cães adultos',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Descrição pode ter no máximo 500 caracteres.' })
  description?: string;

  @ApiProperty({
    description: 'Tipo do produto',
    enum: ProductType,
    example: ProductType.FOOD,
  })
  @IsEnum(ProductType, { message: 'Tipo do produto deve ser um valor válido.' })
  @IsNotEmpty({ message: 'Tipo do produto é obrigatório.' })
  type: ProductType;

  @ApiPropertyOptional({
    description: 'Número do lote do produto',
    example: 'LOT2024001',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Número do lote pode ter no máximo 100 caracteres.' })
  batchNumber?: string;

  @ApiPropertyOptional({
    description: 'Fabricante do produto',
    example: 'PetFood Industries',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Fabricante pode ter no máximo 255 caracteres.' })
  manufacturer?: string;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Quantidade deve ser um número.' })
  @Min(0, { message: 'Quantidade deve ser maior ou igual a zero.' })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Preço de compra do produto',
    example: 25.50,
    type: 'number',
    format: 'decimal',
  })

  @IsNotEmpty({ message: 'Preço de compra é obrigatório.' })
  pricePay: string;

  @ApiProperty({
    description: 'Preço de venda do produto',
    example: 35.90,
    type: 'number',
    format: 'decimal',
  })
  @IsNotEmpty({ message: 'Preço de venda é obrigatório.' })
  priceSale: string;

  @ApiProperty({
    description: 'Data de validade do produto',
    example: '2025-12-31T23:59:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString({}, { message: 'Data de validade deve ser uma data válida.' })
  @IsNotEmpty({ message: 'Data de validade é obrigatória.' })
  expirationDate: Date;

  @ApiPropertyOptional({
    description: 'Status ativo do produto',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status ativo deve ser um valor booleano.' })
  active?: boolean;
}
