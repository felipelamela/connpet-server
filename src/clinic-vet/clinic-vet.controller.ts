import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClinicVetService } from './clinic-vet.service';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';
import { UpdateClinicVetDto } from './dto/update-clinic-vet.dto';
import { SuccessResponse } from 'src/commom/response/successResponse';
import { ErrorResponse } from 'src/commom/response/errorResponse';
import { ErrorEnum } from 'src/commom/enum/error.enum';
import { Public } from '../commom/decorators/public.decorator';

@Controller('clinic-vet')
export class ClinicVetController {
  constructor(private readonly clinicVetService: ClinicVetService) {}

  @Public()
  @Post()
  async create(@Body() createClinicVetDto: CreateClinicVetDto) {
    try {
      const newClinic = await this.clinicVetService.create(createClinicVetDto);
      //criar funcionalidade de envio de email após sucesso do cadastro
      return new SuccessResponse('Clinica criada com sucesso', newClinic);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @Post('/plans')
  async createClinicPlans(
    @Body() createClinicPlans: { idClinic: string; idPlan: string },
  ) {
    try {
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
