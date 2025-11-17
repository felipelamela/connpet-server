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
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { SuccessResponse } from '../common/response/successResponse';
import { ErrorResponse } from '../common/response/errorResponse';
import { ErrorEnum } from '../common/enum/error.enum';
import { CreatePanelClinicDto } from './dto/create-panel-clinic.dto';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @ApiOperation({ summary: 'Criar novo plano' })
  @ApiResponse({ status: 201, description: 'Plano criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  // @ApiBearerAuth('JWT-auth')
  // @ApiCookieAuth('access_token')
  @Post()
  async create(@Body() createPlanDto: CreatePlanDto) {
    try {
      const plan = await this.plansService.create(createPlanDto);
      return new SuccessResponse('Plano criado com sucesso', plan);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Listar todos os planos' })
  @ApiResponse({ status: 200, description: 'Lista de planos' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get()
  async findAll() {
    try {
      const plans = await this.plansService.findAll();
      return new SuccessResponse('Planos listados com sucesso', plans);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Buscar plano por ID' })
  @ApiResponse({ status: 200, description: 'Plano encontrado' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const plan = await this.plansService.findOne(id);
      return new SuccessResponse('Plano encontrado com sucesso', plan);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Atualizar plano' })
  @ApiResponse({ status: 200, description: 'Plano atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    try {
      const plan = await this.plansService.update(id, updatePlanDto);
      return new SuccessResponse('Plano atualizado com sucesso', plan);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Alterar status do plano' })
  @ApiResponse({
    status: 200,
    description: 'Status do plano alterado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Put('change-status/:id')
  async changeStatus(@Param('id') id: string) {
    try {
      const plan = await this.plansService.changeStatus(id, false);
      return new SuccessResponse('Status do plano alterado com sucesso', plan);
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
  @ApiOperation({ summary: 'Criar painel da clínica com plano' })
  @ApiResponse({
    status: 201,
    description: 'Painel da clínica criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Post('panel-clinic')
  async createPanelClinic(@Body() createPanelClinicDto: CreatePanelClinicDto) {
    try {
      const result =
        await this.plansService.createPanelClinic(createPanelClinicDto);
      return new SuccessResponse(
        'Painel da clínica criado com sucesso',
        result,
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Atualizar painel da clínica' })
  @ApiResponse({
    status: 200,
    description: 'Painel da clínica atualizado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @Put('panel-clinic/:id')
  async updatePanelClinic(
    @Param('id') id: string,
    @Body() updatePanelClinicDto: any,
  ) {
    try {
      //todo: atualizar status do painel,
      return new SuccessResponse(
        'Painel da clínica atualizado com sucesso',
        'result',
      );
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
