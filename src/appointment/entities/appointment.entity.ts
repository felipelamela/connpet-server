import { AppointmentStatusEnum } from '@prisma/client';

export class AppointmentEntity {
  id?: string;
  petId: string;
  panelId: string;
  vetId?: string;
  paymentOrderId: string;
  status: AppointmentStatusEnum;
  type: number;
  typeSpecialty: number;
  description?: string;
  scheduledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<AppointmentEntity>) {
    Object.assign(this, partial);
  }
}
