export class InternationEntity {
  id?: string;
  petId: string;
  companyId: string;
  vetId: string;
  startDate: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<InternationEntity>) {
    Object.assign(this, partial);
  }
}
