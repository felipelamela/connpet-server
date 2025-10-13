import { Injectable } from '@nestjs/common';
import { RandomJumper } from '../system/randomJumper';
import { generateRandomPassword } from '../system/generateRandomPassword';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateTutorDTO } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';


@Injectable()
export class TutorService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTutorDto: CreateTutorDTO) {
    try {
      const jumper = RandomJumper();
      const passwordTutor = generateRandomPassword()
      const password = await bcrypt.hash(passwordTutor, jumper);

      //adicionar funcionalidade de envio de email após criação da conta do tutor
      return "";
    } catch (error) {
      throw Error("Erro ao criar usuário");
    }
  }

  findAll() {
    return `This action returns all tutor`;
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
