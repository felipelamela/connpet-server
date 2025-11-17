import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroomingNoteDto {
  @ApiProperty({
    description: 'Descrição da nota',
    example: 'Pet apresentou comportamento calmo durante o procedimento.',
  })
  @IsString()
  description: string;
}

