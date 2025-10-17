import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ErrorResponse } from '../../../commom/response/errorResponse';

@Injectable()
export class ServiceService {
  async create(createServiceDto: CreateServiceDto) {
    try {
      return '';
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar plano.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findAll() {
    try {
      return '';
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar plano.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findOne(id: number) {
    try {
      return '';
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar plano.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      return '';
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar plano.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async remove(id: number) {
    try {
      return '';
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar plano.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }
}
