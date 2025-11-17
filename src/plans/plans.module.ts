import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { PlansRepository } from './plans.repository';
import { PanelService } from 'src/services/panel/panel.service';
import { PlansHandler } from './plans.handler';
@Module({
  controllers: [PlansController],
  providers: [PlansService, PlansRepository, PanelService, PlansHandler],
})
export class PlansModule {}
