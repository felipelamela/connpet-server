import { Injectable } from '@nestjs/common';
import { GroomingRepository } from './grooming.repository';
import { GroomingEntity } from './entities/grooming.entity';
import { ErrorResponse } from '../common/response/errorResponse';
import { ErrorEnum } from '../common/enum/error.enum';
import { InternationStatusEnum } from '@prisma/client';

@Injectable()
export class GroomingHandlers {
  constructor(private readonly groomingRepository: GroomingRepository) {}

  async findAllGroomingsHandler(filters?: any) {
    try {
      return await this.groomingRepository.findAllGroomings(filters);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findGroomingByIdHandler(id: string) {
    try {
      const grooming = await this.groomingRepository.findGroomingById(id);
      if (!grooming) {
        throw new ErrorResponse({
          message: 'Grooming não encontrado',
          statusCode: 404,
          errorsCode: ErrorEnum.NOT_FOUND,
          details: `ID: ${id}`,
        });
      }
      return grooming;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async updateGroomingHandler(id: string, data: Partial<GroomingEntity>) {
    try {
      await this.findGroomingByIdHandler(id);
      return await this.groomingRepository.updateGrooming(id, data);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async deleteGroomingHandler(id: string) {
    try {
      await this.findGroomingByIdHandler(id);
      return await this.groomingRepository.deleteGrooming(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  validateGroomingData(data: GroomingEntity, isUpdate = false): void {
    try {
      if (!isUpdate) {
        if (!data.petId) {
          throw new ErrorResponse({
            message: 'ID do pet é obrigatório',
            statusCode: 400,
            errorsCode: ErrorEnum.VALIDATION_ERROR,
            details: 'petId não pode ser vazio',
          });
        }

        if (!data.panelId) {
          throw new ErrorResponse({
            message: 'ID do painel é obrigatório',
            statusCode: 400,
            errorsCode: ErrorEnum.VALIDATION_ERROR,
            details: 'panelId não pode ser vazio',
          });
        }

        if (!data.startDate) {
          throw new ErrorResponse({
            message: 'Data de início é obrigatória',
            statusCode: 400,
            errorsCode: ErrorEnum.VALIDATION_ERROR,
            details: 'startDate não pode ser vazia',
          });
        }
      }

      if (data.status && !Object.values(InternationStatusEnum).includes(data.status)) {
        throw new ErrorResponse({
          message: 'Status do grooming inválido',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: `Status deve ser um dos valores: ${Object.values(InternationStatusEnum).join(', ')}`,
        });
      }
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async addPaymentItemHandler(
    groomingId: string,
    type: 'SERVICE' | 'PRODUCT',
    itemId: string,
  ) {
    try {
      await this.groomingRepository.addPaymentItemToGrooming(groomingId, type, itemId);
      return await this.groomingRepository.findGroomingById(groomingId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async removePaymentItemHandler(groomingId: string, paymentItemId: string) {
    try {
      await this.groomingRepository.removePaymentItemFromGrooming(groomingId, paymentItemId);
      return await this.groomingRepository.findGroomingById(groomingId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}

