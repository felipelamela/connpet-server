import { PanelTypeEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsString()
  price: any;

  @IsBoolean()
  @IsDefined()
  active: boolean;

  @IsNotEmpty({ message: 'O tipo é obrigatório.' })
  type: PanelTypeEnum;

  @IsOptional()
  @IsInt()
  maxUsers?: number;
}
