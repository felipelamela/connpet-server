import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import client from 'prom-client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Object {
    return this.appService.getHello();
  }
  
  @Get('metrics')
  getMetrics() {
    return client.register.metrics();
  }
}
