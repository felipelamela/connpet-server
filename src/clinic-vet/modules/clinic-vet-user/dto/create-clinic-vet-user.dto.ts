import {
  IsString,
  IsOptional,
  IsEmail,
  Length,
  Matches,
  IsNumber,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateClinicVetUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  roles: number;

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
