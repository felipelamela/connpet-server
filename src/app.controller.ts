import { Controller, Get, Header } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { MetricsService } from './common/services/metrics.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly metricsService: MetricsService,
  ) {}

  @ApiOperation({ summary: 'Verificar status da API' })
  @ApiResponse({ status: 200, description: 'API funcionando corretamente' })
  @Public()
  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Obter métricas do sistema' })
  @ApiResponse({
    status: 200,
    description: 'Métricas do sistema em formato Prometheus',
  })
  @Public()
  @Get('metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  async getMetrics() {
    return this.metricsService.getMetrics();
  }
}
