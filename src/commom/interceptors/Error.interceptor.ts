import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FastifyReply } from 'fastify';
import { ErrorResponse } from 'src/response/errorResponse';
import logger from 'src/commom/logger/logger';

@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    return next.handle().pipe(
      tap((data) => {
        if (data instanceof ErrorResponse) {
          reply.status(data.statusCode);

          logger.error({
            message: data.message,
            errors: data.errors,
            statusCode: data.statusCode,
            path: ctx.getRequest().url,
            method: ctx.getRequest().method,
          });
        }




      }),
    );
  }
}