import { PanelTypeEnum, PaymentStatus } from '@prisma/client';
import {
  IsUUID,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreatePanelDto {
  @IsUUID()
  @IsNotEmpty({ message: 'O companyId é obrigatório.' })
  companyId: string;

  @IsNotEmpty({ message: 'O tipo é obrigatório.' })
  @IsEnum(PanelTypeEnum, { message: 'O tipo deve ser um valor válido.' })
  type: PanelTypeEnum;

  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'O tipo deve ser um valor válido.' })
  active?: PaymentStatus = PaymentStatus.PENDING;

  @IsOptional()
  @IsInt()
  billingPeriod?: number = 3;
}
