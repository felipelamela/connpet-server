import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { ResultExamModule } from './module/result-exam/result-exam.module';

@Module({
  imports: [ResultExamModule],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule { }
