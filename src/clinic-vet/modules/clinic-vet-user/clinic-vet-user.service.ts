import { Injectable } from '@nestjs/common';
import { CreateClinicVetUserDto } from './dto/create-clinic-vet-user.dto';
import { UpdateClinicVetUserDto } from './dto/update-clinic-vet-user.dto';

@Injectable()
export class ClinicVetUserService {
  create(createClinicVetUserDto: CreateClinicVetUserDto) {
    return 'This action adds a new clinicVetUser';
  }

  findAll() {
    return `This action returns all clinicVetUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clinicVetUser`;
  }

  update(id: number, updateClinicVetUserDto: UpdateClinicVetUserDto) {
    return `This action updates a #${id} clinicVetUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinicVetUser`;
  }
}
