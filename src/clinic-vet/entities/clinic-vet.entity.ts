
interface IClinicVet {
  cnpj: string;
  socialName: string;
  tradeName?: string | null;
  email: string;
  phone?: string | null;
  cellphone?: string | null;
  technicalManager?: string | null;
  managerCrmv?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  emergencyService?: boolean;
  observations?: string | null;
  active?: boolean;
}

export class ClinicVetEntity {
  cnpj: string;
  socialName: string;
  tradeName: string | null;
  email: string;
  phone: string | null;
  cellphone: string | null;
  technicalManager: string | null;
  managerCrmv: string | null;
  openingTime: string | null;
  closingTime: string | null;
  emergencyService: boolean;
  observations: string | null;
  active: boolean;

  constructor(clinic: IClinicVet) {
    this.cnpj = clinic.cnpj
    this.socialName = clinic.socialName;
    this.tradeName = clinic.tradeName ?? null;
    this.email = clinic.email;
    this.phone = clinic.phone ?? null;
    this.cellphone = clinic.cellphone ?? null;
    this.technicalManager = clinic.technicalManager ?? null;
    this.managerCrmv = clinic.managerCrmv ?? null;
    this.openingTime = clinic.openingTime ?? null;
    this.closingTime = clinic.closingTime ?? null;
    this.emergencyService = clinic.emergencyService ?? false;
    this.observations = clinic.observations ?? null;
    this.active = clinic.active ?? true;
  }
}
