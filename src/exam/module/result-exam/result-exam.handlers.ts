import { Injectable } from '@nestjs/common';
import { ResultExamRepository } from './result-exam.repository';
import { ResultExamEntity } from './entities/result-exam.entity';
import { ErrorResponse } from '../../../commom/response/errorResponse';
import { ErrorEnum } from '../../../commom/enum/error.enum';

@Injectable()
export class ResultExamHandlers {
  constructor(private readonly resultExamRepository: ResultExamRepository) {}

  async createResultExamHandler(resultExam: ResultExamEntity) {
    try {
      return await this.resultExamRepository.createResultExam(resultExam);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAllResultExamsHandler() {
    try {
      return await this.resultExamRepository.findAllResultExams();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findResultExamByIdHandler(id: string) {
    try {
      const resultExam = await this.resultExamRepository.findResultExamById(id);
      if (!resultExam) {
        throw new ErrorResponse({
          message: 'Resultado do exame não encontrado',
          statusCode: 404,
          errorsCode: ErrorEnum.NOT_FOUND,
          details: `ID: ${id}`,
        });
      }
      return resultExam;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findResultExamsByExamIdHandler(examId: string) {
    try {
      return await this.resultExamRepository.findResultExamsByExamId(examId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findResultExamsByClinicIdHandler(clinicId: string) {
    try {
      return await this.resultExamRepository.findResultExamsByClinicId(clinicId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async updateResultExamHandler(id: string, data: Partial<ResultExamEntity>) {
    try {
      // Verifica se o resultado do exame existe
      await this.findResultExamByIdHandler(id);
      return await this.resultExamRepository.updateResultExam(id, data);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async deleteResultExamHandler(id: string) {
    try {
      // Verifica se o resultado do exame existe
      await this.findResultExamByIdHandler(id);
      return await this.resultExamRepository.deleteResultExam(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  validateResultExamData(data: ResultExamEntity): void {
    try {
      if (!data.examId) {
        throw new ErrorResponse({
          message: 'ID do exame é obrigatório',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: 'examId não pode ser vazio',
        });
      }

      if (!data.fileUrl) {
        throw new ErrorResponse({
          message: 'URL do arquivo é obrigatória',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: 'fileUrl não pode ser vazio',
        });
      }
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}

