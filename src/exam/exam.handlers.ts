import { Injectable } from '@nestjs/common';
import { ExamRepository } from './exam.repository';
import { ExamEntity } from './entities/exam.entity';
import { ErrorResponse } from '../common/response/errorResponse';
import { ErrorEnum } from '../common/enum/error.enum';

@Injectable()
export class ExamHandlers {
  constructor(private readonly examRepository: ExamRepository) {}

  async createExamHandler(exam: ExamEntity) {
    try {
      return await this.examRepository.createExam(exam);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAllExamsHandler() {
    try {
      return await this.examRepository.findAllExams();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findExamByIdHandler(id: string) {
    try {
      const exam = await this.examRepository.findExamById(id);
      if (!exam) {
        throw new ErrorResponse({
          message: 'Exame não encontrado',
          statusCode: 404,
          errorsCode: ErrorEnum.NOT_FOUND,
          details: `ID: ${id}`,
        });
      }
      return exam;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findExamsByPetIdHandler(petId: string) {
    try {
      return await this.examRepository.findExamsByPetId(petId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findExamsByClinicIdHandler(clinicId: string) {
    try {
      return await this.examRepository.findExamsByClinicId(clinicId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async updateExamHandler(id: string, data: Partial<ExamEntity>) {
    try {
      // Verifica se o exame existe
      await this.findExamByIdHandler(id);
      return await this.examRepository.updateExam(id, data);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async deleteExamHandler(id: string) {
    try {
      // Verifica se o exame existe
      await this.findExamByIdHandler(id);
      return await this.examRepository.deleteExam(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  validateExamData(data: ExamEntity): void {
    try {
      // Aqui você pode adicionar validações customizadas
      // Por exemplo, verificar se o pet existe, se o veterinário existe, etc.
      if (!data.petId) {
        throw new ErrorResponse({
          message: 'ID do pet é obrigatório',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: 'petId não pode ser vazio',
        });
      }

      if (!data.name) {
        throw new ErrorResponse({
          message: 'Nome do exame é obrigatório',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: 'name não pode ser vazio',
        });
      }

      if (!data.examDate) {
        throw new ErrorResponse({
          message: 'Data do exame é obrigatória',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
          details: 'examDate não pode ser vazio',
        });
      }
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
