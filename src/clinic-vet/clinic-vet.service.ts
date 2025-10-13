import { Injectable } from '@nestjs/common';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';
import { UpdateClinicVetDto } from './dto/update-clinic-vet.dto';
import { ClinicVetHandlers } from './clinic-vet.handlers';

@Injectable()
export class ClinicVetService {
  constructor(private readonly clinicVetHandlers: ClinicVetHandlers) { }


  async create(createClinicVetDto: CreateClinicVetDto) {
    try {
      const createdClinic = await this.clinicVetHandlers.createClinic(createClinicVetDto)
      return createdClinic
    } catch (error) {
      throw new Error(error.message)
    };
  }
}
