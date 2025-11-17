import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID único do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Ração Premium para Cães',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Ração premium com ingredientes naturais para cães adultos',
  })
  description?: string;

  @ApiProperty({
    description: 'Tipo do produto',
    enum: ProductType,
    example: ProductType.FOOD,
  })
  type: ProductType;

  @ApiProperty({
    description: 'ID da empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  companyId: string;

  @ApiPropertyOptional({
    description: 'Número do lote do produto',
    example: 'LOT2024001',
  })
  batchNumber?: string;

  @ApiPropertyOptional({
    description: 'Fabricante do produto',
    example: 'PetFood Industries',
  })
  manufacturer?: string;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
  })
  quantity: number;

  @ApiProperty({
    description: 'Preço de compra do produto',
    example: 25.50,
    type: 'number',
    format: 'decimal',
  })
  pricePay: Decimal;

  @ApiProperty({
    description: 'Preço de venda do produto',
    example: 35.90,
    type: 'number',
    format: 'decimal',
  })
  priceSale: Decimal;

  @ApiProperty({
    description: 'Data de validade do produto',
    example: '2025-12-31T23:59:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  expirationDate: Date;

  @ApiProperty({
    description: 'Status ativo do produto',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

}
