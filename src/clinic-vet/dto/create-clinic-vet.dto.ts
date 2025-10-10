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
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClinicVetDto {
  @IsString()
  @Length(14, 14, { message: 'CNPJ deve ter 14 caracteres' })
  socialNumber: string;

  @IsString()
  @MaxLength(255)
  socialName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  tradeName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  stateRegistration?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  municipalRegistration?: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

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
  @MaxLength(20)
  crmv?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  crmvState?: number;

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

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  emergencyService?: boolean;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;

  // @IsUUID()
  // @IsOptional()
  // addressId?: string;
}
