export interface IAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: number;
  country?: string;
}

export default class AddressEntity {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: number;
  country: string;
  constructor(address: IAddress) {
    this.cep = address.cep;
    this.street = address.street;
    this.number = address.number;
    this.complement = address.complement ? address.complement : "";
    this.neighborhood = address.neighborhood;
    this.city = address.city;
    this.state = address.state;
    this.country = address.country ?? 'Brasil';
  }
}