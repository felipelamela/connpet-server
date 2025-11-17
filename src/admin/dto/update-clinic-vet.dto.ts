import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicVetDto } from './create-clinic-vet.dto';

export class UpdateClinicVetDto extends PartialType(CreateClinicVetDto) {}
