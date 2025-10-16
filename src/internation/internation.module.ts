import { Module } from '@nestjs/common';
import { InternationService } from './internation.service';
import { InternationController } from './internation.controller';

@Module({
  controllers: [InternationController],
  providers: [InternationService],
})
export class InternationModule {}
