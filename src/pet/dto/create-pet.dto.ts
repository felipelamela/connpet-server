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
  IsEnum,
} from 'class-validator';
import { GenderEnum } from '@prisma/client';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  species: number;

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

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;
}
