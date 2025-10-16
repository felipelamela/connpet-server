import { Injectable } from '@nestjs/common';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';
import { ClinicVetHandlers } from './clinic-vet.handlers';
import { UserEntity } from '../user/entities/user.entity';
import { ClinicVetEntity } from './entities/clinic-vet.entity';
import { ErrorResponse } from '../commom/response/errorResponse';
import { User, VeterinaryClinic } from '@prisma/client';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Injectable()
export class ClinicVetService {
  constructor(private readonly clinicVetHandlers: ClinicVetHandlers) { }
  async create(createClinicVetDto: CreateClinicVetDto): Promise<{ user: User, clinic: VeterinaryClinic }> {
    try {
      const userEntity = new UserEntity({
        ...createClinicVetDto,
        status: true,
      })
      const clinicEntity = new ClinicVetEntity(createClinicVetDto)
      await this.clinicVetHandlers.validateCreateClinic({ userEmail: userEntity.email, cnpj: clinicEntity.cnpj })
      const createdClinic = await this.clinicVetHandlers.createClinic({ createClinic: clinicEntity, user: userEntity })
      return createdClinic
    } catch (error) {
      throw new ErrorResponse(error)
    };
  }
  async createUserProfile(createUserProfileDto: CreateUserProfileDto) {
    try {
      await this.clinicVetHandlers.validateUserProfile({})
    } catch (error) {
      throw new ErrorResponse(error)
    }
  }
}
