import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultExamService } from './result-exam.service';
import { CreateResultExamDto } from './dto/create-result-exam.dto';
import { UpdateResultExamDto } from './dto/update-result-exam.dto';

@Controller('result-exam')
export class ResultExamController {
  constructor(private readonly resultExamService: ResultExamService) {}

  @Post()
  create(@Body() createResultExamDto: CreateResultExamDto) {
    return this.resultExamService.create(createResultExamDto);
  }

  @Get()
  findAll() {
    return this.resultExamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultExamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultExamDto: UpdateResultExamDto) {
    return this.resultExamService.update(+id, updateResultExamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultExamService.remove(+id);
  }
}
