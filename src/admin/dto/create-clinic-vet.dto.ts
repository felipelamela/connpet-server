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

  @IsString()
  @MaxLength(255)
  @IsNotEmpty({ message: 'Nome fantasia é obrigatório.' })
  tradeName: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  phone?: string;

  @IsUUID()
  @IsOptional()
  addressId?: string;
}
