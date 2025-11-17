import { InternationStatusEnum } from '@prisma/client';

export class GroomingEntity {
  id?: string;
  petId: string;
  panelId: string;
  paymentOrderId?: string;
  status: InternationStatusEnum;
  startDate: Date;
  endDate?: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<GroomingEntity>) {
    Object.assign(this, partial);
  }
}

