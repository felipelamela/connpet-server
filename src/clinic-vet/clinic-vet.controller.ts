import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClinicVetService } from './clinic-vet.service';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';
import { UpdateClinicVetDto } from './dto/update-clinic-vet.dto';
import { SuccessResponse } from 'src/response/successResponse';
import { ErrorResponse } from 'src/response/errorResponse';
import { ErrorEnum } from 'src/commom/enum/error.enum';

@Controller('clinic-vet')
export class ClinicVetController {
  constructor(private readonly clinicVetService: ClinicVetService) { }

  @Post()
  async create(@Body() createClinicVetDto: CreateClinicVetDto) {
    try {
      const newClinic = await this.clinicVetService.create(createClinicVetDto);
      return new SuccessResponse('Clinica criada com sucesso', newClinic);
    } catch (error) {
      return new ErrorResponse(error.message, 404, ErrorEnum.USER_CREATE_ERROR)
    }
  }
}
