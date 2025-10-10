import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private readonly prisma:PrismaService){}

  async create(createAddressDto: CreateAddressDto) {
    try {
      return await this.prisma.address.create({data:createAddressDto})
    } catch {
      throw new Error("Erro ao cadastrar endereço")
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.address.findFirst({
        where:{id:id}
      })
    } catch {
      throw new Error("Erro ao buscar endereço")
    }
  }
  async update(id: string, updateAddressDto: UpdateAddressDto) {
    try {
      return await this.prisma.address.update({
        where:{
          id:id
        },
        data:updateAddressDto})
    } catch {
      throw new Error("Erro ao atualizar endereço")
    }  
  }

  async remove(id: string) {
    try {
      return await this.prisma.address.delete({
        where:{
          id:id
        }}
      )
    } catch {
      throw new Error("Erro ao deletar endereço")
    }    
  }
}
