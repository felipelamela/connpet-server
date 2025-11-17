import { IsString, IsOptional, IsEnum, IsDateString, IsUUID, IsInt, IsBoolean } from 'class-validator';
import { AppointmentStatusEnum } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'ID do pet para a consulta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  petId: string;

  @ApiProperty({
    description: 'ID do painel',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  panelId?: string;

  @ApiProperty({
    description: 'ID do serviço',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
    @IsUUID()
  serviceId: string;


  @ApiPropertyOptional({
    description: 'ID do veterinário responsável',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  vetId?: string;

  @ApiPropertyOptional({
    description: 'Status da consulta',
    enum: AppointmentStatusEnum,
    example: AppointmentStatusEnum.PENDING,
    default: AppointmentStatusEnum.PENDING,
  })
  @IsOptional()
  @IsEnum(AppointmentStatusEnum)
  status?: AppointmentStatusEnum;

  @ApiProperty({
    description: 'Tipo de consulta (código numérico)',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  type: number;

  @ApiProperty({
    description: 'Especialidade da consulta (código numérico)',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  typeSpecialty: number;

  @ApiPropertyOptional({
    description: 'Descrição da consulta',
    example: 'Consulta de rotina para vacinação anual',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Data e hora agendada para a consulta',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({
    description: 'Para agendamento de consulta',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  forScheduling?: boolean;
}
