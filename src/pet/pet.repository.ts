import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PetEntity } from './entities/pet.entity';
import { ErrorResponse } from '../common/response/errorResponse';
import { Prisma } from '@prisma/client';
import { getSpeciesName, getBreedName } from '../common/enum/species-breed.mapper';

@Injectable()
export default class PetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPet(data: PetEntity, tx?: Prisma.TransactionClient) {
    try {
      const client = tx || this.prisma;
      return await client.pet.create({ data:{
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
      } });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar Pet',
        errorsCode: error.code,
        details: error.meta,
        statusCode: 400,
      });
    }
  }
  async createPetCompany(data: {
    petId: string;
    panelId: string;
  }, tx?: Prisma.TransactionClient) {
    try {
      const client = tx || this.prisma;
      return await client.petCompany.create({ data: data });
    } catch (error) {
      throw new ErrorResponse({
          message: 'Erro ao cadastrar Pet Company',
          errorsCode: error.code,
          details: error.meta,
          statusCode: 400,
      });
    }
  }

  async findByTutorDocument(document: string, panelId: string) {
    try {
      const pets = await this.prisma.pet.findMany({
        where: {
          tutor: {
            document: document,
              tutorCompanies: {
                some: {
                  panelId:panelId,
                },
              },
          },
        },
        select: {
          id: true,
          name: true,
          species: true,
          breed: true,
          birthDate: true,
          color: true,
          weight: true,
          microchipNumber: true,
          gender: true,
          tutor: {
            select: {
              document: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      // Mapear species e breed para strings descritivas
      return pets.map((pet) => {
        const speciesNumber = pet.species;
        return {
          ...pet,
          species: getSpeciesName(speciesNumber) as any,
          breed: getBreedName(speciesNumber, pet.breed) as any,
        };
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar pets do tutor',
        errorsCode: error.code,
        details: error.meta,
        statusCode: 400,
      });
    }
  }

  async findAllPets() {
    try {
      const pets = await this.prisma.pet.findMany({
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
          species: true,
          breed: true,
          birthDate: true,
          color: true,
          weight: true,
          microchipNumber: true,
          gender: true,
          active: true,
          tutor: {
            select: {
              document: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      // Mapear species e breed para strings descritivas
      return pets.map((pet) => {
        const speciesNumber = pet.species;

        return {
          ...pet,
          species: getSpeciesName(speciesNumber) as any,
          breed: getBreedName(speciesNumber, pet.breed) as any,
        };
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar todos os pets',
        errorsCode: error.code,
        details: error.meta,
        statusCode: 400,
      });
    }
  }

  async findPetById(id: string) {
    try {
      const pet = await this.prisma.pet.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          species: true,
          breed: true,
          birthDate: true,
          color: true,
          weight: true,
          microchipNumber: true,
          gender: true,
          active: true,
          observations: true,
          createdAt: true,
          tutor: {
            select: {
              id: true,
              userId: true,
              document: true,
              phone: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  status: true,
                },
              },
              address: {
                select: {
                  id: true,
                  cep: true,
                  street: true,
                  number: true,
                  complement: true,
                  neighborhood: true,
                  city: true,
                  state: true,
                  country: true,
                },
              },
            },
          },
        },
      });

      if (!pet) {
        throw new ErrorResponse({
          message: 'Pet não encontrado',
          statusCode: 404,
        });
      }

      // Mapear species e breed para strings descritivas
      const speciesNumber = pet.species;
      return {
        ...pet,
        species: getSpeciesName(speciesNumber) as any,
        breed: getBreedName(speciesNumber, pet.breed) as any,
      };
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        message: 'Erro ao buscar pet',
        errorsCode: error.code,
        details: error.meta,
        statusCode: 400,
      });
    }
  }
}
