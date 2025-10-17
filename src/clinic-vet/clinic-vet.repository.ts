import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commom/prisma/prisma.service';
import { ClinicVetEntity } from './entities/clinic-vet.entity';
import { RoleEnum } from '@prisma/client';
import { ErrorResponse } from '../commom/response/errorResponse';

@Injectable()
export class clinicVetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClinic(create: ClinicVetEntity) {
    try {
      return await this.prisma.veterinaryClinic.create({
        data: create,
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar clínica',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
  async createProfile(data: {
    userId: string;
    companyId: string;
    document: string;
    phone: string;
    roles: RoleEnum;
  }) {
    try {
      return this.prisma.userProfileEmployee.create({
        data: {
          ...data,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar usuário',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
  async findClinicByCNPJ(cnpj: string) {
    try {
      return await this.prisma.veterinaryClinic.findFirst({
        where: {
          cnpj: cnpj,
        },
        select: {
          id: true,
        },
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

  async findUserProfile(data: { userId: string; clinicId: string }) {
    try {
      return await this.prisma.userProfileEmployee.findFirst({
        where: {
          userId: data.userId,
          companyId: data.clinicId,
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar perfil',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
}
