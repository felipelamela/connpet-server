import { PartialType } from '@nestjs/mapped-types';
import { CreateTutorDTO } from './create-tutor.dto';

export class UpdateTutorDto extends PartialType(CreateTutorDTO) { }
