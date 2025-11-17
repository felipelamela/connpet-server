import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceCategoryEnum } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ServiceResponseDto {
  @ApiProperty({
    description: 'ID único do serviço',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Consulta Veterinária',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do serviço',
    example: 'Consulta veterinária completa com exame físico',
  })
  description?: string;

  @ApiProperty({
    description: 'Categoria do serviço',
    enum: ServiceCategoryEnum,
    example: ServiceCategoryEnum.CONSULTATION,
  })
  category: ServiceCategoryEnum;

  @ApiPropertyOptional({
    description: 'Duração do serviço em minutos',
    example: 30,
  })
  duration?: number;

  @ApiProperty({
    description: 'Preço do serviço',
    example: 150.0,
    type: 'number',
    format: 'decimal',
  })
  price: Decimal;

  @ApiPropertyOptional({
    description: 'Comissão do serviço',
    example: 15.0,
    type: 'number',
    format: 'decimal',
  })
  commission?: Decimal;

  @ApiProperty({
    description: 'ID do painel',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  panelId: string;

  @ApiProperty({
    description: 'Status ativo do serviço',
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
