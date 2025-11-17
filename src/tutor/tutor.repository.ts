import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ErrorResponse } from '../common/response/errorResponse';
import { TutorEntity } from './entities/tutor.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export default class TutorRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: TutorEntity, tx?: Prisma.TransactionClient) {
    try {
      const client = tx || this.prisma;
      return await client.userProfileTutor.create({
        data: data,
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar Tutor',
        errorsCode: error.code,
        details: error.meta,
        statusCode: 400,
      });
    }
  }
  async findTutor(id: string) {
    try {
      return await this.prisma.userProfileTutor.findFirst({
        where: { id: id },
        include: {
          pets: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar tutor',
        errorsCode: error.code,
        details: error.meta,
        statusCode: 400,
      });
    }
  }
  async createTutorCompany(data: { tutorId: string; panelId: string }, tx?: Prisma.TransactionClient) {
    try {
      const client = tx || this.prisma;
      return await client.tutorCompany.create({
        data: data,
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar Tutor Company',
        errorsCode: error.code,
        details: error.meta,
        statusCode: 400,
      });
    }
  }
}
