import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @Length(8, 8, {
    message: 'O CEP deve conter exatamente 8 dígitos (somente números).',
  })
  cep: string;

  @IsString()
  @IsNotEmpty({ message: 'A rua é obrigatória.' })
  @MaxLength(255, { message: 'A rua pode ter no máximo 255 caracteres.' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @MaxLength(10, { message: 'O número pode ter no máximo 10 caracteres.' })
  number: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'O complemento pode ter no máximo 255 caracteres.',
  })
  complement?: string;

  @IsString()
  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @MaxLength(100, { message: 'O bairro pode ter no máximo 100 caracteres.' })
  neighborhood: string;

  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @MaxLength(100, { message: 'A cidade pode ter no máximo 100 caracteres.' })
  city: string;

  @IsInt({ message: 'O estado deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  state: number;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'O país pode ter no máximo 100 caracteres.' })
  country?: string;
}
