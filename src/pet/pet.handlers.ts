import { Injectable } from '@nestjs/common';
import { ErrorResponse } from '../common/response/errorResponse';
import PetRepository from './pet.repository';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetEntity } from './entities/pet.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export default class PetHandler {
  constructor(private readonly petRepository: PetRepository) {}

  async createPetHandler(
    pet: PetEntity,
    panelId: string,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const createdPet = await this.petRepository.createPet(pet, tx);

      if (panelId) {
        await this.petRepository.createPetCompany(
          {
            petId: createdPet.id,
            panelId,
          },
          tx,
        );
      }

      return createdPet;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByTutorDocument(document: string, panelId: string) {
    try {
      return await this.petRepository.findByTutorDocument(document, panelId);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAllPets() {
    try {
      return await this.petRepository.findAllPets();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findPetById(id: string) {
    try {
      return await this.petRepository.findPetById(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
