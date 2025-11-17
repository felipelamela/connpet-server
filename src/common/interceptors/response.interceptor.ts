import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorResponse } from 'src/common/response/errorResponse';
import logger from 'src/common/logger/logger';
import { ErrorPresenter } from '../../common/response/error.presenter';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const reply = ctx.getResponse<FastifyReply>();

    return next.handle().pipe(
      map((data) => {
        if (!(data instanceof ErrorResponse)) {
          return data;
        }
        // Enviar erro completo para Grafana Loki
        // logger.error({
        //   // Informações do Erro
        //   message: data.message,
        //   errorCode: data.errorsCode,
        //   statusCode: data.statusCode,
        //   details: data.details,
        //   stack: data.stack,

        //   // Informações da Requisição
        //   path: request.url,
        //   method: request.method,
        //   query: request.query,
        //   params: request.params,

        //   // Informações do Cliente
        //   ip: request.ip,
        //   userAgent: request.headers['user-agent'],
        //   referer: request.headers['referer'],

        //   // Informações do Usuário (se autenticado)
        //   userId: (request as any).user?.sub || null,
        //   userEmail: (request as any).user?.email || null,
        //   companyId: (request as any).user?.companyId || null,

        // });

        reply.status(data.statusCode).send(new ErrorPresenter(data));
        return;
      }),
    );
  }
}
