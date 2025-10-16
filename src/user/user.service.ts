import { Injectable } from '@nestjs/common';
import { RandomJumper } from '../commom/system/randomJumper';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../commom/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ErrorResponse } from '../commom/response/errorResponse';


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
      throw new ErrorResponse({
        message: "Erro ao criar usuário",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      });
    }
  }
  async findUserByEmail(email: string) {
    try {
      return this.prisma.user.findFirst({
        where: { email: email },
        select: { id: true }
      })
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao buscar clínica",
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta
      })
    }
  }
}
