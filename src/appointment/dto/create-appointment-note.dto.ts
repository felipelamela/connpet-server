import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentNoteDto {
  @ApiProperty({
    description: 'Descrição da nota',
    example: 'Paciente apresentou melhora significativa após o tratamento.',
  })
  @IsString()
  description: string;
}

