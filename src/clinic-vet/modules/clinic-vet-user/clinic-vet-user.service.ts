import { Injectable } from '@nestjs/common';
import { CreateClinicVetUserDto } from './dto/create-clinic-vet-user.dto';
import { UpdateClinicVetUserDto } from './dto/update-clinic-vet-user.dto';
import { generateRandomPassword } from '../../../commom/system/generateRandomPassword';
import { UserEntity } from '../../../user/entities/user.entity';
import { UserProfileEmployeeEntity } from './entities/user-profile-employee.entity';
import { RoleEnum } from '@prisma/client';
import { UserService } from '../../../user/user.service';

@Injectable()
export class ClinicVetUserService {
  constructor(
    private readonly userService: UserService
  ) { }
  async create(createClinicVetUserDto: CreateClinicVetUserDto) {

    const password = generateRandomPassword()

    const userEntity = new UserEntity({ ...createClinicVetUserDto, password, status: true })

    const userId = await this.userService.create(userEntity)

    const userProfile = new UserProfileEmployeeEntity({
      ...createClinicVetUserDto,
      userId: userId.id,

      roles: RoleEnum[createClinicVetUserDto.roles]
    })


    return userProfile;
  }

  findAll() {
    return `This action returns all clinicVetUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clinicVetUser`;
  }

  update(id: number, updateClinicVetUserDto: UpdateClinicVetUserDto) {
    return `This action updates a #${id} clinicVetUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinicVetUser`;
  }
}
