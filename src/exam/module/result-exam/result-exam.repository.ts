import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../commom/prisma/prisma.service';
import { ResultExamEntity } from './entities/result-exam.entity';
import { ErrorResponse } from '../../../commom/response/errorResponse';

@Injectable()
export class ResultExamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createResultExam(data: ResultExamEntity) {
    try {
      return await this.prisma.resultExam.create({
        data: {
          examId: data.examId,
          IssuedByVetId: data.IssuedByVetId,
          clinicId: data.clinicId,
          fileUrl: data.fileUrl,
          comments: data.comments,
        },
        include: {
          exam: true,
          IssuedBy: true,
          clinic: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar resultado do exame',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findAllResultExams() {
    try {
      return await this.prisma.resultExam.findMany({
        include: {
          exam: true,
          IssuedBy: true,
          clinic: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar resultados de exames',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findResultExamById(id: string) {
    try {
      return await this.prisma.resultExam.findUnique({
        where: { id },
        include: {
          exam: true,
          IssuedBy: true,
          clinic: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar resultado do exame',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findResultExamsByExamId(examId: string) {
    try {
      return await this.prisma.resultExam.findMany({
        where: { examId },
        include: {
          exam: true,
          IssuedBy: true,
          clinic: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar resultados do exame',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findResultExamsByClinicId(clinicId: string) {
    try {
      return await this.prisma.resultExam.findMany({
        where: { clinicId },
        include: {
          exam: true,
          IssuedBy: true,
          clinic: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar resultados da clínica',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async updateResultExam(id: string, data: Partial<ResultExamEntity>) {
    try {
      return await this.prisma.resultExam.update({
        where: { id },
        data: {
          IssuedByVetId: data.IssuedByVetId,
          clinicId: data.clinicId,
          fileUrl: data.fileUrl,
          comments: data.comments,
        },
        include: {
          exam: true,
          IssuedBy: true,
          clinic: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao atualizar resultado do exame',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async deleteResultExam(id: string) {
    try {
      return await this.prisma.resultExam.delete({
        where: { id },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao deletar resultado do exame',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
}

