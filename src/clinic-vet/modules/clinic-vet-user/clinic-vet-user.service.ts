import { Injectable } from '@nestjs/common';
import { CreateClinicVetUserDto } from './dto/create-clinic-vet-user.dto';
import { UpdateClinicVetUserDto } from './dto/update-clinic-vet-user.dto';
import { generateRandomPassword } from '../../../commom/system/generateRandomPassword';
import { UserEntity } from '../../../user/entities/user.entity';
import { UserProfileEmployeeEntity } from './entities/user-profile-employee.entity';
import { RoleEnum } from '@prisma/client';
import { UserService } from '../../../user/user.service';
import { ErrorResponse } from '../../../commom/response/errorResponse';

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
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }

  findOne(id: number) {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }

  update(id: number, updateClinicVetUserDto: UpdateClinicVetUserDto) {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }

  remove(id: number) {
    try {
      return ""
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar plano.",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }
}
