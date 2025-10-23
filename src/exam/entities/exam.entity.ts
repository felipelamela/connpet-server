export class ExamEntity {
  id?: string;
  petId: string;
  requestedByVetId?: string;
  name: string;
  examDate: Date;
  clinicId?: string;
  comments?: string;
  createdAt?: Date;

  constructor(partial: Partial<ExamEntity>) {
    Object.assign(this, partial);
  }
}
