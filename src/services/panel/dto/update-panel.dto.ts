import { PanelTypeEnum } from '@prisma/client';
import { IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePanelDto {
  @IsOptional()
  @IsEnum(PanelTypeEnum, { message: 'O tipo deve ser um valor válido.' })
  type?: PanelTypeEnum;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  openingTime?: Date;

  @IsOptional()
  closingTime?: Date;
}
