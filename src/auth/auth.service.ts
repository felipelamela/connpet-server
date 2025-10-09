import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.auth.dto';
import { RandomJumper } from 'src/system/randomJumper';
import * as bcrypt from 'bcrypt';
import { CreateNewUserDTO } from './dto/create-new-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAuthDto: CreateNewUserDTO) {
    try{
      const jumper = RandomJumper();
      const password = await bcrypt.hash(createAuthDto.password, jumper);
      const user = await this.prisma.user.create({
        data: {
          name: createAuthDto.name,
          email: createAuthDto.email,
          password,
          document: createAuthDto.document ?? null,
          role: createAuthDto.role,
          jumper,
        },
      });
      return user;
    } catch (error) {
      throw Error("Erro ao criar usuário");
    }
  }
  async login(loginDto: LoginAuthDto) {

  }

}
