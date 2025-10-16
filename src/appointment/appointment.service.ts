import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ErrorResponse } from '../commom/response/errorResponse';

@Injectable()
export class AppointmentService {
  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }

  async findAll() {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }

  async findOne(id: number) {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }


}
