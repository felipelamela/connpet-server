import { Module } from '@nestjs/common';
import { ResultExamService } from './result-exam.service';
import { ResultExamController } from './result-exam.controller';

@Module({
  controllers: [ResultExamController],
  providers: [ResultExamService],
})
export class ResultExamModule { }
