import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.auth.dto';
import { RandomJumper } from 'src/commom/system/randomJumper';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async login(loginDto: LoginAuthDto) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          email: loginDto.email
        }
      })
      if (!findUser) throw new Error("Login inválido")
      const isMatch = await bcrypt.compare(loginDto.password, findUser.password);
      if (!isMatch) throw new Error("Login inválido")
      return findUser
    } catch (error) {
      throw new Error(error.message)
    }
  }

}
