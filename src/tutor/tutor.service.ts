import { Injectable } from '@nestjs/common';
import { generateRandomPassword } from '../system/generateRandomPassword';
import { CreateTutorDTO } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import TutorRepository from './tutor.repository';
import AddressEntity from '../address/entity/address.entity';
import { AddressService } from '../address/address.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';


@Injectable()
export class TutorService {
  constructor(
    private readonly tutorResository: TutorRepository,
    private readonly addressService: AddressService,
    private readonly userService: UserService
  ) { }

  async create(createTutorDto: CreateTutorDTO) {
    try {
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
  findOne(id: number) {
  }

  update(id: number, updateTutorDto: UpdateTutorDto) {
    return `This action updates a #${id} tutor`;
  }

  remove(id: number) {
    return `This action removes a #${id} tutor`;
  }
}
