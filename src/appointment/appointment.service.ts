import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ErrorResponse } from '../common/response/errorResponse';
import { AppointmentHandlers } from './appointment.handlers';
import { AppointmentEntity } from './entities/appointment.entity';
import { AppointmentStatusEnum } from '@prisma/client';
import type { AddAppointmentItemDto } from './dto/add-appointment-item.dto';
import { AppointmentRepository } from './appointment.repository';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';
import { CreateAppointmentNoteDto } from './dto/create-appointment-note.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentHandlers: AppointmentHandlers,
    private readonly appointmentRepository: AppointmentRepository
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, user: JwtPayload) {
    try {
      if (!user.panelId || !user.panelType) {
        throw new ErrorResponse({
          message: 'Painel não informado',
          statusCode: 400,
        });
      }

      const appointmentEntity = new AppointmentEntity({
        ...createAppointmentDto,
        panelId: user.panelId,
        status: createAppointmentDto.status || AppointmentStatusEnum.PENDING,
        scheduledAt: new Date(createAppointmentDto.scheduledAt),
      });


      return await this.appointmentRepository.createAppointment(appointmentEntity, createAppointmentDto.serviceId);

    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAll(panelId: string | null, filters?: any) {
    try {
      if (!panelId) {
        throw new ErrorResponse({
          message: 'Painel não informado',
          statusCode: 400,
        });
      }

      const filtersWithPanel = { ...(filters || {}), panelId };
      return await this.appointmentHandlers.findAllAppointmentsHandler(filtersWithPanel);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.appointmentHandlers.findAppointmentByIdHandler(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByPetId(petId: string) {
    try {
      return await this.appointmentHandlers.findAppointmentsByPetIdHandler(
        petId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByPanelId(panelId: string) {
    try {
      return await this.appointmentHandlers.findAppointmentsByPanelIdHandler(
        panelId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByVetId(vetId: string) {
    try {
      return await this.appointmentHandlers.findAppointmentsByVetIdHandler(
        vetId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      const updateData: Partial<AppointmentEntity> = {
        ...updateAppointmentDto,
        scheduledAt: updateAppointmentDto.scheduledAt
          ? new Date(updateAppointmentDto.scheduledAt)
          : undefined,
      };

      if (updateAppointmentDto.scheduledAt) {
        updateData.scheduledAt = new Date(updateAppointmentDto.scheduledAt);
      }

      return await this.appointmentHandlers.updateAppointmentHandler(
        id,
        updateData,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.appointmentHandlers.deleteAppointmentHandler(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

    async addItem(appointmentId: string, addAppointmentItemDto: AddAppointmentItemDto) {
    try {
      return await this.appointmentHandlers.addPaymentItemHandler(
        appointmentId,
        addAppointmentItemDto.type,
        addAppointmentItemDto.itemId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async removeItem(appointmentId: string, paymentItemId: string) {
    try {
      return await this.appointmentHandlers.removePaymentItemHandler(
        appointmentId,
        paymentItemId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async addNote(appointmentId: string, createNoteDto: CreateAppointmentNoteDto, user?: JwtPayload) {
    try {
      // Verificar se a consulta existe
      const appointment = await this.appointmentRepository.findAppointmentById(appointmentId);
      if (!appointment) {
        throw new ErrorResponse({
          message: 'Consulta não encontrada',
          statusCode: 404,
        });
      }

      // Por enquanto, vetId será null, pois precisaríamos buscar o userProfileEmployee do usuário
      // Isso pode ser implementado posteriormente se necessário
      return await this.appointmentRepository.createAppointmentNote(
        appointmentId,
        createNoteDto.description,
        undefined, // vetId será null por enquanto
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
