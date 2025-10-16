import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../../commom/prisma/prisma.service';
import { ErrorResponse } from '../../../commom/response/errorResponse';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data: createProductDto })
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }

  async findAll() {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }

  async findOne(id: number) {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }

  async remove(id: number) {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }
}
