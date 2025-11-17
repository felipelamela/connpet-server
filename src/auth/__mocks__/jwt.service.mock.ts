/**
 * Mock do JwtService para Testes
 *
 * Este arquivo contém o mock do serviço JWT usado nos testes do módulo de autenticação.
 */

/**
 * Mock do JwtService com todos os métodos necessários
 */
export const mockJwtService = {
  sign: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
  verifyAsync: jest.fn(),
  decode: jest.fn(),
};

/**
 * Mock do ConfigService para configuração do JWT
 */
export const mockConfigService = {
  get: jest.fn(),
};

/**
 * Função helper para resetar o mock do JwtService
 */
export const resetJwtServiceMock = () => {
  Object.values(mockJwtService).forEach((fn) => {
    if (typeof fn === 'function' && 'mockReset' in fn) {
      fn.mockReset();
    }
  });
};

/**
 * Função helper para limpar o mock do JwtService
 */
export const clearJwtServiceMock = () => {
  Object.values(mockJwtService).forEach((fn) => {
    if (typeof fn === 'function' && 'mockClear' in fn) {
      fn.mockClear();
    }
  });
};

/**
 * Função helper para resetar o mock do ConfigService
 */
export const resetConfigServiceMock = () => {
  mockConfigService.get.mockReset();
};

/**
 * Função helper para limpar o mock do ConfigService
 */
export const clearConfigServiceMock = () => {
  mockConfigService.get.mockClear();
};

/**
 * Configurações pré-definidas de retorno para cenários comuns
 */
export const jwtServiceMockReturns = {
  /**
   * Configura o mock para gerar token com sucesso
   */
  signAsyncSuccess: (
    token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0ZUBleGVtcGxvLmNvbSIsIm5hbWUiOiJVc3XDoXJpbyBUZXN0ZSIsInJvbGUiOjEsInZldGVyaW5hcnlDbGluaWNJZCI6bnVsbCwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwODY0MDB9.signature',
  ) => {
    mockJwtService.signAsync.mockResolvedValue(token);
  },

  /**
   * Configura o mock para erro ao gerar token
   */
  signAsyncError: (error: Error) => {
    mockJwtService.signAsync.mockRejectedValue(error);
  },

  /**
   * Configura o mock para verificar token com sucesso
   */
  verifyAsyncSuccess: (payload: any) => {
    mockJwtService.verifyAsync.mockResolvedValue(payload);
  },

  /**
   * Configura o mock para erro ao verificar token
   */
  verifyAsyncError: (error: Error) => {
    mockJwtService.verifyAsync.mockRejectedValue(error);
  },

  /**
   * Configura o mock para decodificar token
   */
  decodeSuccess: (payload: any) => {
    mockJwtService.decode.mockReturnValue(payload);
  },
};

/**
 * Configurações do ConfigService
 */
export const configServiceMockReturns = {
  /**
   * Configura valores padrão do ConfigService
   */
  defaults: () => {
    mockConfigService.get.mockImplementation((key: string) => {
      const defaults: Record<string, string> = {
        JWT_SECRET: 'test-secret-key',
        JWT_EXPIRES_IN: '24h',
      };
      return defaults[key];
    });
  },

  /**
   * Configura expiração customizada
   */
  customExpiresIn: (expiresIn: string) => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'JWT_EXPIRES_IN') return expiresIn;
      if (key === 'JWT_SECRET') return 'test-secret-key';
      return undefined;
    });
  },
};

/**
 * Utilitário para configurar o mock do JwtService rapidamente
 */
export const setupJwtServiceMock = (config: {
  signAsync?: string | Error;
  verifyAsync?: any | Error;
}) => {
  if (config.signAsync !== undefined) {
    if (config.signAsync instanceof Error) {
      jwtServiceMockReturns.signAsyncError(config.signAsync);
    } else {
      jwtServiceMockReturns.signAsyncSuccess(config.signAsync);
    }
  }

  if (config.verifyAsync !== undefined) {
    if (config.verifyAsync instanceof Error) {
      jwtServiceMockReturns.verifyAsyncError(config.verifyAsync);
    } else {
      jwtServiceMockReturns.verifyAsyncSuccess(config.verifyAsync);
    }
  }
};
