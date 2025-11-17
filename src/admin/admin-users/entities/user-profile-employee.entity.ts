import { RoleEnum } from '@prisma/client';

export interface IUserProfileEmployee {
  userId: string;
  companyId: string;
  phone: string;
  document: string;
  roles: RoleEnum;
}

export class UserProfileEmployeeEntity {
  userId: string;
  companyId: string;
  phone: string;
  document: string;
  roles: RoleEnum;
  constructor(user: IUserProfileEmployee) {
    this.phone = user.phone;
    this.document = user.document;
    this.roles = user.roles;
    this.userId = user.userId;
    this.companyId = user.companyId;
  }
}
