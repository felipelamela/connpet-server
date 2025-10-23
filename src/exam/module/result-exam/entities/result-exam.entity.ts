export class ResultExamEntity {
  id?: string;
  examId: string;
  IssuedByVetId?: string;
  clinicId?: string;
  fileUrl: string;
  comments?: string;
  createdAt?: Date;

  constructor(partial: Partial<ResultExamEntity>) {
    Object.assign(this, partial);
  }
}
