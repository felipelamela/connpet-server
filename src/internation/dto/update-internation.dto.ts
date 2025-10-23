import { PartialType } from '@nestjs/mapped-types';
import { CreateInternationDto } from './create-internation.dto';

export class UpdateInternationDto extends PartialType(CreateInternationDto) {}
