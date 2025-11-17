import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { SuccessResponse } from '../common/response/successResponse';
import { ErrorResponse } from '../common/response/errorResponse';

@ApiTags('exams')
@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @ApiOperation({ summary: 'Criar novo exame' })
  @ApiResponse({ status: 201, description: 'Exame criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post()
  async create(@Body() createExamDto: CreateExamDto) {
    try {
      const exam = await this.examService.create(createExamDto);
      return new SuccessResponse('Exame criado com sucesso', exam);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get()
  async findAll() {
    try {
      const exams = await this.examService.findAll();
      return new SuccessResponse('Exames encontrados', exams);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('pet/:petId')
  @ApiOperation({ summary: 'Listar recursos' })
  @ApiResponse({ status: 200, description: 'Lista de recursos' })
  async findByPetId(@Param('petId') petId: string) {
    try {
      const exams = await this.examService.findByPetId(petId);
      return new SuccessResponse('Exames do pet encontrados', exams);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('clinic/:clinicId')
  @ApiOperation({ summary: 'Listar recursos' })
  @ApiResponse({ status: 200, description: 'Lista de recursos' })
  async findByClinicId(@Param('clinicId') clinicId: string) {
    try {
      const exams = await this.examService.findByClinicId(clinicId);
      return new SuccessResponse('Exames da clínica encontrados', exams);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar recursos' })
  @ApiResponse({ status: 200, description: 'Lista de recursos' })
  async findOne(@Param('id') id: string) {
    try {
      const exam = await this.examService.findOne(id);
      return new SuccessResponse('Exame encontrado', exam);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar recurso' })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Recurso não encontrado' })
  async update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    try {
      const exam = await this.examService.update(id, updateExamDto);
      return new SuccessResponse('Exame atualizado com sucesso', exam);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir recurso' })
  @ApiResponse({ status: 200, description: 'Recurso excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Recurso não encontrado' })
  async remove(@Param('id') id: string) {
    try {
      const exam = await this.examService.remove(id);
      return new SuccessResponse('Exame deletado com sucesso', exam);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
