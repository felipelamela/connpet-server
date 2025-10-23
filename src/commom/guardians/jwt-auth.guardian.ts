import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ErrorResponse } from '../response/errorResponse';
import { ErrorEnum } from '../enum/error.enum';
import { FastifyRequestWithUser } from '../Interfaces/fastify-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequestWithUser>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // Extrair token do cookie (prioridade) ou do header Authorization
    let token: string | undefined;

    // 1. Tentar obter do cookie (preferencial para autenticação web)
    if (request.cookies && request.cookies.access_token) {
      token = request.cookies.access_token;
      console.log('🍪 [JwtAuthGuard] Token encontrado no cookie');
    }

    // 2. Fallback: tentar obter do header Authorization (para APIs/mobile)
    if (!token) {
      const authHeader = request.headers['authorization'];
      if (authHeader) {
        const [bearer, headerToken] = authHeader.split(' ');
        if (bearer === 'Bearer' && headerToken) {
          token = headerToken;
          console.log('🔑 [JwtAuthGuard] Token encontrado no header Authorization');
        }
      }
    }

    // Validar se token foi encontrado
    if (!token) {
      console.error('❌ [JwtAuthGuard] Token não fornecido (nem cookie nem header)');
      throw new ErrorResponse({
        message: 'Token não fornecido',
        statusCode: 401,
        errorsCode: ErrorEnum.NOT_AUTHORIZED,
      });
    }

    // Verificar e validar o token
    try {
      // JwtService já está configurado com o secret correto no JwtModule.registerAsync
      const payload = this.jwtService.verify(token);
      (request as any).user = payload;
      console.log('✅ [JwtAuthGuard] Token válido para usuário:', payload.email);
      return true;
    } catch (err) {
      console.error('❌ [JwtAuthGuard] Token inválido ou expirado:', err.message);
      throw new ErrorResponse({
        message: 'Token inválido ou expirado',
        statusCode: 401,
        errorsCode: ErrorEnum.NOT_AUTHORIZED,
      });
    }
  }
}
