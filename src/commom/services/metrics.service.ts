import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

/**
 * Serviço de Métricas do Prometheus
 * 
 * Centraliza todas as métricas da aplicação
 */
@Injectable()
export class MetricsService {
  // Registro global do Prometheus
  public readonly register: client.Registry;

  // === Métricas de HTTP ===
  
  /**
   * Duração das requisições HTTP em milissegundos
   */
  public readonly httpRequestDuration: client.Histogram<string>;

  /**
   * Total de requisições HTTP
   */
  public readonly httpRequestsTotal: client.Counter<string>;

  /**
   * Requisições em andamento
   */
  public readonly httpRequestsInProgress: client.Gauge<string>;

  /**
   * Tamanho das requisições em bytes
   */
  public readonly httpRequestSize: client.Histogram<string>;

  /**
   * Tamanho das respostas em bytes
   */
  public readonly httpResponseSize: client.Histogram<string>;

  // === Métricas de Erro ===
  
  /**
   * Total de erros por tipo
   */
  public readonly errorsTotal: client.Counter<string>;

  /**
   * Erros por status code
   */
  public readonly errorsByStatusCode: client.Counter<string>;

  // === Métricas de Autenticação ===
  
  /**
   * Tentativas de login
   */
  public readonly loginAttempts: client.Counter<string>;

  /**
   * Logins bem-sucedidos
   */
  public readonly loginSuccess: client.Counter<string>;

  /**
   * Falhas de login
   */
  public readonly loginFailures: client.Counter<string>;

  /**
   * Tokens ativos
   */
  public readonly activeTokens: client.Gauge<string>;

  // === Métricas de Banco de Dados ===
  
  /**
   * Queries do banco de dados
   */
  public readonly dbQueriesTotal: client.Counter<string>;

  /**
   * Duração das queries
   */
  public readonly dbQueryDuration: client.Histogram<string>;

  /**
   * Conexões ativas do banco
   */
  public readonly dbConnectionsActive: client.Gauge<string>;

  // === Métricas de Negócio ===
  
  /**
   * Total de pets cadastrados
   */
  public readonly petsTotal: client.Gauge<string>;

  /**
   * Total de appointments
   */
  public readonly appointmentsTotal: client.Gauge<string>;

  /**
   * Total de companies ativas
   */
  public readonly companiesActive: client.Gauge<string>;

  constructor() {
    // Criar registro customizado
    this.register = new client.Registry();

    // Configurar métricas padrão do Node.js
    client.collectDefaultMetrics({
      register: this.register,
      prefix: 'connpet_',
    });

    // === Inicializar Métricas de HTTP ===

    this.httpRequestDuration = new client.Histogram({
      name: 'connpet_http_request_duration_ms',
      help: 'Duração das requisições HTTP em milissegundos',
      labelNames: ['method', 'route', 'status_code', 'company_id'],
      buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2000, 5000],
      registers: [this.register],
    });

    this.httpRequestsTotal = new client.Counter({
      name: 'connpet_http_requests_total',
      help: 'Total de requisições HTTP',
      labelNames: ['method', 'route', 'status_code', 'company_id'],
      registers: [this.register],
    });

    this.httpRequestsInProgress = new client.Gauge({
      name: 'connpet_http_requests_in_progress',
      help: 'Requisições HTTP em andamento',
      labelNames: ['method', 'route'],
      registers: [this.register],
    });

    this.httpRequestSize = new client.Histogram({
      name: 'connpet_http_request_size_bytes',
      help: 'Tamanho das requisições em bytes',
      labelNames: ['method', 'route'],
      buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
      registers: [this.register],
    });

    this.httpResponseSize = new client.Histogram({
      name: 'connpet_http_response_size_bytes',
      help: 'Tamanho das respostas em bytes',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
      registers: [this.register],
    });

    // === Métricas de Erro ===

    this.errorsTotal = new client.Counter({
      name: 'connpet_errors_total',
      help: 'Total de erros por tipo',
      labelNames: ['error_code', 'status_code', 'route', 'method', 'company_id'],
      registers: [this.register],
    });

    this.errorsByStatusCode = new client.Counter({
      name: 'connpet_errors_by_status_code',
      help: 'Erros por status code',
      labelNames: ['status_code', 'route'],
      registers: [this.register],
    });

    // === Métricas de Autenticação ===

    this.loginAttempts = new client.Counter({
      name: 'connpet_login_attempts_total',
      help: 'Tentativas de login',
      labelNames: ['result', 'ip'],
      registers: [this.register],
    });

    this.loginSuccess = new client.Counter({
      name: 'connpet_login_success_total',
      help: 'Logins bem-sucedidos',
      labelNames: ['company_id'],
      registers: [this.register],
    });

    this.loginFailures = new client.Counter({
      name: 'connpet_login_failures_total',
      help: 'Falhas de login',
      labelNames: ['error_code', 'ip'],
      registers: [this.register],
    });

    this.activeTokens = new client.Gauge({
      name: 'connpet_active_tokens',
      help: 'Tokens JWT ativos',
      labelNames: ['company_id'],
      registers: [this.register],
    });

    // === Métricas de Banco de Dados ===

    this.dbQueriesTotal = new client.Counter({
      name: 'connpet_db_queries_total',
      help: 'Total de queries do banco',
      labelNames: ['operation', 'table'],
      registers: [this.register],
    });

    this.dbQueryDuration = new client.Histogram({
      name: 'connpet_db_query_duration_ms',
      help: 'Duração das queries em milissegundos',
      labelNames: ['operation', 'table'],
      buckets: [0.1, 1, 5, 10, 50, 100, 500, 1000, 5000],
      registers: [this.register],
    });

    this.dbConnectionsActive = new client.Gauge({
      name: 'connpet_db_connections_active',
      help: 'Conexões ativas do banco de dados',
      registers: [this.register],
    });

    // === Métricas de Negócio ===

    this.petsTotal = new client.Gauge({
      name: 'connpet_pets_total',
      help: 'Total de pets cadastrados',
      labelNames: ['company_id', 'species'],
      registers: [this.register],
    });

    this.appointmentsTotal = new client.Gauge({
      name: 'connpet_appointments_total',
      help: 'Total de agendamentos',
      labelNames: ['company_id', 'status'],
      registers: [this.register],
    });

    this.companiesActive = new client.Gauge({
      name: 'connpet_companies_active',
      help: 'Total de clínicas ativas',
      registers: [this.register],
    });
  }

  /**
   * Obter todas as métricas em formato Prometheus
   */
  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  /**
   * Limpar todas as métricas (útil para testes)
   */
  clearMetrics(): void {
    this.register.clear();
  }
}

