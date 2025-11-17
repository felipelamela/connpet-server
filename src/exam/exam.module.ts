import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { ExamRepository } from './exam.repository';
import { ExamHandlers } from './exam.handlers';
import { ResultExamModule } from './module/result-exam/result-exam.module';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [ResultExamModule, PrismaModule],
  controllers: [ExamController],
  providers: [ExamService, ExamHandlers, ExamRepository],
  exports: [ExamService],
})
export class ExamModule {}
