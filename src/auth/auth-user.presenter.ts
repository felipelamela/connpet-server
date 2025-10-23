import { Pet, UserProfileEmployee, UserProfileTutor } from "@prisma/client";

export class AuthUserPresenter {
  expiresIn: number;
  id: string;
  name: string;
  email: string;
  access_token: string;
  petUsers: Pet[] | null;
  userProfileEmployee: UserProfileEmployee[] | null;
  userProfileTutor: UserProfileTutor | null;
  constructor(user: any) {
    this.expiresIn = user.expiresIn;
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.userProfileEmployee = user.userProfileEmployee;
    this.userProfileTutor = user.userProfileTutor;
    this.access_token = user.access_token;
    this.petUsers = user.petUsers;
  }
}
