import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ClinicVetEntity } from './entities/clinic-vet.entity';
import { RoleEnum } from '@prisma/client';
import { ErrorResponse } from '../common/response/errorResponse';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClinic(create: ClinicVetEntity) {
    try {
      return await this.prisma.company.create({
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
      return await this.prisma.company.findFirst({
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
  async findAllTutors(filters?: { page?: number; limit?: number; search?: string; orderBy?: string; orderDirection?: 'asc' | 'desc' }) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        orderBy = 'createdAt',
        orderDirection = 'desc',
      } = filters || {};

      const skip = (page - 1) * limit;

      const where: any = {};
      
      if (search) {
        where.tutor = {
          OR: [
            { user: { name: { contains: search, mode: 'insensitive' } } },
            { user: { email: { contains: search, mode: 'insensitive' } } },
            { document: { contains: search, mode: 'insensitive' } },
          ],
        };
      }

      const [tutors, total] = await Promise.all([
        this.prisma.tutorCompany.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { [orderBy]: orderDirection },
          select: {
            id: true,
            tutor: {
              select: {
                id: true,
                userId: true,
                document: true,
                phone: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                  },
                },
                _count: {
                  select: {
                    pets: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.tutorCompany.count({ where }),
      ]);

      return {
        tutors,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar tutores',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findTutorById(tutorId: string) {
    try {
      return await this.prisma.userProfileTutor.findFirst({
        where: { id: tutorId },
        select: {
          id: true,
          userId: true,
          document: true,
          phone: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
            },
          },
          address: {
            select: {
              id: true,
              cep: true,
              street: true,
              number: true,
              complement: true,
              neighborhood: true,
              city: true,
              state: true,
              country: true,
            },
          },
          pets: {
            where: {
              active: true,
            },
            select: {
              id: true,
              name: true,
              species: true,
              breed: true,
              birthDate: true,
              color: true,
              weight: true,
              microchipNumber: true,
              gender: true,
              active: true,
              observations: true,
            },
            orderBy: {
              name: 'asc',
            },
          },
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar tutor',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async createTutorCompany(data: { tutorId: string; panelId: string }) {
    try {
      return await this.prisma.tutorCompany.create({
        data: data,
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar tutor company',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
  async createPetsCompany(data: { petId: string; panelId: string }[]) {
    try {
      return await this.prisma.petCompany.createMany({
        data: data,
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar pets company',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
}
