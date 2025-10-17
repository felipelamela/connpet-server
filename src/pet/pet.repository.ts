import { Injectable } from '@nestjs/common';
import { TutorService } from '../tutor/tutor.service';
import { PrismaService } from '../commom/prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetEntity } from './entities/pet.entity';
import { ErrorResponse } from '../commom/response/errorResponse';

@Injectable()
export default class PetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPet(data: PetEntity) {
    try {
      return await this.prisma.pet.create({ data });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar Pet',
        errorsCode: error.code,
        details: error.meta,
        statusCode: 400,
      });
    }
  }
}
