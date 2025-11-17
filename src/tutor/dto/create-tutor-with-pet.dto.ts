import {
  IsString,
  IsEmail,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsNumber,
  IsDateString,
  Length,
  IsEnum,
} from 'class-validator';
import { StateEnum, GenderEnum } from '@prisma/client';

export class CreateTutorWithPetDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @Length(8, 8, {
    message: 'O CEP deve conter exatamente 8 dígitos (somente números).',
  })
  cep: string;

  @IsString()
  @IsNotEmpty({ message: 'A rua é obrigatória.' })
  @MaxLength(255, { message: 'A rua pode ter no máximo 255 caracteres.' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @MaxLength(10, { message: 'O número pode ter no máximo 10 caracteres.' })
  number: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'O complemento pode ter no máximo 255 caracteres.',
  })
  complement?: string;

  @IsString()
  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @MaxLength(100, { message: 'O bairro pode ter no máximo 100 caracteres.' })
  neighborhood: string;

  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @MaxLength(100, { message: 'A cidade pode ter no máximo 100 caracteres.' })
  city: string;

  @IsEnum(StateEnum, {
    message: 'O estado deve ser um estado válido do Brasil.',
  })
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  state: StateEnum;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'O país pode ter no máximo 100 caracteres.' })
  country?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  namePet: string;

  @IsNotEmpty()
  species: number;

  @IsNumber()
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

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;
}
