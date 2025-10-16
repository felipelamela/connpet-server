import { ProductType } from "@prisma/client";

export interface IProduct {
  id?: string;
  name: string;
  quantity: number;
  validatedAt?: Date | null;
  price: number;
  type: ProductType;
  clinicId: string;
}

export class ProductEntity {
  id?: string;
  name: string;
  quantity: number;
  validatedAt: Date | null;
  price: number;
  type: ProductType;
  clinicId: string;
  createdAt?: Date;

  constructor(product: IProduct) {
    this.id = product.id;
    this.name = product.name;
    this.quantity = product.quantity;
    this.validatedAt = product.validatedAt ?? null;
    this.price = product.price;
    this.type = product.type;
    this.clinicId = product.clinicId;
  }
}
