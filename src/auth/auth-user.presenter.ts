import { PartialType } from "@nestjs/mapped-types";
import { User, VeterinaryClinic } from "@prisma/client";

export class AuthUserPresenter {
  id: string;
  name: string;
  email: string;
  role: number | null;
  veterinaryClinicId?: string | null
  petUsers: []
  userProfileEmployee: []
  userProfileTutor: []
  constructor(user: any) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.userProfileEmployee = user.UserProfileEmployee
    this.userProfileTutor = user.UserProfileTutor
  }
}