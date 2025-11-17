import { Injectable } from '@nestjs/common';
import { InternationRepository } from './internation.repository';
import { InternationEntity } from './entities/internation.entity';
import { ErrorResponse } from '../common/response/errorResponse';
import { ErrorEnum } from '../common/enum/error.enum';

@Injectable()
export class InternationHandlers {
  constructor(private readonly internationRepository: InternationRepository) {}

  async createInternationHandler(internation: InternationEntity) {
    try {
      return await this.internationRepository.createInternation(internation);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAllInternationsHandler() {
    try {
      return await this.internationRepository.findAllInternations();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findInternationByIdHandler(id: string) {
    try {
      const internation =
        await this.internationRepository.findInternationById(id);
      if (!internation) {
        throw new ErrorResponse({
          message: 'Internação não encontrada',
          statusCode: 404,
          errorsCode: ErrorEnum.NOT_FOUND,
          details: `ID: ${id}`,
        });
      }
      return internation;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findInternationsByPetIdHandler(petId: string) {
    try {
      return await this.internationRepository.findInternationsByPetId(petId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findInternationsByClinicIdHandler(clinicId: string) {
    try {
      return await this.internationRepository.findInternationsByClinicId(
        clinicId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findActiveInternationsHandler() {
    try {
      return await this.internationRepository.findActiveInternations();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async updateInternationHandler(id: string, data: Partial<InternationEntity>) {
    try {
      // Verifica se a internação existe
      await this.findInternationByIdHandler(id);
      return await this.internationRepository.updateInternation(id, data);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async deleteInternationHandler(id: string) {
    try {
      // Verifica se a internação existe
      await this.findInternationByIdHandler(id);
      return await this.internationRepository.deleteInternation(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  validateInternationData(data: InternationEntity): void {
    try {
      if (!data.petId) {
        throw new ErrorResponse({
          message: 'ID do pet é obrigatório',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: 'petId não pode ser vazio',
        });
      }

      if (!data.companyId) {
        throw new ErrorResponse({
          message: 'ID da clínica é obrigatório',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: 'companyId não pode ser vazio',
        });
      }

      if (!data.vetId) {
        throw new ErrorResponse({
          message: 'ID do veterinário é obrigatório',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: 'vetId não pode ser vazio',
        });
      }

      if (!data.startDate) {
        throw new ErrorResponse({
          message: 'Data de início é obrigatória',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: 'startDate não pode ser vazio',
        });
      }

      // Valida se a data de início não é futura demais
      const now = new Date();
      const startDate = new Date(data.startDate);

      if (startDate > now) {
        // Permite até 24 horas no futuro para agendamentos
        const diffInHours =
          (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (diffInHours > 24) {
          throw new ErrorResponse({
            message: 'Data de início não pode ser mais de 24 horas no futuro',
            statusCode: 400,
            errorsCode: ErrorEnum.VALIDATION_ERROR,
            details: 'startDate inválida',
          });
        }
      }

      // Valida se a data de fim é posterior à data de início
      if (data.endDate) {
        const endDate = new Date(data.endDate);
        if (endDate < startDate) {
          throw new ErrorResponse({
            message: 'Data de fim deve ser posterior à data de início',
            statusCode: 400,
            errorsCode: ErrorEnum.VALIDATION_ERROR,
            details: 'endDate deve ser maior que startDate',
          });
        }
      }
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
