import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { MetricsService } from './commom/services/metrics.service';
import { Public } from './commom/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly metricsService: MetricsService,
  ) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  @Public()
  @Get('metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  async getMetrics() {
    return this.metricsService.getMetrics();
  }
}
