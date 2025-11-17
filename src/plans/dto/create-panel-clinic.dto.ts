import { PanelTypeEnum, PaymentStatus } from '@prisma/client';
import { IsUUID, IsNotEmpty, IsEnum, IsInt } from 'class-validator';

export class CreatePanelClinicDto {
  @IsUUID()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  companyId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  planId: string;

  @IsNotEmpty({ message: 'O tipo é obrigatório.' })
  @IsEnum(PanelTypeEnum, { message: 'O tipo deve ser um valor válido.' })
  type: PanelTypeEnum = PanelTypeEnum.CLINIC;

  @IsEnum(PaymentStatus, { message: 'O status deve ser um valor válido.' })
  active: PaymentStatus = PaymentStatus.PENDING;

  @IsInt()
  @IsNotEmpty({ message: 'O período de faturamento é obrigatório.' })
  billingPeriod: number = 3;
}
