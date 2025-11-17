import { Injectable } from '@nestjs/common';
import { CreateInternationDto } from './dto/create-internation.dto';
import { UpdateInternationDto } from './dto/update-internation.dto';
import { InternationHandlers } from './internation.handlers';
import { InternationEntity } from './entities/internation.entity';
import { ErrorResponse } from '../common/response/errorResponse';

@Injectable()
export class InternationService {
  constructor(private readonly internationHandlers: InternationHandlers) {}

  async create(createInternationDto: CreateInternationDto) {
    try {
      const internationEntity = new InternationEntity({
        ...createInternationDto,
        startDate: new Date(createInternationDto.startDate),
        endDate: createInternationDto.endDate
          ? new Date(createInternationDto.endDate)
          : undefined,
      });

      this.internationHandlers.validateInternationData(internationEntity);
      return await this.internationHandlers.createInternationHandler(
        internationEntity,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAll() {
    try {
      return await this.internationHandlers.findAllInternationsHandler();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.internationHandlers.findInternationByIdHandler(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByPetId(petId: string) {
    try {
      return await this.internationHandlers.findInternationsByPetIdHandler(
        petId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByClinicId(clinicId: string) {
    try {
      return await this.internationHandlers.findInternationsByClinicIdHandler(
        clinicId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findActive() {
    try {
      return await this.internationHandlers.findActiveInternationsHandler();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async update(id: string, updateInternationDto: UpdateInternationDto) {
    try {
      return '';
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.internationHandlers.deleteInternationHandler(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
