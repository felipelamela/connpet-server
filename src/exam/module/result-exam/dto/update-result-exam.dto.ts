import { PartialType } from '@nestjs/mapped-types';
import { CreateResultExamDto } from './create-result-exam.dto';

export class UpdateResultExamDto extends PartialType(CreateResultExamDto) {}
