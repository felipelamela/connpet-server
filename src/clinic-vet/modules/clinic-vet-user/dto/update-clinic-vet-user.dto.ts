import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicVetUserDto } from './create-clinic-vet-user.dto';

export class UpdateClinicVetUserDto extends PartialType(CreateClinicVetUserDto) {}
