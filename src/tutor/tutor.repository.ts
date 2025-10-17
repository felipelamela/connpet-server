import { Injectable } from '@nestjs/common';
import { PrismaService } from '../commom/prisma/prisma.service';
import { ErrorResponse } from '../commom/response/errorResponse';

interface ITutor {
  userId: string;
  addressId: string | null;
  document: string | null;
  phone: string | null;
}

@Injectable()
export default class TutorRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: ITutor) {
    try {
      return await this.prisma.userProfileTutor.create({
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
}
