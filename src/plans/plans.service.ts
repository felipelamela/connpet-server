import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansRepository } from './plans.repository';
import { ErrorResponse } from '../common/response/errorResponse';
import { CreatePanelClinicDto } from './dto/create-panel-clinic.dto';
import { PlansHandler } from './plans.handler';

@Injectable()
export class PlansService {
  constructor(
    private readonly plansRepository: PlansRepository,
    private readonly plansHandler: PlansHandler,
  ) {}
  async create(createPlanDto: CreatePlanDto) {
    try {
      return await this.plansRepository.create(createPlanDto);
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar plano.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findAll() {
    try {
      return await this.plansRepository.getPlans();
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar plano.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findOne(id: string) {
    try {
      return await this.plansRepository.getPlansById(id);
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar plano.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    try {
      return await this.plansRepository.update({ id, plan: updatePlanDto });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao atualizar plano.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async changeStatus(id: string, status: boolean) {
    try {
      return await this.plansRepository.changeStatus({ id, status });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao mudar status do plano.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async createPanelClinic(createPanelClinicDto: CreatePanelClinicDto) {
    try {
      //todo: criar meio de pagamento por assas
      //todo: criar webhook para atualizar o status do painel e envio de email para o cliente
      return await this.plansHandler.handlerCreatePanelClinic(
        createPanelClinicDto,
      );
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
