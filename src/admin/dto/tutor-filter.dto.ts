import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class TutorFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Buscar por nome ou email do tutor',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

