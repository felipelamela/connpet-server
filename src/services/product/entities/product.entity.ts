import { ProductType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface IProduct {
  id?: string;
  name: string;
  description?: string;
  type: ProductType;
  companyId: string;
  batchNumber?: string;
  manufacturer?: string;
  quantity: number;
  pricePay: string;
  priceSale: string;
  expirationDate: Date ;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductEntity {
  id?: string;
  name: string;
  description?: string;
  type: ProductType;
  companyId: string;
  batchNumber?: string;
  manufacturer?: string;
  quantity: number;
  pricePay: string;
  priceSale: string;
  expirationDate: Date;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(product: IProduct) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.type = product.type;
    this.companyId = product.companyId;
    this.batchNumber = product.batchNumber;
    this.manufacturer = product.manufacturer;
    this.quantity = product.quantity;
    this.pricePay = product.pricePay;
    this.priceSale = product.priceSale;
    this.expirationDate = product.expirationDate
    this.active = product.active ?? true;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }

}