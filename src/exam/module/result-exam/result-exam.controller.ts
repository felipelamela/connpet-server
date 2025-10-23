import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResultExamService } from './result-exam.service';
import { CreateResultExamDto } from './dto/create-result-exam.dto';
import { UpdateResultExamDto } from './dto/update-result-exam.dto';
import { SuccessResponse } from '../../../commom/response/successResponse';
import { ErrorResponse } from '../../../commom/response/errorResponse';

@Controller('result-exam')
export class ResultExamController {
  constructor(private readonly resultExamService: ResultExamService) {}

  @Post()
  async create(@Body() createResultExamDto: CreateResultExamDto) {
    try {
      const resultExam = await this.resultExamService.create(createResultExamDto);
      return new SuccessResponse('Resultado do exame criado com sucesso', resultExam);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get()
  async findAll() {
    try {
      const resultExams = await this.resultExamService.findAll();
      return new SuccessResponse('Resultados de exames encontrados', resultExams);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('exam/:examId')
  async findByExamId(@Param('examId') examId: string) {
    try {
      const resultExams = await this.resultExamService.findByExamId(examId);
      return new SuccessResponse('Resultados do exame encontrados', resultExams);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('clinic/:clinicId')
  async findByClinicId(@Param('clinicId') clinicId: string) {
    try {
      const resultExams = await this.resultExamService.findByClinicId(clinicId);
      return new SuccessResponse('Resultados da clínica encontrados', resultExams);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const resultExam = await this.resultExamService.findOne(id);
      return new SuccessResponse('Resultado do exame encontrado', resultExam);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResultExamDto: UpdateResultExamDto,
  ) {
    try {
      const resultExam = await this.resultExamService.update(id, updateResultExamDto);
      return new SuccessResponse('Resultado do exame atualizado com sucesso', resultExam);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const resultExam = await this.resultExamService.remove(id);
      return new SuccessResponse('Resultado do exame deletado com sucesso', resultExam);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
