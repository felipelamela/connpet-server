import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/commom/prisma/prisma.service';
import { EstadoEnum } from '../commom/enum/estado.enum';
import { ErrorResponse } from '../commom/response/errorResponse';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAddressDto: CreateAddressDto) {
    try {
      const state = EstadoEnum[createAddressDto.state]
      return await this.prisma.address.create({
        data: {
          ...createAddressDto,
          state
        }
      })
    } catch (error) {
      throw new ErrorResponse({
        message: "Erro ao cadastrar endereço",
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code
      })
    }
  }
  async update(id: string, updateAddressDto: UpdateAddressDto) {
    try {
      return true
      // return await this.prisma.address.update({
      // where: {
      // id: id
      // },
      // data: updateAddressDto
      // })
    } catch {
      throw new Error("Erro ao atualizar endereço")
    }
  }
}
