import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { ErrorResponse } from 'src/commom/response/errorResponse';
import { Public } from '../commom/decorators/public.decorator';
import { JwtAuthGuard } from '../commom/guardians/jwt-auth.guardian';
import { CreateUserPanelDto } from './dto/create-user-panel.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
        httpOnly: true,        // Não acessível via JavaScript (XSS protection)
        secure: process.env.NODE_ENV === 'production', // HTTPS em produção
        sameSite: 'lax',       // Proteção contra CSRF
        maxAge: authResponse.expires_in * 1000, // Converte para milissegundos
        path: '/',             // Disponível em todo o site
      });

      // Retorna dados completos (incluindo token para mobile/outras plataformas)
      return {
        access_token: authResponse.access_token,  // ← Token no body
        token_type: authResponse.token_type,
        expires_in: authResponse.expires_in,
        user: authResponse.user,
      };
    } catch (error) {
      return new ErrorResponse(error);
    }
  }

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

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verify() {
    // Se chegou aqui, o guard validou o token do cookie
    return { authenticated: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() request: any) {
    // Retorna dados do usuário do JWT (extraído do cookie pelo guard)
    const user = request.user;
    
    return {
      id: user.sub,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId || null,
    };
  }


  @Post('create-new-system')
  async createUserSystem(@Body() createUserPanelDto: CreateUserPanelDto){
    try {
      const user = await this.authService.createUserSystem(createUserPanelDto);
      return user;
    } catch (error) {
      return new ErrorResponse(error);
    }
  }
}
