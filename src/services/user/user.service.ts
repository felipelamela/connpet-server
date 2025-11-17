import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RandomJumper } from 'src/common/system/randomJumper';
import { ErrorResponse } from 'src/common/response/errorResponse';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAuthDto: CreateUserDTO, tx?: Prisma.TransactionClient) {
    try {
      const jumper = RandomJumper();
      const password = await bcrypt.hash(createAuthDto.password, jumper);
      const client = tx || this.prisma;
      const user = await client.user.create({
        data: {
          name: createAuthDto.name,
          email: createAuthDto.email,
          password,
        },
      });
      return user;
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar usuário',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }
  async findUserByEmail(email: string) {
    try {
      return this.prisma.user.findFirst({
        where: { email: email },
        select: { id: true },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar clínica',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
  async findUserById(id: string) {
    try {
      return this.prisma.user.findUnique({
        where: { id, },
        select: { id: true, status: true },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar usuário',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updateData: any = {};
      
      if (updateUserDto.name) {
        updateData.name = updateUserDto.name;
      }
      
      if (updateUserDto.email) {
        updateData.email = updateUserDto.email;
      }
      
      if (updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(updateUserDto.password, salt);
      }

      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao atualizar usuário',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async updateUserStatus(id: string, status: boolean) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { status: status },
      }); 
      return user;
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao atualizar status do usuário',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
}
