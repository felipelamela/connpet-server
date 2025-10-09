import { IsString, IsEmail, IsNotEmpty, IsOptional, IsInt, MinLength } from 'class-validator';

export class CreateNewUserDTO {
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

  @IsOptional()
  @IsString()
  document?: string;

  @IsInt({ message: 'O campo role deve ser um número inteiro.' })
  role: number;
}
