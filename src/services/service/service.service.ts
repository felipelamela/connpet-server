import { Injectable } from '@nestjs/common';
import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto, ServiceFilterDto } from './dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ErrorResponse } from 'src/common/response/errorResponse';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    try {
      const service = await this.prisma.service.create({
        data: createServiceDto,
      });

      return service as ServiceResponseDto;
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar serviço.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findAll(filters?: ServiceFilterDto): Promise<{ services: ServiceResponseDto[]; total: number; page: number; limit: number }> {
    try {
      const {
        page = 1,
        limit = 100,
        orderBy = 'createdAt',
        orderDirection = 'desc',
        category,
        active,
        panelId,
        search,
        minPrice,
        maxPrice,
      } = filters || {};

      const skip = (page - 1) * limit;

      const where: Prisma.ServiceWhereInput = {
        ...(category && { category }),
        ...(active !== undefined && { active }),
        ...(panelId && { panelId }),
      };
      const [services, total] = await Promise.all([
        this.prisma.service.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { [orderBy]: orderDirection },
        }),
        this.prisma.service.count({ where }),
      ]);

      return {
        services: services as ServiceResponseDto[],
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar serviços.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findOne(id: string): Promise<ServiceResponseDto> {
    try {
      const service = await this.prisma.service.findFirst({
        where: {
          id,
          
        },
      });

      if (!service) {
        throw new ErrorResponse({
          message: 'Serviço não encontrado.',
          statusCode: 404,
        });
      }

      return service as ServiceResponseDto;
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        message: 'Erro ao buscar serviço.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<ServiceResponseDto> {
    try {
      // Verificar se o serviço existe
      const existingService = await this.prisma.service.findFirst({
        where: {
          id,
          
        },
      });

      if (!existingService) {
        throw new ErrorResponse({
          message: 'Serviço não encontrado.',
          statusCode: 404,
        });
      }

      const service = await this.prisma.service.update({
        where: { id },
        data: updateServiceDto,
      });

      return service as ServiceResponseDto;
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        message: 'Erro ao atualizar serviço.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const existingService = await this.prisma.service.findFirst({
        where: {
          id,
        },
      });

      if (!existingService) {
        throw new ErrorResponse({
          message: 'Serviço não encontrado.',
          statusCode: 404,
        });
      }

      await this.prisma.service.delete({
        where: { id },
      });

      return { message: 'Serviço removido com sucesso.' };
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        message: 'Erro ao remover serviço.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  // Método adicional para buscar serviços por painel
  async findByPanel(panelId: string, filters?: Omit<ServiceFilterDto, 'panelId'>): Promise<{ services: ServiceResponseDto[]; total: number; page: number; limit: number }> {
    return this.findAll({ ...filters, panelId });
  }

  // Método adicional para buscar serviços por categoria
  async findByCategory(category: string, filters?: Omit<ServiceFilterDto, 'category'>): Promise<ServiceResponseDto[]> {
    try {
      const services = await this.prisma.service.findMany({
        where: {
          category: category as any,
          
          active: true,
        },
        orderBy: { name: 'asc' },
      });

      return services as ServiceResponseDto[];
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar serviços por categoria.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  // Método adicional para buscar serviços por faixa de preço
  async findByPriceRange(minPrice: number, maxPrice: number, panelId?: string): Promise<ServiceResponseDto[]> {
    try {
      const where: Prisma.ServiceWhereInput = {
        
        active: true,
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        ...(panelId && { panelId }),
      };

      const services = await this.prisma.service.findMany({
        where,
        orderBy: { price: 'asc' },
      });

      return services as ServiceResponseDto[];
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar serviços por faixa de preço.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }
}
