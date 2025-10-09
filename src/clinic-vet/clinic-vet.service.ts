import { Injectable } from '@nestjs/common';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';
import { UpdateClinicVetDto } from './dto/update-clinic-vet.dto';

@Injectable()
export class ClinicVetService {
  create(createClinicVetDto: CreateClinicVetDto) {
    return 'This action adds a new clinicVet';
  }

  findAll() {
    return `This action returns all clinicVet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clinicVet`;
  }

  update(id: number, updateClinicVetDto: UpdateClinicVetDto) {
    return `This action updates a #${id} clinicVet`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinicVet`;
  }
}
