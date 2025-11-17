export interface ITutor {
  userId: string;
  document?: string | null;
  phone?: string | null;
  addressId?: string | null;
}

export class TutorEntity {
  userId: string;
  document: string | null;
  phone: string | null;
  addressId: string | null;

  constructor(tutor: ITutor) {
    this.userId = tutor.userId;
    this.document = tutor.document ?? null;
    this.phone = tutor.phone ?? null;
    this.addressId = tutor.addressId ?? null;
  }
}
