/**
 * Mock do FastifyReply para Testes
 * 
 * Este arquivo contém o mock do FastifyReply usado nos testes do módulo de autenticação.
 */

/**
 * Mock do FastifyReply com métodos de cookie
 */
export const mockFastifyReply = {
  setCookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  code: jest.fn().mockReturnThis(),
  header: jest.fn().mockReturnThis(),
};

/**
 * Função helper para resetar o mock do FastifyReply
 */
export const resetFastifyReplyMock = () => {
  Object.values(mockFastifyReply).forEach((fn) => {
    if (typeof fn === 'function' && 'mockReset' in fn) {
      (fn as jest.Mock).mockReset();
      if (fn !== mockFastifyReply.setCookie && fn !== mockFastifyReply.clearCookie) {
        (fn as jest.Mock).mockReturnThis();
      }
    }
  });
};

/**
 * Função helper para limpar o mock do FastifyReply
 */
export const clearFastifyReplyMock = () => {
  Object.values(mockFastifyReply).forEach((fn) => {
    if (typeof fn === 'function' && 'mockClear' in fn) {
      (fn as jest.Mock).mockClear();
    }
  });
};

/**
 * Factory para criar uma instância mock do FastifyReply
 */
export const createMockFastifyReply = () => ({
  setCookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  code: jest.fn().mockReturnThis(),
  header: jest.fn().mockReturnThis(),
});

