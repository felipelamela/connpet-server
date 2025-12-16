import { Injectable } from '@nestjs/common';
import { CreateGroomingDto } from './dto/create-grooming.dto';
import { UpdateGroomingDto } from './dto/update-grooming.dto';
import { ErrorResponse } from '../common/response/errorResponse';
import { GroomingHandlers } from './grooming.handlers';
import { GroomingEntity } from './entities/grooming.entity';
import { InternationStatusEnum } from '@prisma/client';
import { GroomingRepository } from './grooming.repository';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';
import { CreateGroomingNoteDto } from './dto/create-grooming-note.dto';
import { AddGroomingItemDto } from './dto/add-grooming-item.dto';

@Injectable()
export class GroomingService {
  constructor(
    private readonly groomingHandlers: GroomingHandlers,
    private readonly groomingRepository: GroomingRepository
  ) {}

  async create(createGroomingDto: CreateGroomingDto, user: JwtPayload) {
    try {
      if (!user.panelId || !user.panelType) {
        throw new ErrorResponse({
          message: 'Painel não informado',
          statusCode: 400,
        });
      }

      const groomingEntity = new GroomingEntity({
        ...createGroomingDto,
        panelId: user.panelId,
        status: createGroomingDto.status || InternationStatusEnum.IN_PROGRESS,
        startDate: new Date(createGroomingDto.startDate),
        endDate: createGroomingDto.endDate ? new Date(createGroomingDto.endDate) : undefined,
      });


      return await this.groomingRepository.createGrooming(
        groomingEntity,
        createGroomingDto.serviceId,
      );
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
      return await this.groomingHandlers.findAllGroomingsHandler(filtersWithPanel);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.groomingHandlers.findGroomingByIdHandler(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async update(id: string, updateGroomingDto: UpdateGroomingDto) {
    try {
      const updateData: Partial<GroomingEntity> = {
        ...updateGroomingDto,
        startDate: updateGroomingDto.startDate
          ? new Date(updateGroomingDto.startDate)
          : undefined,
        endDate: updateGroomingDto.endDate
          ? new Date(updateGroomingDto.endDate)
          : undefined,
      };

      return await this.groomingHandlers.updateGroomingHandler(id, updateData);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.groomingHandlers.deleteGroomingHandler(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async addItem(groomingId: string, addGroomingItemDto: AddGroomingItemDto) {
    try {
      return await this.groomingHandlers.addPaymentItemHandler(
        groomingId,
        addGroomingItemDto.type,
        addGroomingItemDto.itemId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async removeItem(groomingId: string, paymentItemId: string) {
    try {
      return await this.groomingHandlers.removePaymentItemHandler(groomingId, paymentItemId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async addNote(groomingId: string, createNoteDto: CreateGroomingNoteDto, user?: JwtPayload) {
    try {
      const grooming = await this.groomingRepository.findGroomingById(groomingId);
      if (!grooming) {
        throw new ErrorResponse({
          message: 'Grooming não encontrado',
          statusCode: 404,
        });
      }

      return await this.groomingRepository.createGroomingNote(
        groomingId,
        createNoteDto.description,
        undefined,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}

