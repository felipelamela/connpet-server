import { Injectable } from '@nestjs/common';
import { CreateResultExamDto } from './dto/create-result-exam.dto';
import { UpdateResultExamDto } from './dto/update-result-exam.dto';
import { ResultExamHandlers } from './result-exam.handlers';
import { ResultExamEntity } from './entities/result-exam.entity';
import { ErrorResponse } from '../../../common/response/errorResponse';

@Injectable()
export class ResultExamService {
  constructor(private readonly resultExamHandlers: ResultExamHandlers) {}

  async create(createResultExamDto: CreateResultExamDto) {
    try {
      const resultExamEntity = new ResultExamEntity({
        ...createResultExamDto,
      });

      this.resultExamHandlers.validateResultExamData(resultExamEntity);
      return await this.resultExamHandlers.createResultExamHandler(
        resultExamEntity,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAll() {
    try {
      return await this.resultExamHandlers.findAllResultExamsHandler();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.resultExamHandlers.findResultExamByIdHandler(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByExamId(examId: string) {
    try {
      return await this.resultExamHandlers.findResultExamsByExamIdHandler(
        examId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByClinicId(clinicId: string) {
    try {
      return await this.resultExamHandlers.findResultExamsByClinicIdHandler(
        clinicId,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async update(id: string, updateResultExamDto: UpdateResultExamDto) {
    try {
      const updateData: Partial<ResultExamEntity> = {
        ...updateResultExamDto,
      };

      return await this.resultExamHandlers.updateResultExamHandler(
        id,
        updateData,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.resultExamHandlers.deleteResultExamHandler(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
