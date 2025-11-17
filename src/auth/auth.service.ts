import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login.auth.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ErrorResponse } from '../common/response/errorResponse';
import { ErrorEnum } from '../common/enum/error.enum';
import { JwtPayload, AuthResponse } from './entities/jwt-payload.entity';
import { PanelTypeEnum } from '@prisma/client';

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
        include: this.getUserIncludeConfig(),
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
      return await this.createAuthResponse(findUser);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async selectPanel(
    userId: string,
    panelId: string,
    panelType: PanelTypeEnum,
  ): Promise<AuthResponse> {
    try {
      const userRecord = await this.prisma.user.findUnique({
        where: { id: userId },
        include: this.getUserIncludeConfig(),
      });

      if (!userRecord) {
        throw new ErrorResponse({
          message: 'Usuário não encontrado.',
          statusCode: 404,
          errorsCode: ErrorEnum.NOT_FOUND,
        });
      }

      const panels = this.getPanels(userRecord);
      const selectedPanel = panels.find((panel) => panel.id === panelId);

      if (!selectedPanel) {
        throw new ErrorResponse({
          message: 'Você não possui acesso ao painel selecionado.',
          statusCode: 403,
          errorsCode: ErrorEnum.NOT_AUTHORIZED,
        });
      }

      if (selectedPanel.type !== panelType) {
        throw new ErrorResponse({
          message: 'Tipo do painel informado é inválido.',
          statusCode: 400,
          errorsCode: ErrorEnum.VALIDATION_ERROR,
        });
      }

      return await this.createAuthResponse(userRecord, selectedPanel);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async getAuthenticatedUserProfile(userId: string) {
    try {
      const userRecord = await this.prisma.user.findUnique({
        where: { id: userId },
        include: this.getUserIncludeConfig(),
      });

      if (!userRecord) {
        throw new ErrorResponse({
          message: 'Usuário não encontrado.',
          statusCode: 404,
          errorsCode: ErrorEnum.NOT_FOUND,
        });
      }

      const selectedPanel = this.getSelectedPanel(userRecord);
      return this.buildUserResponse(userRecord, selectedPanel);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  /**
   * Converte o tempo de expiração do JWT para segundos
   */
  private getExpiresInSeconds(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';

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

  private getUserIncludeConfig() {
    return {
      employeeProfiles: {
        include: {
          company: {
            select: {
              id: true,
              panels: {
                select: {
                  id: true,
                  type: true,
                },
              },
            },
          },
        },
      },
      tutorProfile: {
        include: {
          pets: true,
        },
      },
    };
  }

  private getEmployeeProfile(userRecord: any) {
    return userRecord.employeeProfiles?.[0];
  }

  private getPanels(userRecord: any) {
    return this.getEmployeeProfile(userRecord)?.company?.panels || [];
  }

  private getSelectedPanel(
    userRecord: any,
    preferredPanel?: { id: string; type: PanelTypeEnum } | null,
  ) {
    const panels = this.getPanels(userRecord);
    if (preferredPanel) {
      const found = panels.find((panel) => panel.id === preferredPanel.id);
      if (found) {
        return found;
      }
    }
    return panels[0] || null;
  }

  private async createAuthResponse(
    userRecord: any,
    preferredPanel?: { id: string; type: PanelTypeEnum } | null,
  ): Promise<AuthResponse> {
    const selectedPanel = this.getSelectedPanel(userRecord, preferredPanel);
    const employeeProfile = this.getEmployeeProfile(userRecord);

    const payload: JwtPayload = {
      sub: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: employeeProfile?.roles || null,
      companyId: employeeProfile?.companyId || null,
      panelId: selectedPanel?.id || null,
      panelType: selectedPanel?.type || null,
    };

    const access_token = await this.jwtService.signAsync(payload);
    const expires_in = this.getExpiresInSeconds();

    return {
      access_token,
      token_type: 'Bearer',
      expires_in,
      user: this.buildUserResponse(userRecord, selectedPanel),
    };
  }

  private buildUserResponse(
    userRecord: any,
    selectedPanel?: { id: string; type: PanelTypeEnum } | null,
  ) {
    const employeeProfile = this.getEmployeeProfile(userRecord);

    return {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      role: employeeProfile?.roles || null,
      companyId: employeeProfile?.companyId || null,
      panelId: selectedPanel?.id || null,
      panelType: selectedPanel?.type || null,
      panels: this.getPanels(userRecord),
    };
  }
}
