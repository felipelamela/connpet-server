import {
  IsString,
  IsOptional,
  IsEmail,
  Length,
  IsNotEmpty,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { RoleEnum } from '@prisma/client';

export class CreateClinicVetUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(RoleEnum)
  @IsNotEmpty()
  roles: RoleEnum;

  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @Length(0, 20)
  document: string;

  @IsString()
  @Length(0, 15)
  phone: string;

  @IsOptional()
  @IsString()
  @Length(0, 15)
  cellphone?: string;
}
