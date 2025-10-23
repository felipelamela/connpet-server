// EXEMPLO DE IMPLEMENTAÇÃO COM PROTEÇÃO DDoS
// Copie este código para seu auth.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { Public } from '../commom/decorators/public.decorator';
import {
  ThrottleStrict,
  ThrottleCustom,
} from '../commom/decorators/throttle.decorator';
import { BruteForceGuard } from '../commom/guards/brute-force.guard';
import { ErrorResponse } from '../commom/response/errorResponse';
import { ErrorEnum } from '../commom/enum/error.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly bruteForceGuard: BruteForceGuard,
  ) {}

  /**
   * LOGIN - Máxima Proteção
   * - Rate limit: 5 tentativas por minuto
   * - Brute force: Bloqueio após 5 falhas
   * - Tracking por IP + Email
   */
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ThrottleStrict() // 5 requisições por minuto
  @UseGuards(BruteForceGuard) // Proteção contra força bruta
  async login(@Body() loginDto: LoginAuthDto, @Req() request) {
    const ip = this.getClientIp(request);

    try {
      const result = await this.authService.login(loginDto);

      // Login bem-sucedido - limpar tentativas
      this.bruteForceGuard.clearAttempts(ip, loginDto.email);

      console.log(`✅ Login bem-sucedido: ${loginDto.email} (IP: ${ip})`);

      return result;
    } catch (error) {
      // Login falhou - registrar tentativa suspeita
      this.bruteForceGuard.registerSuspiciousActivity(ip);

      console.warn(
        `⚠️  Login falhou: ${loginDto.email} (IP: ${ip})`,
      );

      throw error;
    }
  }

  /**
   * REGISTRO - Proteção Média
   * - Rate limit: 5 tentativas por minuto
   * - Previne criação em massa de contas
   */
  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ThrottleStrict() // 5 requisições por minuto
  async register(@Body() registerDto: any, @Req() request) {
    const ip = this.getClientIp(request);

    console.log(`📝 Novo registro: ${registerDto.email} (IP: ${ip})`);

    // Exemplo de uso (adaptar conforme seu AuthService)
    // return this.authService.register(registerDto);
    
    throw new ErrorResponse({
      message: 'Método não implementado - use seu authService.register()',
      statusCode: 501,
      errorsCode: ErrorEnum.CREATE_ERROR,
    });
  }

  /**
   * RECUPERAR SENHA - Proteção Contra Spam
   * - Rate limit: 3 tentativas a cada 5 minutos
   * - Previne spam de emails
   */
  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ThrottleCustom(3, 300) // 3 requisições a cada 5 minutos
  async forgotPassword(
    @Body('email') email: string,
    @Req() request,
  ) {
    const ip = this.getClientIp(request);

    console.log(`🔑 Recuperação de senha: ${email} (IP: ${ip})`);

    // Exemplo de uso (adaptar conforme seu AuthService)
    // return this.authService.forgotPassword(email);
    
    throw new ErrorResponse({
      message: 'Método não implementado - use seu authService.forgotPassword()',
      statusCode: 501,
      errorsCode: ErrorEnum.CREATE_ERROR,
    });
  }

  /**
   * REFRESH TOKEN - Proteção Normal
   * - Rate limit: 30 requisições por minuto
   */
  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ThrottleCustom(30, 60) // 30 requisições por minuto
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    // Exemplo de uso (adaptar conforme seu AuthService)
    // return this.authService.refreshToken(refreshToken);
    
    throw new ErrorResponse({
      message: 'Método não implementado - use seu authService.refreshToken()',
      statusCode: 501,
      errorsCode: ErrorEnum.CREATE_ERROR,
    });
  }

  /**
   * VERIFICAR EMAIL - Proteção Média
   * - Rate limit: 10 requisições por minuto
   */
  @Get('verify-email/:token')
  @Public()
  @ThrottleCustom(10, 60)
  async verifyEmail(@Param('token') token: string) {
    // Exemplo de uso (adaptar conforme seu AuthService)
    // return this.authService.verifyEmail(token);
    
    throw new ErrorResponse({
      message: 'Método não implementado - use seu authService.verifyEmail()',
      statusCode: 501,
      errorsCode: ErrorEnum.CREATE_ERROR,
    });
  }

  /**
   * LOGOUT - Sem rate limit (operação segura)
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request) {
    // Logout é operação segura, não precisa de throttling agressivo
    return { message: 'Logout realizado com sucesso' };
  }

  // Método auxiliar para obter IP do cliente
  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.headers['x-real-ip'] ||
      request.ip ||
      request.connection?.remoteAddress ||
      'unknown'
    );
  }
}

