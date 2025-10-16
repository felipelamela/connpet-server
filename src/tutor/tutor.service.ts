import { Injectable } from '@nestjs/common';
import { generateRandomPassword } from '../commom/system/generateRandomPassword';
import { CreateTutorDTO } from './dto/create-tutor.dto';
import TutorRepository from './tutor.repository';
import AddressEntity from '../address/entity/address.entity';
import { AddressService } from '../address/address.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { CreateTutorWithPetDto } from './dto/create-tutor-with-pet.dto';
import { PetEntity } from '../pet/entities/pet.entity';
import { PetService } from '../pet/pet.service';
import { ErrorResponse } from '../commom/response/errorResponse';


@Injectable()
export class TutorService {
  constructor(
    private readonly tutorResository: TutorRepository,
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    private readonly petService: PetService
  ) { }

  async create(createTutorDto: CreateTutorDTO) {
    try {
      //adicionar validação de cadastro de tutor

      const passwordTutor = generateRandomPassword()

      const addressEntity = new AddressEntity(createTutorDto)
      const userEntity = new UserEntity({ ...createTutorDto, password: passwordTutor, status: true })

      const [addressId, userId] = await Promise.all([
        this.addressService.create(addressEntity),
        this.userService.create(userEntity)
      ])

      const tutorId = await this.tutorResository.create({
        addressId: addressId.id,
        userId: userId.id,
        document: createTutorDto.document ? createTutorDto.document : null,
        phone: createTutorDto.phone ? createTutorDto.phone : null

      })

      return tutorId;
    } catch (error) {
      throw Error("Erro ao criar usuário");
    }
  }
  async createTutorWithPet(createTutorWithPet: CreateTutorWithPetDto) {

    const passwordTutor = generateRandomPassword()

    const addressEntity = new AddressEntity(createTutorWithPet)
    const userEntity = new UserEntity({ ...createTutorWithPet, password: passwordTutor, status: true })

    const [addressId, userId] = await Promise.all([
      this.addressService.create(addressEntity),
      this.userService.create(userEntity)
    ])

    const tutorId = await this.tutorResository.create({
      addressId: addressId.id,
      userId: userId.id,
      document: createTutorWithPet.document ? createTutorWithPet.document : null,
      phone: createTutorWithPet.phone ? createTutorWithPet.phone : null
    })

    return await this.petService.create({
      ...createTutorWithPet,
      tutorId: tutorId.id
    })

  }
  async findOne(id: string) {
    try {
      return await this.tutorResository.findTutor(id)
    } catch (error) {
      throw new ErrorResponse(error)
    }
  }
}
