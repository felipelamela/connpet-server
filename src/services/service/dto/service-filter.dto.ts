import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean, IsUUID, IsString } from 'class-validator';
import { ServiceCategoryEnum } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ServiceFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por categoria do serviço',
    enum: ServiceCategoryEnum,
    example: ServiceCategoryEnum.CONSULTATION,
  })
  @IsOptional()
  @IsEnum(ServiceCategoryEnum, { message: 'Categoria deve ser um valor válido.' })
  category?: ServiceCategoryEnum;

  @ApiPropertyOptional({
    description: 'Filtrar por status ativo',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status ativo deve ser um valor booleano.' })
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar por painel',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'ID do painel deve ser um UUID válido.' })
  panelId?: string;

  @ApiPropertyOptional({
    description: 'Buscar por nome do serviço',
    example: 'consulta',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por faixa de preço mínima',
    example: 50.0,
  })
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por faixa de preço máxima',
    example: 200.0,
  })
  @IsOptional()
  maxPrice?: number;
}
