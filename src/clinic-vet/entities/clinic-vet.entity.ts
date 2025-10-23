interface IClinicVet {
  cnpj: string;
  socialName: string;
  tradeName: string;
  email: string;
  phone?: string | null;
  addressId?: string | null;
}

export class ClinicVetEntity {
  cnpj: string;
  socialName: string;
  tradeName: string;
  email: string;
  phone: string | null;
  addressId: string | null;

  constructor(clinic: IClinicVet) {
    this.cnpj = clinic.cnpj;
    this.socialName = clinic.socialName;
    this.tradeName = clinic.tradeName;
    this.email = clinic.email;
    this.phone = clinic.phone ?? null;
    this.addressId = clinic.addressId ?? null;
  }
}
