import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InternationService } from './internation.service';
import { CreateInternationDto } from './dto/create-internation.dto';
import { UpdateInternationDto } from './dto/update-internation.dto';
import { SuccessResponse } from '../commom/response/successResponse';
import { ErrorResponse } from '../commom/response/errorResponse';

@Controller('internation')
export class InternationController {
  constructor(private readonly internationService: InternationService) {}

  @Post()
  async create(@Body() createInternationDto: CreateInternationDto) {
    try {
      const internation = await this.internationService.create(createInternationDto);
      return new SuccessResponse('Internação criada com sucesso', internation);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get()
  async findAll() {
    try {
      const internations = await this.internationService.findAll();
      return new SuccessResponse('Internações encontradas', internations);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('active')
  async findActive() {
    try {
      const internations = await this.internationService.findActive();
      return new SuccessResponse('Internações ativas encontradas', internations);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('pet/:petId')
  async findByPetId(@Param('petId') petId: string) {
    try {
      const internations = await this.internationService.findByPetId(petId);
      return new SuccessResponse('Internações do pet encontradas', internations);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get('clinic/:clinicId')
  async findByClinicId(@Param('clinicId') clinicId: string) {
    try {
      const internations = await this.internationService.findByClinicId(clinicId);
      return new SuccessResponse('Internações da clínica encontradas', internations);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const internation = await this.internationService.findOne(id);
      return new SuccessResponse('Internação encontrada', internation);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInternationDto: UpdateInternationDto,
  ) {
    try {
      const internation = await this.internationService.update(id, updateInternationDto);
      return new SuccessResponse('Internação atualizada com sucesso', internation);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const internation = await this.internationService.remove(id);
      return new SuccessResponse('Internação deletada com sucesso', internation);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
