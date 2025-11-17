import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { SuccessResponse } from '../common/response/successResponse';
import { ErrorResponse } from '../common/response/errorResponse';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';
import { AddAppointmentItemDto } from './dto/add-appointment-item.dto';
import { CreateAppointmentNoteDto } from './dto/create-appointment-note.dto';

@ApiTags('appointments')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @ApiOperation({ summary: 'Criar nova consulta' })
  @ApiResponse({ status: 201, description: 'Consulta criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post()
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const appointment = await this.appointmentService.create(
        createAppointmentDto,
        user
      );
      return new SuccessResponse('Consulta criada com sucesso', appointment);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Listar todas as consultas' })
  @ApiResponse({ status: 200, description: 'Lista de consultas' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get()
  async findAll(
    @Query() filters: any,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const appointments = await this.appointmentService.findAll(
        user?.panelId || null,
        filters,
      );
      return new SuccessResponse(
        'Consultas listadas com sucesso',
        appointments,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Adicionar item à consulta' })
  @ApiResponse({ status: 200, description: 'Item adicionado com sucesso' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post(':id/items')
  async addItem(
    @Param('id') id: string,
    @Body() addAppointmentItemDto: AddAppointmentItemDto,
  ) {
    try {
      const appointment = await this.appointmentService.addItem(id, addAppointmentItemDto);
      return new SuccessResponse('Item adicionado com sucesso', appointment);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Remover item da consulta' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Delete(':id/items/:itemId')
  async removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    try {
      const appointment = await this.appointmentService.removeItem(id, itemId);
      return new SuccessResponse('Item removido com sucesso', appointment);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Buscar consulta por ID' })
  @ApiResponse({ status: 200, description: 'Consulta encontrada' })
  @ApiResponse({ status: 404, description: 'Consulta não encontrada' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const appointment = await this.appointmentService.findOne(id);
      return new SuccessResponse(
        'Consulta encontrada com sucesso',
        appointment,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Atualizar consulta' })
  @ApiResponse({ status: 200, description: 'Consulta atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Consulta não encontrada' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    try {
      const appointment = await this.appointmentService.update(
        id,
        updateAppointmentDto,
      );
      return new SuccessResponse(
        'Consulta atualizada com sucesso',
        appointment,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Excluir consulta' })
  @ApiResponse({ status: 200, description: 'Consulta excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Consulta não encontrada' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return new SuccessResponse('Consulta excluída com sucesso', null);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Adicionar nota à consulta' })
  @ApiResponse({ status: 200, description: 'Nota adicionada com sucesso' })
  @ApiResponse({ status: 404, description: 'Consulta não encontrada' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post(':id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() createNoteDto: CreateAppointmentNoteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const note = await this.appointmentService.addNote(id, createNoteDto, user);
      return new SuccessResponse('Nota adicionada com sucesso', note);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
