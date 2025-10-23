import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../logger/logger';
import { ErrorResponse } from '../response/errorResponse';
import { ErrorEnum } from '../enum/error.enum';
import { ErrorPresenter } from '../response/error.presenter';

/**
 * Filtro global para capturar todas as exceções não tratadas
 * e enviá-las para o Grafana Loki
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status: number;
    let message: string;
    let errorCode: string;
    let details: any;

    // Determinar tipo de exceção
    if (exception instanceof ErrorResponse) {
      // Já é um ErrorResponse - usar os dados dele
      status = exception.statusCode;
      message = exception.message;
      errorCode = exception.errorsCode;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      // Exceção HTTP do NestJS
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message || 'Erro no servidor';
      errorCode = ErrorEnum.CREATE_ERROR;
      details = exceptionResponse;
    } else if (exception instanceof Error) {
      // Erro genérico do JavaScript
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Erro interno do servidor';
      errorCode = ErrorEnum.CREATE_ERROR;
      details = {
        name: exception.name,
        stack: exception.stack,
      };
    } else {
      // Exceção desconhecida
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erro inesperado no servidor';
      errorCode = ErrorEnum.CREATE_ERROR;
      details = exception;
    }

    // Enviar erro para Grafana Loki com informações completas
    // logger.error({
    //   message,
    //   errorCode,
    //   statusCode: status,
    //   details: JSON.stringify(details || {}),
    //   stack: (exception instanceof Error ? exception.stack?.toString() : '') || '',
    //   path: request.url,
    //   method: request.method,
    //   query: JSON.stringify(request.query || {}),
    //   params: JSON.stringify(request.params || {}),
    //   ip: request.ip,
    //   userAgent: request.headers['user-agent'],
    //   referer: request.headers['referer'],
    //   userId: (request as any).user?.sub || null,
    //   userEmail: (request as any).user?.email || null,
    //   companyId: (request as any).user?.companyId || null,
    //   timestamp: new Date().toISOString(),
    // });
    

    // Retornar resposta padronizada
    const errorResponse = new ErrorPresenter({
      message,
      statusCode: status,
      errorsCode: errorCode,
      details,
    } as ErrorResponse);

    response.status(status).send(errorResponse);
  }

  /**
   * Determina a severidade do erro baseado no status code
   */
  private getSeverity(statusCode: number): string {
    if (statusCode >= 500) return 'critical';
    if (statusCode >= 400) return 'error';
    if (statusCode >= 300) return 'warning';
    return 'info';
  }
}

