import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { InternationEntity } from './entities/internation.entity';
import { ErrorResponse } from '../common/response/errorResponse';

@Injectable()
export class InternationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createInternation(data: InternationEntity) {
    try {
      return await this.prisma.internation.create({
        data: {
          petId: data.petId,
          companyId: data.companyId,
          responsibleVetId: data.vetId,
          startDate: data.startDate,
          endDate: data.endDate,
        },
        include: {
          pet: true,
          company: true,
          responsibleVet: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar internação',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findAllInternations() {
    try {
      return await this.prisma.internation.findMany({
        include: {
          pet: true,
          company: true,
          responsibleVet: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar internações',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findInternationById(id: string) {
    try {
      return await this.prisma.internation.findUnique({
        where: { id },
        include: {
          pet: true,
          company: true,
          responsibleVet: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar internação',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findInternationsByPetId(petId: string) {
    try {
      return await this.prisma.internation.findMany({
        where: { petId },
        include: {
          pet: true,
          company: true,
          responsibleVet: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar internações do pet',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findInternationsByClinicId(clinicId: string) {
    try {
      return await this.prisma.internation.findMany({
        where: { companyId: clinicId },
        include: {
          pet: true,
          company: true,
          responsibleVet: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar internações da clínica',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findActiveInternations() {
    try {
      return await this.prisma.internation.findMany({
        where: {
          endDate: null,
        },
        include: {
          pet: true,
          company: true,
          responsibleVet: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar internações ativas',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async updateInternation(id: string, data: Partial<InternationEntity>) {
    try {
      return await this.prisma.internation.update({
        where: { id },
        data: {
          responsibleVetId: data.vetId,
          startDate: data.startDate,
          endDate: data.endDate,
        },
        include: {
          pet: true,
          company: true,
          responsibleVet: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao atualizar internação',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async deleteInternation(id: string) {
    try {
      return await this.prisma.internation.delete({
        where: { id },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao deletar internação',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
}
