import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsUUID,
  IsInt,
  Length,
  MaxLength,
  Matches,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClinicVetDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password: string;

  @IsString()
  @Length(14, 14, { message: 'CNPJ deve ter 14 caracteres' })
  cnpj: string;

  @IsString()
  @MaxLength(255)
  socialName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  tradeName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  cellphone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  technicalManager?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  managerCrmv?: string;

  @IsOptional()
  @IsString()
  @Length(5, 5)
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'Horário deve estar no formato HH:MM',
  })
  openingTime?: string;

  @IsOptional()
  @IsString()
  @Length(5, 5)
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'Horário deve estar no formato HH:MM',
  })
  closingTime?: string;

  @Type(() => Boolean)
  @IsBoolean()
  emergencyService?: boolean;

  @IsOptional()
  @IsString()
  observations?: string;

  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;

  @IsUUID()
  @IsOptional()
  addressId?: string;
}
