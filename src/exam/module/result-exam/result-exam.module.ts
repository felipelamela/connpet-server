import { Module } from '@nestjs/common';
import { ResultExamService } from './result-exam.service';
import { ResultExamController } from './result-exam.controller';
import { ResultExamRepository } from './result-exam.repository';
import { ResultExamHandlers } from './result-exam.handlers';
import { PrismaModule } from '../../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResultExamController],
  providers: [ResultExamService, ResultExamHandlers, ResultExamRepository],
  exports: [ResultExamService],
})
export class ResultExamModule {}
