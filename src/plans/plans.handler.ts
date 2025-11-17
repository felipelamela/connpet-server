import { Injectable } from '@nestjs/common';
import { PlansRepository } from './plans.repository';
import { ErrorResponse } from '../common/response/errorResponse';
import { CreatePanelClinicDto } from './dto/create-panel-clinic.dto';
import { PanelService } from 'src/services/panel/panel.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PlansHandler {
  constructor(
    private readonly plansRepository: PlansRepository,
    private readonly panelService: PanelService,
  ) {}
  async handlerCreatePanelClinic(createPanelClinicDto: CreatePanelClinicDto) {
    try {
      const panel = await this.panelService.create({
        companyId: createPanelClinicDto.companyId,
        type: createPanelClinicDto.type,
        billingPeriod: createPanelClinicDto.billingPeriod,
        active: createPanelClinicDto.active,
      });
      return panel;
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar painel da clínica.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }
}
