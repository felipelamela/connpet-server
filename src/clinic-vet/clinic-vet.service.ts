import { Injectable } from '@nestjs/common';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';
import { UpdateClinicVetDto } from './dto/update-clinic-vet.dto';
import { ClinicVetHandlers } from './clinic-vet.handlers';

@Injectable()
export class ClinicVetService {
  constructor(private readonly clinicVetHandlers: ClinicVetHandlers){}
  
  
  async create(createClinicVetDto: CreateClinicVetDto) {
    try {
      const createdClinic = await this.clinicVetHandlers.createClinic(createClinicVetDto)
      return createdClinic  
    } catch (error) {
      throw new Error(error.message)
    };
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
