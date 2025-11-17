import { Module } from '@nestjs/common';
import { GroomingService } from './grooming.service';
import { GroomingController } from './grooming.controller';
import { GroomingRepository } from './grooming.repository';
import { GroomingHandlers } from './grooming.handlers';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GroomingController],
  providers: [GroomingService, GroomingHandlers, GroomingRepository],
  exports: [GroomingService],
})
export class GroomingModule {}

