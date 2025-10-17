interface IUser {
  name: string;
  email: string;
  password: string;
  status: boolean;
}

export class UserEntity {
  name: string;
  email: string;
  password: string;
  status: boolean;
  constructor(user: IUser) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.status = user.status;
  }
}
