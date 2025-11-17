import { IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { InternationStatusEnum } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroomingDto {
  @ApiProperty({
    description: 'ID do pet para o grooming',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  petId: string;

  @ApiPropertyOptional({
    description: 'ID do painel',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  panelId?: string;

  @ApiPropertyOptional({
    description: 'ID do serviço',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiPropertyOptional({
    description: 'Status do grooming',
    enum: InternationStatusEnum,
    example: InternationStatusEnum.IN_PROGRESS,
    default: InternationStatusEnum.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(InternationStatusEnum)
  status?: InternationStatusEnum;

  @ApiProperty({
    description: 'Data e hora de início do grooming',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Data e hora de fim do grooming',
    example: '2024-01-15T12:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Descrição do grooming',
    example: 'Banho e tosa completo',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

