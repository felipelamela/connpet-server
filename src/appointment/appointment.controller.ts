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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ErrorResponse } from '../commom/response/errorResponse';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      return await this.appointmentService.create(createAppointmentDto);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.appointmentService.findAll();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.appointmentService.findOne(+id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    try {
      return await this.appointmentService.update(+id, updateAppointmentDto);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
