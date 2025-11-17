import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { AppointmentEntity } from './entities/appointment.entity';
import { ErrorResponse } from '../common/response/errorResponse';
import { ErrorEnum } from '../common/enum/error.enum';
import { AppointmentStatusEnum } from '@prisma/client';

@Injectable()
export class AppointmentHandlers {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async findAllAppointmentsHandler(filters?: any) {
    try {
      return await this.appointmentRepository.findAllAppointments(filters);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAppointmentByIdHandler(id: string) {
    try {
      const appointment = await this.appointmentRepository.findAppointmentById(id);
      if (!appointment) {
        throw new ErrorResponse({
          message: 'Consulta não encontrada',
          statusCode: 404,
          errorsCode: ErrorEnum.NOT_FOUND,
          details: `ID: ${id}`,
        });
      }
      return appointment;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAppointmentsByPetIdHandler(petId: string) {
    try {
      return await this.appointmentRepository.findAppointmentsByPetId(petId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAppointmentsByPanelIdHandler(panelId: string) {
    try {
      return await this.appointmentRepository.findAppointmentsByPanelId(panelId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAppointmentsByVetIdHandler(vetId: string) {
    try {
      return await this.appointmentRepository.findAppointmentsByVetId(vetId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async updateAppointmentHandler(id: string, data: Partial<AppointmentEntity>) {
    try {
      // Verifica se a consulta existe
      await this.findAppointmentByIdHandler(id);
      
      // Validar dados de atualização
      if (Object.keys(data).length > 0) {
        this.validateAppointmentData(data as AppointmentEntity, true);
      }
      
      return await this.appointmentRepository.updateAppointment(id, data);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async deleteAppointmentHandler(id: string) {
    try {
      // Verifica se a consulta existe
      await this.findAppointmentByIdHandler(id);
      return await this.appointmentRepository.deleteAppointment(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async addPaymentItemHandler(
    appointmentId: string,
    type: 'SERVICE' | 'PRODUCT',
    itemId: string,
  ) {
    try {
      await this.appointmentRepository.addPaymentItemToAppointment(appointmentId, type, itemId);
      return await this.appointmentRepository.findAppointmentById(appointmentId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async removePaymentItemHandler(appointmentId: string, paymentItemId: string) {
    try {
      await this.appointmentRepository.removePaymentItemFromAppointment(
        appointmentId,
        paymentItemId,
      );
      return await this.appointmentRepository.findAppointmentById(appointmentId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  validateAppointmentData(data: AppointmentEntity, isUpdate = false): void {
    try {
      // Validações obrigatórias apenas para criação
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

        if (data.type === undefined || data.type === null) {
          throw new ErrorResponse({
            message: 'Tipo da consulta é obrigatório',
            statusCode: 400,
            errorsCode: ErrorEnum.VALIDATION_ERROR,
            details: 'type não pode ser vazio',
          });
        }

        if (data.typeSpecialty === undefined || data.typeSpecialty === null) {
          throw new ErrorResponse({
            message: 'Especialidade da consulta é obrigatória',
            statusCode: 400,
            errorsCode: ErrorEnum.VALIDATION_ERROR,
            details: 'typeSpecialty não pode ser vazio',
          });
        }
      }

      // Validar status se fornecido
      if (data.status && !Object.values(AppointmentStatusEnum).includes(data.status)) {
        throw new ErrorResponse({
          message: 'Status da consulta inválido',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: `Status deve ser um dos valores: ${Object.values(AppointmentStatusEnum).join(', ')}`,
        });
      }

      // Validar data agendada apenas para criação e se fornecida
      if (!isUpdate && data.scheduledAt) {
        const scheduledDate = new Date(data.scheduledAt);
        const now = new Date();
        
        if (scheduledDate < now) {
          throw new ErrorResponse({
            message: 'Data agendada não pode ser no passado',
            statusCode: 400,
            errorsCode: ErrorEnum.VALIDATION_ERROR,
            details: 'scheduledAt deve ser uma data futura',
          });
        }
      }
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}

