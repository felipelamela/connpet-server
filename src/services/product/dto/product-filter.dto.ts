import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean, IsUUID, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProductType } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ProductFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de produto',
    enum: ProductType,
    example: ProductType.FOOD,
  })
  @IsOptional()
  @IsEnum(ProductType, { message: 'Tipo deve ser um valor válido.' })
  type?: ProductType;

  @ApiPropertyOptional({
    description: 'Filtrar por status ativo',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Status ativo deve ser um valor booleano.' })
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar por empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'ID da empresa deve ser um UUID válido.' })
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Buscar por nome do produto',
    example: 'ração',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar produtos próximos do vencimento (em dias)',
    example: 30,
  })
  @IsOptional()
  expirationDays?: number;
}
