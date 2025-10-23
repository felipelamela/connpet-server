import { Injectable } from '@nestjs/common';
import { PrismaService } from '../commom/prisma/prisma.service';
import { ExamEntity } from './entities/exam.entity';
import { ErrorResponse } from '../commom/response/errorResponse';

@Injectable()
export class ExamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createExam(data: ExamEntity) {
    try {
      return await this.prisma.exam.create({
        data: {
          petId: data.petId,
          requestedByVetId: data.requestedByVetId,
          name: data.name,
          examDate: data.examDate,
          clinicId: data.clinicId!,
          comments: data.comments,
        },
        include: {
          pet: true,
          clinic: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar exame',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findAllExams() {
    try {
      return await this.prisma.exam.findMany({
        include: {
          pet: true,
          clinic: true,
          resultExams: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar exames',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findExamById(id: string) {
    try {
      return await this.prisma.exam.findUnique({
        where: { id },
        include: {
          pet: true,
          clinic: true,
          resultExams: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar exame',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findExamsByPetId(petId: string) {
    try {
      return await this.prisma.exam.findMany({
        where: { petId },
        include: {
          pet: true,
          clinic: true,
          resultExams: true,
        },
        orderBy: {
          examDate: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar exames do pet',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findExamsByClinicId(clinicId: string) {
    try {
      return await this.prisma.exam.findMany({
        where: { clinicId },
        include: {
          pet: true,
          clinic: true,
          resultExams: true,
        },
        orderBy: {
          examDate: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar exames da clínica',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async updateExam(id: string, data: Partial<ExamEntity>) {
    try {
      return await this.prisma.exam.update({
        where: { id },
        data: {
          requestedByVetId: data.requestedByVetId,
          name: data.name,
          examDate: data.examDate,
          clinicId: data.clinicId,
          comments: data.comments,
        },
        include: {
          pet: true,
          clinic: true,
          resultExams: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao atualizar exame',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async deleteExam(id: string) {
    try {
      return await this.prisma.exam.delete({
        where: { id },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao deletar exame',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
}
