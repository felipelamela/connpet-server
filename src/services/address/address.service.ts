import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ErrorResponse } from 'src/common/response/errorResponse';
import { Prisma } from '@prisma/client';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto, tx?: Prisma.TransactionClient) {
    try {
      const client = tx || this.prisma;
      return await client.address.create({
        data: {
          ...createAddressDto,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao cadastrar endereço',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }
  async update(id: string, updateAddressDto: UpdateAddressDto) {
    try {
      return await this.prisma.address.update({
        where: {
          id: id
        },
        data: updateAddressDto
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao atualizar endereço',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }
}
