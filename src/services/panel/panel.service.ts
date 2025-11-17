import { Injectable } from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ErrorResponse } from '../../common/response/errorResponse';

@Injectable()
export class PanelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPanelDto: CreatePanelDto) {
    try {
      return await this.prisma.panel.create({ data: createPanelDto });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar painel.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findAll() {
    try {
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar painéis.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findByCompanyId(companyId: string) {
    try {
      return await this.prisma.panel.findMany({
        where: { companyId },
        include: {
          company: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar painéis da empresa.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.panel.findUnique({
        where: { id },
        include: {
          company: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar painel.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async update(id: string, updatePanelDto: UpdatePanelDto) {
    try {
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao atualizar painel.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async remove(id: string) {
    try {
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao remover painel.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }
}
