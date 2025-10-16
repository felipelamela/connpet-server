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

export class CreateUserProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsUUID()
  @IsNotEmpty({ message: 'ID é obrigatorio' })
  clinicId?: string;
}
