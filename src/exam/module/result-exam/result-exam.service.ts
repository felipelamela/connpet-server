import { Injectable } from '@nestjs/common';
import { CreateResultExamDto } from './dto/create-result-exam.dto';
import { UpdateResultExamDto } from './dto/update-result-exam.dto';

@Injectable()
export class ResultExamService {
  create(createResultExamDto: CreateResultExamDto) {
    return 'This action adds a new resultExam';
  }

  findAll() {
    return `This action returns all resultExam`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resultExam`;
  }

  update(id: number, updateResultExamDto: UpdateResultExamDto) {
    return `This action updates a #${id} resultExam`;
  }

  remove(id: number) {
    return `This action removes a #${id} resultExam`;
  }
}
