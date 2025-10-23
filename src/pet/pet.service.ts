import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import PetHandler from './pet.handlers';
import { ErrorResponse } from '../commom/response/errorResponse';
import { PetEntity } from './entities/pet.entity';

@Injectable()
export class PetService {
  constructor(private readonly petHandler: PetHandler) {}
  async create(createPetDto: CreatePetDto) {
    try {
      const petModel = new PetEntity(createPetDto);
      return await this.petHandler.createPetHandler(petModel);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
