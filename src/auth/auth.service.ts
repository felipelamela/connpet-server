import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login.auth.dto';
import { PrismaService } from 'src/commom/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ErrorResponse } from '../commom/response/errorResponse';
import { ErrorEnum } from '../commom/enum/error.enum';
import { JwtPayload, AuthResponse } from './entities/jwt-payload.entity';
import { CreateUserPanelDto } from './dto/create-user-panel.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginAuthDto): Promise<AuthResponse> {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          email: loginDto.email,
        },
        include: {
          employeeProfiles: {
            include: {
              company: true,
            },
          },
          tutorProfile: {
            include: {
              pets: true,
            },
          },
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

      // Obter o primeiro perfil de funcionário (se existir)
      const employeeProfile = findUser.employeeProfiles?.[0];
      
      // Criar payload do JWT
      const payload: JwtPayload = {
        sub: findUser.id,
        email: findUser.email,
        name: findUser.name,
        role: employeeProfile?.roles || null,
        companyId: employeeProfile?.companyId || null,
      };

      // Gerar token JWT
      const access_token = await this.jwtService.signAsync(payload);

      // Obter tempo de expiração
      const expiresIn = this.getExpiresInSeconds();

      // Retornar resposta com token e dados do usuário
      // O token será enviado no cookie HttpOnly pelo controller
      return {
        access_token,
        token_type: 'Bearer',
        expires_in: expiresIn,
        user: {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          role: employeeProfile?.roles || null,
          companyId: employeeProfile?.companyId || null,
        },
      };
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  /**
   * Converte o tempo de expiração do JWT para segundos
   */
  private getExpiresInSeconds(): number {
    const expiresIn =
      this.configService.get<string>('JWT_EXPIRES_IN') || '24h';

    // Converter formato '24h', '7d', '30m' para segundos
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 86400; // Padrão: 24h

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 86400;
    }
  }
  async createUserSystem(createUserPanelDto: CreateUserPanelDto){
    try {
      const user = await this.prisma.user.create({
        data: createUserPanelDto,
      });
      return user;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }
}
