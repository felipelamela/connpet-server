import { Injectable } from '@nestjs/common';
import { generateRandomPassword } from '../common/system/generateRandomPassword';
import { CreateTutorDTO } from './dto/create-tutor.dto';
import TutorRepository from './tutor.repository';
import { CreateTutorWithPetDto } from './dto/create-tutor-with-pet.dto';
import { PetEntity } from '../pet/entities/pet.entity';
import { ErrorResponse } from '../common/response/errorResponse';
import { AddressService } from 'src/services/address/address.service';
import { UserService } from 'src/services/user/user.service';
import AddressEntity from 'src/services/address/entity/address.entity';
import { UserEntity } from 'src/services/user/entities/user.entity';
import { TutorEntity } from './entities/tutor.entity';
import { PrismaService } from '../common/prisma/prisma.service';
import PetRepository from 'src/pet/pet.repository';

@Injectable()
export class TutorService {
  constructor(
    private readonly tutorRepository: TutorRepository,
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    private readonly petRepsitory: PetRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createTutorDto: CreateTutorDTO) {
    try {
      //adicionar validação de cadastro de tutor

      const passwordTutor = generateRandomPassword();

      const addressEntity = new AddressEntity(createTutorDto);
      const userEntity = new UserEntity({
        ...createTutorDto,
        password: passwordTutor,
        status: true,
      });

      const [addressId, userId] = await Promise.all([
        this.addressService.create(addressEntity),
        this.userService.create(userEntity),
      ]);

      const tutorEntity = new TutorEntity({
        userId: userId.id,
        addressId: addressId.id,
        document: createTutorDto.document ? createTutorDto.document : null,
        phone: createTutorDto.phone ? createTutorDto.phone : null,
      });

      const tutorId = await this.tutorRepository.create(tutorEntity);

      return tutorId;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
  async createTutorWithPet(createTutorWithPet: CreateTutorWithPetDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const passwordTutor = generateRandomPassword();

        const addressEntity = new AddressEntity(createTutorWithPet);
        const userEntity = new UserEntity({
          ...createTutorWithPet,
          password: passwordTutor,
          status: true,
        });

        const [addressId, userId] = await Promise.all([
          this.addressService.create(addressEntity, tx),
          this.userService.create(userEntity, tx),
        ]);

        const tutorEntity = new TutorEntity({
          userId: userId.id,
          addressId: addressId.id,
          document: createTutorWithPet.document
            ? createTutorWithPet.document
            : null,
          phone: createTutorWithPet.phone ? createTutorWithPet.phone : null,
        });

        const tutorId = await this.tutorRepository.create(tutorEntity, tx);

        const newPet = new PetEntity({
          ...createTutorWithPet,
          tutorId: tutorId.id,
          name: createTutorWithPet.namePet
          
        })
        const pet = await this.petRepsitory.createPet(newPet,tx,);
        await Promise.all([
          this.petRepsitory.createPetCompany({
            petId: pet.id,
            panelId: "e2ce53d8-e3b6-4c16-bc1f-56ab5aa45a09",
          }, tx),
          this.tutorRepository.createTutorCompany({
            tutorId: tutorId.id,
            panelId: "e2ce53d8-e3b6-4c16-bc1f-56ab5aa45a09",
          }, tx),
        ]);

        return pet;
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar tutor com pet',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }
  async findOne(id: string) {
    try {
      return await this.tutorRepository.findTutor(id);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
