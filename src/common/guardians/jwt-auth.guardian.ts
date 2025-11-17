import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ErrorResponse } from '../response/errorResponse';
import { ErrorEnum } from '../enum/error.enum';
import { FastifyRequestWithUser } from '../Interfaces/fastify-request.interface';
import { JwtPayload } from 'src/auth/entities/jwt-payload.entity';

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

    let token: string | undefined;

    if (request.cookies && request.cookies.access_token) {
      token = request.cookies.access_token;
    }

    if (!token) {
      throw new ErrorResponse({
        message: 'Token não fornecido',
        statusCode: 401,
        errorsCode: ErrorEnum.NOT_AUTHORIZED,
      });
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      (request as any).user = payload;
      return true;
    } catch (err) {
      throw new ErrorResponse({
        message: 'Token inválido ou expirado',
        statusCode: 401,
        errorsCode: ErrorEnum.NOT_AUTHORIZED,
      });
    }
  }
}
