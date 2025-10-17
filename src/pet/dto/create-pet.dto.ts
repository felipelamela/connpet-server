import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsInt,
  IsDateString,
  IsNumber,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  species: string;

  @IsInt()
  breed: number;

  @IsDateString()
  @IsOptional()
  birthDate: Date;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  color: string;

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  microchipNumber: string;

  @IsString()
  @IsOptional()
  observations: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsUUID()
  @IsNotEmpty()
  tutorId: string;

  @IsNotEmpty()
  gender: number;
}
