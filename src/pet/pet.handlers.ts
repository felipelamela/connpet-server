import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "../commom/response/errorResponse";
import PetRepository from "./pet.repository";
import { CreatePetDto } from "./dto/create-pet.dto";
import { PetEntity } from "./entities/pet.entity";

@Injectable()
export default class PetHandler {
  constructor(private readonly petRepository: PetRepository) { }

  async createPetHandler(pet: PetEntity) {
    try {
      return await this.petRepository.createPet(pet)
    } catch (error) {
      throw new ErrorResponse(error)
    }
  }
}