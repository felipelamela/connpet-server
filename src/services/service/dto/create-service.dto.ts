import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsNumber,
  IsDecimal,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceCategoryEnum } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Consulta Veterinária',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome do serviço é obrigatório.' })
  @MaxLength(255, {
    message: 'Nome do serviço pode ter no máximo 255 caracteres.',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do serviço',
    example: 'Consulta veterinária completa com exame físico',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Descrição pode ter no máximo 500 caracteres.' })
  description?: string;

  @ApiProperty({
    description: 'Categoria do serviço',
    enum: ServiceCategoryEnum,
    example: ServiceCategoryEnum.CONSULTATION,
  })
  @IsEnum(ServiceCategoryEnum, {
    message: 'Categoria do serviço deve ser um valor válido.',
  })
  @IsNotEmpty({ message: 'Categoria do serviço é obrigatório.' })
  category: ServiceCategoryEnum;

  @ApiPropertyOptional({
    description: 'Duração do serviço em minutos',
    example: 30,
    minimum: 1,
    maximum: 1440,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Duração deve ser um número.' })
  @Min(1, { message: 'Duração deve ser pelo menos 1 minuto.' })
  @Max(1440, { message: 'Duração não pode exceder 1440 minutos (24 horas).' })
  @Type(() => Number)
  duration?: number;

  @ApiProperty({
    description: 'Preço do serviço',
    example: 150.0,
    type: 'number',
    format: 'decimal',
  })
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'Preço deve ter no máximo 2 casas decimais.' },
  )
  @IsNotEmpty({ message: 'Preço é obrigatório.' })
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    description: 'Comissão do serviço',
    example: 15.0,
    type: 'number',
    format: 'decimal',
  })
  @IsOptional()
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'Comissão deve ter no máximo 2 casas decimais.' },
  )
  @Type(() => Number)
  commission?: number;

  @ApiProperty({
    description: 'ID do painel',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID(4, { message: 'ID do painel deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'ID do painel é obrigatório.' })
  panelId: string;

  @ApiPropertyOptional({
    description: 'Status ativo do serviço',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status ativo deve ser um valor booleano.' })
  active?: boolean;
}
