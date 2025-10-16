import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyReply } from 'fastify';
import { ErrorResponse } from 'src/commom/response/errorResponse';
import logger from 'src/commom/logger/logger';
import { ErrorPresenter } from '../response/error.presenter';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    return next.handle().pipe(
      map((data) => {
        if (!(data instanceof ErrorResponse)) {
          return data;
        }
        logger.error({
          message: data.message,
          errors: data.errorsCode,
          details: data.details,
          statusCode: data.statusCode,
          path: ctx.getRequest().url,
          method: ctx.getRequest().method,
        });
        reply.status(data.statusCode).send(new ErrorPresenter(data));
        return;
      }),
    );
  }
}