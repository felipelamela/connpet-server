import { Injectable } from '@nestjs/common';
import { IUserProfileEmployee } from './entities/user-profile-employee.entity';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ErrorResponse } from 'src/common/response/errorResponse';
import { UpdateClinicVetUserDto } from './dto/update-clinic-vet-user.dto';

@Injectable()
export default class ClinicVetUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: IUserProfileEmployee) {
    try {
      return await this.prisma.userProfileEmployee.create({
        data: user,
        include: {
          user: true,
          company: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar perfil do usuário',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findAll(filters?: any) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
      } = filters || {};

      const skip = (page - 1) * limit;

      const where: any = {};
      
      if (search) {
        where.OR = [
          {
            user: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            phone: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      const [users, total] = await Promise.all([
        this.prisma.userProfileEmployee.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                status: true,
              },
            },
            company: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.userProfileEmployee.count({ where }),
      ]);

      return {
        users,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar perfis de usuários',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findByCompanyId(companyId: string) {
    try {
      return await this.prisma.userProfileEmployee.findMany({
        where: { companyId },
        include: {
          user: true,
          company: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar perfis da empresa',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.userProfileEmployee.findUnique({
        where: { id },
        include: {
          user: true,
          company: true,
          address: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar perfil do usuário',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async update(id: string, updateData: UpdateClinicVetUserDto) {
    try {
      return await this.prisma.userProfileEmployee.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
          company: true,
          address: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao atualizar perfil do usuário',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.userProfileEmployee.delete({
        where: { id },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao remover perfil do usuário',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }
}
