import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { ErrorResponse } from 'src/common/response/errorResponse';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guardians/jwt-auth.guardian';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { SelectPanelDto } from './dto/select-panel.dto';
import { JwtPayload } from './entities/jwt-payload.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Realizar login do usuário' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @Public()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    try {
      const authResponse = await this.authService.login(loginAuthDto);

      // Definir cookie HttpOnly + Secure + SameSite (para autenticação web)
      reply.setCookie('access_token', authResponse.access_token, {
        httpOnly: true, // Não acessível via JavaScript (XSS protection)
        secure: process.env.NODE_ENV === 'production', // HTTPS em produção
        sameSite: 'lax', // Proteção contra CSRF
        maxAge: authResponse.expires_in * 1000, // Converte para milissegundos
        path: '/', // Disponível em todo o site
      });

      // Retorna dados completos (incluindo token para mobile/outras plataformas)
      return {
        access_token: authResponse.access_token, // ← Token no body
        token_type: authResponse.token_type,
        expires_in: authResponse.expires_in,
        user: authResponse.user,
      };
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Realizar logout do usuário' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) reply: FastifyReply) {
    try {
      // Limpar o cookie
      reply.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return { message: 'Logout realizado com sucesso' };
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Verificar autenticação do usuário' })
  @ApiResponse({ status: 200, description: 'Token válido' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verify() {
    // Se chegou aqui, o guard validou o token do cookie
    return { authenticated: true };
  }

  @ApiOperation({ summary: 'Selecionar painel ativo' })
  @ApiResponse({ status: 200, description: 'Painel selecionado com sucesso' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @Post('select-panel')
  async selectPanel(
    @Body() selectPanelDto: SelectPanelDto,
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    try {
      const authResponse = await this.authService.selectPanel(
        user.sub,
        selectPanelDto.panelId,
        selectPanelDto.panelType,
      );

      reply.setCookie('access_token', authResponse.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: authResponse.expires_in * 1000,
        path: '/',
      });

      return {
        access_token: authResponse.access_token,
        token_type: authResponse.token_type,
        expires_in: authResponse.expires_in,
        user: authResponse.user,
      };
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: JwtPayload) {
    try {
      const profile = await this.authService.getAuthenticatedUserProfile(user.sub);
      const currentPanel =
        user.panelId && profile.panels
          ? profile.panels.find((panel) => panel.id === user.panelId) || null
          : null;

      return {
        ...profile,
        panelId: currentPanel?.id ?? profile.panelId ?? null,
        panelType: currentPanel?.type ?? profile.panelType ?? null,
      };
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
