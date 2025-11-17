import { IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { InternationStatusEnum } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGroomingDto {
  @ApiPropertyOptional({
    description: 'Status do grooming',
    enum: InternationStatusEnum,
    example: InternationStatusEnum.DISCHARGED,
  })
  @IsOptional()
  @IsEnum(InternationStatusEnum)
  status?: InternationStatusEnum;

  @ApiPropertyOptional({
    description: 'Data e hora de início do grooming',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

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

