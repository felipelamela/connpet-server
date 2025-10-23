import { ProductType } from '@prisma/client';

export interface IProduct {
  id?: string;
  name: string;
  description?: string;
  type: ProductType;
  companyId: string;
  active?: boolean;
}

export class ProductEntity {
  id?: string;
  name: string;
  description?: string;
  type: ProductType;
  companyId: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(product: IProduct) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.type = product.type;
    this.companyId = product.companyId;
    this.active = product.active ?? true;
  }
}
