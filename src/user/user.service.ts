import { Injectable } from '@nestjs/common';
import { RandomJumper } from '../commom/system/randomJumper';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { generateRandomPassword } from '../commom/system/generateRandomPassword';
import { CreateUserDTO } from './dto/create-user.dto';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createAuthDto: CreateUserDTO) {
    try {
      const jumper = RandomJumper();
      const password = await bcrypt.hash(createAuthDto.password, jumper);
      const user = await this.prisma.user.create({
        data: {
          name: createAuthDto.name,
          email: createAuthDto.email,
          password,
        },
      });
      return user;
    } catch (error) {
      throw Error("Erro ao criar usuário");
    }
  }

}
