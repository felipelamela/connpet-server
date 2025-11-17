import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateInternationDto {
  @IsString()
  @IsNotEmpty({ message: 'ID do pet é obrigatório' })
  petId: string;

  @IsString()
  @IsNotEmpty({ message: 'ID da clínica é obrigatório' })
  companyId: string;

  @IsString()
  @IsNotEmpty({ message: 'ID do veterinário é obrigatório' })
  vetId: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
