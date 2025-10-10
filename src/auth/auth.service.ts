import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.auth.dto';
import { RandomJumper } from 'src/system/randomJumper';
import * as bcrypt from 'bcrypt';
import { CreateNewUserDTO } from './dto/create-new-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewTutorDTO } from './dto/create-new-tutor.dto';
import { generateRandomPassword } from 'src/system/generateRandomPassword';
import { RoleEnum } from 'src/emum/role.enum';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAuthDto: CreateNewUserDTO) {
    try{
      const jumper = RandomJumper();
      const password = await bcrypt.hash(createAuthDto.password, jumper);
      const user = await this.prisma.user.create({
        data: {
          name: createAuthDto.name,
          email: createAuthDto.email,
          password,
          document: createAuthDto.document ?? null,
          role: createAuthDto.role,
          jumper,
        },
      });
      return user;
    } catch (error) {
      throw Error("Erro ao criar usuário");
    }
  }


  async createTutor(createAuthDto: CreateNewTutorDTO) {
    try{
      const jumper = RandomJumper();
      const passwordTutor = generateRandomPassword()
      const password = await bcrypt.hash(passwordTutor, jumper);
      const user = await this.prisma.user.create({
        data: {
          name: createAuthDto.name,
          email: createAuthDto.email,
          password,
          document: createAuthDto.document ?? null,
          role: RoleEnum.TUTOR,
          jumper,
        },
      });

      //adicionar funcionalidade de envio de email após criação da conta do tutor
      return user;
    } catch (error) {
      throw Error("Erro ao criar usuário");
    }
  }
  async login(loginDto: LoginAuthDto) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where:{
          email:loginDto.email
        }
      })
      if(!findUser) throw new Error("Login inválido")
      const isMatch = await bcrypt.compare(loginDto.password, findUser.password);
      if(!isMatch) throw new Error("Login inválido")
      return findUser
    } catch (error) {
      throw new Error(error.message) 
    }
  }

}
