import { IsEnum, IsUUID } from 'class-validator';

export enum AppointmentItemType {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
}

export class AddAppointmentItemDto {
  @IsEnum(AppointmentItemType, {
    message: 'type deve ser SERVICE ou PRODUCT',
  })
  type: AppointmentItemType;

  @IsUUID(undefined, { message: 'itemId deve ser um UUID válido' })
  itemId: string;
}

