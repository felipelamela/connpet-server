import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FastifyRequest, FastifyReply } from 'fastify';
import { MetricsService } from '../../common/services/metrics.service';
import { ErrorResponse } from '../../common/response/errorResponse';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();
    const start = Date.now();

    // Extrair informações da requisição
    const method = request.method;
    const route = this.normalizeRoute(request.url);
    const companyId = (request as any).user?.companyId || 'anonymous';

    // Incrementar requisições em andamento
    this.metricsService.httpRequestsInProgress.labels(method, route).inc();

    // Registrar tamanho da requisição
    const requestSize = this.getRequestSize(request);
    if (requestSize > 0) {
      this.metricsService.httpRequestSize
        .labels(method, route)
        .observe(requestSize);
    }

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - start;
        const statusCode = this.getStatusCode(response, data);

        // Decrementar requisições em andamento
        this.metricsService.httpRequestsInProgress.labels(method, route).dec();

        // Registrar duração da requisição
        this.metricsService.httpRequestDuration
          .labels(method, route, statusCode.toString(), companyId)
          .observe(duration);

        // Incrementar total de requisições
        this.metricsService.httpRequestsTotal
          .labels(method, route, statusCode.toString(), companyId)
          .inc();

        // Registrar tamanho da resposta
        const responseSize = this.getResponseSize(data);
        if (responseSize > 0) {
          this.metricsService.httpResponseSize
            .labels(method, route, statusCode.toString())
            .observe(responseSize);
        }

        // Registrar erros
        if (data instanceof ErrorResponse || statusCode >= 400) {
          this.registerError(data, method, route, statusCode, companyId);
        }

        // Métricas específicas de autenticação
        if (route.includes('/auth/login')) {
          this.registerLoginMetrics(data, statusCode, request.ip, companyId);
        }
      }),
      catchError((error) => {
        const duration = Date.now() - start;
        const statusCode = error.statusCode || 500;

        // Decrementar requisições em andamento
        this.metricsService.httpRequestsInProgress.labels(method, route).dec();

        // Registrar erro
        this.metricsService.httpRequestDuration
          .labels(method, route, statusCode.toString(), companyId)
          .observe(duration);

        this.metricsService.httpRequestsTotal
          .labels(method, route, statusCode.toString(), companyId)
          .inc();

        this.registerError(error, method, route, statusCode, companyId);

        throw error;
      }),
    );
  }

  /**
   * Normaliza a rota removendo IDs dinâmicos
   */
  private normalizeRoute(url: string): string {
    // Remove query params
    const path = url.split('?')[0];

    // Substitui UUIDs e IDs por :id
    return path
      .replace(
        /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        '/:id',
      )
      .replace(/\/\d+/g, '/:id');
  }

  /**
   * Obtém o status code da resposta
   */
  private getStatusCode(response: FastifyReply, data: any): number {
    if (data instanceof ErrorResponse) {
      return data.statusCode;
    }
    return response.statusCode || 200;
  }

  /**
   * Calcula o tamanho da requisição
   */
  private getRequestSize(request: FastifyRequest): number {
    const contentLength = request.headers['content-length'];
    if (contentLength) {
      return parseInt(contentLength, 10);
    }
    if (request.body) {
      return JSON.stringify(request.body).length;
    }
    return 0;
  }

  /**
   * Calcula o tamanho da resposta
   */
  private getResponseSize(data: any): number {
    if (!data) return 0;
    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }

  /**
   * Registra métricas de erro
   */
  private registerError(
    error: any,
    method: string,
    route: string,
    statusCode: number,
    companyId: string,
  ): void {
    const errorCode = error?.errorsCode || 'UNKNOWN';

    this.metricsService.errorsTotal
      .labels(errorCode, statusCode.toString(), route, method, companyId)
      .inc();

    this.metricsService.errorsByStatusCode
      .labels(statusCode.toString(), route)
      .inc();
  }

  /**
   * Registra métricas específicas de login
   */
  private registerLoginMetrics(
    data: any,
    statusCode: number,
    ip: string,
    companyId: string,
  ): void {
    const result = statusCode === 200 ? 'success' : 'failure';

    // Total de tentativas
    this.metricsService.loginAttempts.labels(result, ip).inc();

    // Sucesso ou falha
    if (statusCode === 200) {
      this.metricsService.loginSuccess.labels(companyId).inc();
    } else {
      const errorCode = data?.errorsCode || 'UNKNOWN';
      this.metricsService.loginFailures.labels(errorCode, ip).inc();
    }
  }
}
