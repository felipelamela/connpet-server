import { Module } from '@nestjs/common';
import { InternationService } from './internation.service';
import { InternationController } from './internation.controller';
import { InternationRepository } from './internation.repository';
import { InternationHandlers } from './internation.handlers';
import { PrismaModule } from '../commom/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InternationController],
  providers: [InternationService, InternationRepository, InternationHandlers],
  exports: [InternationService],
})
export class InternationModule {}
