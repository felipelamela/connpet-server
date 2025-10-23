import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamHandlers } from './exam.handlers';
import { ExamEntity } from './entities/exam.entity';
import { ErrorResponse } from '../commom/response/errorResponse';

@Injectable()
export class ExamService {
  constructor(private readonly examHandlers: ExamHandlers) {}

  async create(createExamDto: CreateExamDto) {
    try {
      const examEntity = new ExamEntity({
        ...createExamDto,
        examDate: new Date(createExamDto.examDate),
      });

      this.examHandlers.validateExamData(examEntity);
      return await this.examHandlers.createExamHandler(examEntity);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAll() {
    try {
      return await this.examHandlers.findAllExamsHandler();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.examHandlers.findExamByIdHandler(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByPetId(petId: string) {
    try {
      return await this.examHandlers.findExamsByPetIdHandler(petId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByClinicId(clinicId: string) {
    try {
      return await this.examHandlers.findExamsByClinicIdHandler(clinicId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async update(id: string, updateExamDto: UpdateExamDto) {
    try {
      const updateData: Partial<ExamEntity> = {
        ...updateExamDto,
      };

      if (updateExamDto.examDate) {
        updateData.examDate = new Date(updateExamDto.examDate);
      }

      return await this.examHandlers.updateExamHandler(id, updateData);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.examHandlers.deleteExamHandler(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
