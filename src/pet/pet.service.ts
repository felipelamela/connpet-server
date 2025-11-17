import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import PetHandler from './pet.handlers';
import { ErrorResponse } from '../common/response/errorResponse';
import { PetEntity } from './entities/pet.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PetService {
  constructor(private readonly petHandler: PetHandler) {}
  async create(
    createPetDto: CreatePetDto,
    panelId: string | null,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      if (!panelId) {
        throw new ErrorResponse({
          message: 'Painel não informado',
          statusCode: 400,
        });
      }

      const petModel = new PetEntity(createPetDto);
      return await this.petHandler.createPetHandler(petModel, panelId, tx);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findByTutorDocument(document: string, panelId?: string | null) {
    try {
      if (!panelId) {
        throw new ErrorResponse({
          message: 'Painel não informado',
          statusCode: 400,
        });
      }
      let findPetWithDocumentTutorOnSystem: any[] = [];
      const findPetWithDocumentTutorOnPanel =
        await this.petHandler.findByTutorDocument(document, panelId);
      if(findPetWithDocumentTutorOnPanel.length == 0) {
         findPetWithDocumentTutorOnSystem = []
      }
      return findPetWithDocumentTutorOnPanel;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findAllPets() {
    try {
      return await this.petHandler.findAllPets();
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.petHandler.findPetById(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
