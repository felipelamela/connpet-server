import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ErrorResponse } from 'src/common/response/errorResponse';
import { Prisma } from '@prisma/client';
import { IProduct } from './entities/product.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: IProduct): Promise<ProductResponseDto> {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          type: createProductDto.type,
          companyId: createProductDto.companyId,
          batchNumber: createProductDto.batchNumber,
          manufacturer: createProductDto.manufacturer,
          quantity: createProductDto.quantity,
          pricePay: createProductDto.pricePay,
          priceSale: createProductDto.priceSale,
          expirationDate: new Date(createProductDto.expirationDate),
          active: createProductDto.active ?? true,
        },
      });

      return product as ProductResponseDto;
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar produto.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findAll(filters?: ProductFilterDto): Promise<{ products: ProductResponseDto[]; total: number; page: number; limit: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        orderBy = 'createdAt',
        orderDirection = 'desc',
        type,
        active,
        companyId,
        search,
        expirationDays,
      } = filters || {};

      const skip = (page - 1) * limit;

      // Construir filtros dinâmicos
      const where: Prisma.ProductWhereInput = {
        ...(type && { type }),
        ...(active !== undefined && { active }),
        ...(companyId && { companyId }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { manufacturer: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(expirationDays && {
          expirationDate: {
            lte: new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000),
          },
        }),
      };

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [orderBy]: orderDirection },
        }),
        this.prisma.product.count({ where }),
      ]);

      return {
        products: products as ProductResponseDto[],
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar produtos.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    try {
      const product = await this.prisma.product.findFirst({
        where: {
          id,
        },
      });

      if (!product) {
        throw new ErrorResponse({
          message: 'Produto não encontrado.',
          statusCode: 404,
        });
      }

      return product as ProductResponseDto;
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        message: 'Erro ao buscar produto.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    try {
      // Verificar se o produto existe
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          id,
        },
      });

      if (!existingProduct) {
        throw new ErrorResponse({
          message: 'Produto não encontrado.',
          statusCode: 404,
        });
      }

      const updateData: Prisma.ProductUpdateInput = {
        ...updateProductDto,
        ...(updateProductDto.expirationDate && {
          expirationDate: new Date(updateProductDto.expirationDate),
        }),
      };

      const product = await this.prisma.product.update({
        where: { id },
        data: updateData,
      });

      return product as ProductResponseDto;
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        message: 'Erro ao atualizar produto.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      // Verificar se o produto existe
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          id,
        },
      });

      if (!existingProduct) {
        throw new ErrorResponse({
          message: 'Produto não encontrado.',
          statusCode: 404,
        });
      }

      // Soft delete - marcar como deletado
      await this.prisma.product.delete({
        where: { id },
      });

      return { message: 'Produto removido com sucesso.' };
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        message: 'Erro ao remover produto.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  // Método adicional para buscar produtos por empresa
  async findByCompany(companyId: string, filters?: Omit<ProductFilterDto, 'companyId'>): Promise<{ products: ProductResponseDto[]; total: number; page: number; limit: number }> {
    return this.findAll({ ...filters, companyId });
  }

  // Método adicional para buscar produtos próximos do vencimento
  async findExpiringProducts(companyId: string, days: number = 30): Promise<ProductResponseDto[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          companyId,
          active: true,
          expirationDate: {
            lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
            gte: new Date(), // Apenas produtos ainda válidos
          },
        },
        orderBy: { expirationDate: 'asc' },
      });

      return products as ProductResponseDto[];
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar produtos próximos do vencimento.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }
}
