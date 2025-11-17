import { RoleEnum } from '@prisma/client';
import { IsString, IsEmail, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateUserProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsUUID()
  @IsNotEmpty({ message: 'ID é obrigatorio' })
  companyId: string;

  @IsNotEmpty()
  roles: RoleEnum;
}
