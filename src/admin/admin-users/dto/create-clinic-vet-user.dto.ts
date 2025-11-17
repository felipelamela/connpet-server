import {
  IsString,
  IsOptional,
  IsEmail,
  Length,
  IsNotEmpty,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { RoleEnum, StateEnum } from '@prisma/client';

export class CreateClinicVetUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(RoleEnum)
  @IsNotEmpty()
  roles: RoleEnum;

  @IsString()
  @Length(0, 20)
  document: string;

  @IsString()
  @Length(0, 15)
  phone: string;

  @IsOptional()
  @IsString()
  crmv?: string;

  @IsOptional()
  @IsEnum(StateEnum)
  crmvState?: StateEnum;
}
