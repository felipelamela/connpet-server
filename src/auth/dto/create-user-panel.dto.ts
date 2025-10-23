import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  Length,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { StateEnum, RoleEnum } from '@prisma/client';

export class CreateUserPanelDto {
  // Dados da empresa
  @IsString()
  @IsNotEmpty({ message: 'Razão social é obrigatória.' })
  @MaxLength(255, { message: 'Razão social pode ter no máximo 255 caracteres.' })
  socialName: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome fantasia é obrigatório.' })
  @MaxLength(255, { message: 'Nome fantasia pode ter no máximo 255 caracteres.' })
  tradeName: string;

  @IsString()
  @Length(14, 14, { message: 'CNPJ deve ter exatamente 14 caracteres.' })
  @IsNotEmpty({ message: 'CNPJ é obrigatório.' })
  cnpj: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(15, { message: 'Telefone pode ter no máximo 15 caracteres.' })
  phone?: string;

  // Dados do endereço
  @IsString()
  @Length(8, 8, { message: 'CEP deve ter exatamente 8 dígitos.' })
  @IsNotEmpty({ message: 'CEP é obrigatório.' })
  cep: string;

  @IsString()
  @IsNotEmpty({ message: 'Rua é obrigatória.' })
  @MaxLength(255, { message: 'Rua pode ter no máximo 255 caracteres.' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'Número é obrigatório.' })
  @MaxLength(10, { message: 'Número pode ter no máximo 10 caracteres.' })
  number: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Complemento pode ter no máximo 255 caracteres.' })
  complement?: string;

  @IsString()
  @IsNotEmpty({ message: 'Bairro é obrigatório.' })
  @MaxLength(100, { message: 'Bairro pode ter no máximo 100 caracteres.' })
  neighborhood: string;

  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória.' })
  @MaxLength(100, { message: 'Cidade pode ter no máximo 100 caracteres.' })
  city: string;

  @IsEnum(StateEnum, { message: 'Estado deve ser um estado válido do Brasil.' })
  @IsNotEmpty({ message: 'Estado é obrigatório.' })
  state: StateEnum;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'País pode ter no máximo 100 caracteres.' })
  country?: string;

  // Dados do usuário
  @IsString()
  @IsNotEmpty({ message: 'Documento é obrigatório.' })
  @MaxLength(20, { message: 'Documento pode ter no máximo 20 caracteres.' })
  document: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'CRMV pode ter no máximo 20 caracteres.' })
  crmv?: string;

  @IsOptional()
  @IsEnum(StateEnum, { message: 'Estado do CRMV deve ser um estado válido do Brasil.' })
  crmvState?: StateEnum;

  @IsEnum(RoleEnum, { message: 'Role deve ser um valor válido.' })
  @IsNotEmpty({ message: 'Role é obrigatório.' })
  roles: RoleEnum;
}
  