import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { TutorService } from './tutor.service';
import { CreateTutorDTO } from './dto/create-tutor.dto';
import { SuccessResponse } from '../common/response/successResponse';
import { ErrorResponse } from '../common/response/errorResponse';
import { CreateTutorWithPetDto } from './dto/create-tutor-with-pet.dto';

@ApiTags('tutors')
@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @ApiOperation({ summary: 'Criar novo tutor' })
  @ApiResponse({ status: 201, description: 'Tutor criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post()
  async create(@Body() createTutorDto: CreateTutorDTO) {
    try {
      const tutor = await this.tutorService.create(createTutorDto);
      return new SuccessResponse('Tutor criado com sucesso', tutor);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Post('with-pet')
  @ApiOperation({ summary: 'Criar recurso' })
  @ApiResponse({ status: 201, description: 'Recurso criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createTutorWithPet(@Body() createTutorWithPet: CreateTutorWithPetDto) {
    try {
      const tutor =
        await this.tutorService.createTutorWithPet(createTutorWithPet);
      return new SuccessResponse('Tutor criado com sucesso', tutor);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Listar todos os tutores' })
  @ApiResponse({ status: 200, description: 'Lista de tutores' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get()
  async findAll() {
    try {
      return new SuccessResponse('Tutores listados com sucesso', 'tutors');
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Buscar tutor por ID' })
  @ApiResponse({ status: 200, description: 'Tutor encontrado' })
  @ApiResponse({ status: 404, description: 'Tutor não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const tutor = await this.tutorService.findOne(id);
      return new SuccessResponse('Tutor encontrado com sucesso', tutor);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Atualizar tutor' })
  @ApiResponse({ status: 200, description: 'Tutor atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tutor não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTutorDto: any) {
    try {
      return new SuccessResponse('Tutor atualizado com sucesso', 'tutor');
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Excluir tutor' })
  @ApiResponse({ status: 200, description: 'Tutor excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Tutor não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return new SuccessResponse('Tutor excluído com sucesso', null);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
