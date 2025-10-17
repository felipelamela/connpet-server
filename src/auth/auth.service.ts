import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.auth.dto';
import { PrismaService } from 'src/commom/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ErrorResponse } from '../commom/response/errorResponse';
import { ErrorEnum } from '../commom/enum/error.enum';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginAuthDto) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          email: loginDto.email,
        },
        include: {
          UserProfileEmployee: true,
          UserProfileTutor: true,
        },
      });
      if (!findUser)
        throw new ErrorResponse({
          message: 'Usuário inválido.',
          statusCode: 400,
          errorsCode: ErrorEnum.NOT_FOUND,
        });
      const isMatch = await bcrypt.compare(
        loginDto.password,
        findUser.password,
      );
      if (!isMatch)
        throw new ErrorResponse({
          message: 'Usuário inválido.',
          statusCode: 400,
          errorsCode: ErrorEnum.INVALID_CREDENTIALS,
        });
      return findUser;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
