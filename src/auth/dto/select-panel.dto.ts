import { IsEnum, IsUUID } from 'class-validator';
import { PanelTypeEnum } from '@prisma/client';

export class SelectPanelDto {
  @IsUUID(undefined, { message: 'panelId deve ser um UUID válido.' })
  panelId: string;

  @IsEnum(PanelTypeEnum, { message: 'panelType deve ser um valor válido.' })
  panelType: PanelTypeEnum;
}


