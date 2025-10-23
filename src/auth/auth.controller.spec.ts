import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { ErrorResponse } from '../commom/response/errorResponse';
import { ErrorEnum } from '../commom/enum/error.enum';

// Imports dos mocks e fixtures
import {
  mockAuthService,
  clearAuthServiceMock,
} from './__mocks__/auth.service.mock';
import {
  mockJwtService,
} from './__mocks__/jwt.service.mock';
import {
  createMockFastifyReply,
} from './__mocks__/fastify-reply.mock';
import {
  mockLoginDto,
  mockAuthResponses,
  mockJwtTokens,
} from './__fixtures__/user.fixture';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let mockReply: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn().mockReturnValue(false),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    // Criar novo mock do reply para cada teste
    mockReply = createMockFastifyReply();

    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    clearAuthServiceMock();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    describe('Casos de Sucesso com Cookies', () => {
      it('deve definir cookie HttpOnly ao fazer login', async () => {
        // Arrange
        mockAuthService.login.mockResolvedValue(mockAuthResponses.base);

        // Act
        await controller.login(mockLoginDto.valid, mockReply);

        // Assert
        expect(mockReply.setCookie).toHaveBeenCalledWith(
          'access_token',
          mockJwtTokens.valid,
          expect.objectContaining({
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: mockAuthResponses.base.expires_in * 1000,
          }),
        );
      });

      it('deve retornar apenas dados do usuário (sem token)', async () => {
        // Arrange
        mockAuthService.login.mockResolvedValue(mockAuthResponses.base);

        // Act
        const result = await controller.login(mockLoginDto.valid, mockReply);

        // Assert
        expect(result).toEqual({
          user: mockAuthResponses.base.user,
          expires_in: mockAuthResponses.base.expires_in,
        });
        expect(result).not.toHaveProperty('access_token');
      });

      it('deve definir cookie com secure: true em produção', async () => {
        // Arrange
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        mockAuthService.login.mockResolvedValue(mockAuthResponses.base);

        // Act
        await controller.login(mockLoginDto.valid, mockReply);

        // Assert
        expect(mockReply.setCookie).toHaveBeenCalledWith(
          'access_token',
          mockJwtTokens.valid,
          expect.objectContaining({
            secure: true,
          }),
        );

        // Cleanup
        process.env.NODE_ENV = originalEnv;
      });

      it('deve definir cookie com secure: false em desenvolvimento', async () => {
        // Arrange
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        mockAuthService.login.mockResolvedValue(mockAuthResponses.base);

        // Act
        await controller.login(mockLoginDto.valid, mockReply);

        // Assert
        expect(mockReply.setCookie).toHaveBeenCalledWith(
          'access_token',
          mockJwtTokens.valid,
          expect.objectContaining({
            secure: false,
          }),
        );

        // Cleanup
        process.env.NODE_ENV = originalEnv;
      });

      it('deve chamar o serviço de autenticação', async () => {
        // Arrange
        mockAuthService.login.mockResolvedValue(mockAuthResponses.base);

        // Act
        await controller.login(mockLoginDto.valid, mockReply);

        // Assert
        expect(authService.login).toHaveBeenCalledWith(mockLoginDto.valid);
        expect(authService.login).toHaveBeenCalledTimes(1);
      });

      it('deve configurar maxAge do cookie baseado no expires_in', async () => {
        // Arrange
        const customResponse = {
          ...mockAuthResponses.base,
          expires_in: 3600, // 1 hora
        };
        mockAuthService.login.mockResolvedValue(customResponse);

        // Act
        await controller.login(mockLoginDto.valid, mockReply);

        // Assert
        expect(mockReply.setCookie).toHaveBeenCalledWith(
          'access_token',
          expect.any(String),
          expect.objectContaining({
            maxAge: 3600 * 1000, // 1 hora em milissegundos
          }),
        );
      });
    });

    describe('Casos de Erro', () => {
      it('deve retornar ErrorResponse quando usuário não for encontrado', async () => {
        // Arrange
        const errorResponse = new ErrorResponse({
          message: 'Usuário inválido.',
          statusCode: 400,
          errorsCode: ErrorEnum.NOT_FOUND,
        });
        mockAuthService.login.mockRejectedValue(errorResponse);

        // Act
        const result = await controller.login(mockLoginDto.invalidEmail, mockReply);

        // Assert
        expect(result).toBeInstanceOf(ErrorResponse);
        expect(mockReply.setCookie).not.toHaveBeenCalled();
      });

      it('deve retornar ErrorResponse quando senha estiver incorreta', async () => {
        // Arrange
        const errorResponse = new ErrorResponse({
          message: 'Usuário inválido.',
          statusCode: 400,
          errorsCode: ErrorEnum.INVALID_CREDENTIALS,
        });
        mockAuthService.login.mockRejectedValue(errorResponse);

        // Act
        const result = await controller.login(mockLoginDto.invalidPassword, mockReply);

        // Assert
        expect(result).toBeInstanceOf(ErrorResponse);
        expect(mockReply.setCookie).not.toHaveBeenCalled();
      });

      it('deve não definir cookie quando ocorrer erro', async () => {
        // Arrange
        const error = new Error('Erro inesperado');
        mockAuthService.login.mockRejectedValue(error);

        // Act
        await controller.login(mockLoginDto.valid, mockReply);

        // Assert
        expect(mockReply.setCookie).not.toHaveBeenCalled();
      });
    });
  });

  describe('logout', () => {
    it('deve limpar o cookie ao fazer logout', async () => {
      // Act
      await controller.logout(mockReply);

      // Assert
      expect(mockReply.clearCookie).toHaveBeenCalledWith(
        'access_token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        }),
      );
    });

    it('deve retornar mensagem de sucesso', async () => {
      // Act
      const result = await controller.logout(mockReply);

      // Assert
      expect(result).toEqual({
        message: 'Logout realizado com sucesso',
      });
    });

    it('deve limpar cookie com secure: true em produção', async () => {
      // Arrange
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Act
      await controller.logout(mockReply);

      // Assert
      expect(mockReply.clearCookie).toHaveBeenCalledWith(
        'access_token',
        expect.objectContaining({
          secure: true,
        }),
      );

      // Cleanup
      process.env.NODE_ENV = originalEnv;
    });

    it('deve limpar cookie mesmo se ocorrer erro', async () => {
      // Act
      const result = await controller.logout(mockReply);

      // Assert
      expect(mockReply.clearCookie).toHaveBeenCalled();
      expect(result).toHaveProperty('message');
    });
  });

  describe('verify', () => {
    it('deve retornar authenticated: true', async () => {
      // Act
      const result = await controller.verify();

      // Assert
      expect(result).toEqual({ authenticated: true });
    });
  });

  describe('getMe', () => {
    it('deve retornar dados do usuário do JWT', async () => {
      // Arrange
      const mockRequest = {
        user: {
          sub: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          role: 1,
          companyId: 'company-123',
          veterinaryClinicId: 'clinic-123',
        },
      };

      // Act
      const result = await controller.getMe(mockRequest);

      // Assert
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 1,
        companyId: 'company-123',
        veterinaryClinicId: 'clinic-123',
      });
    });

    it('deve retornar null para campos opcionais ausentes', async () => {
      // Arrange
      const mockRequest = {
        user: {
          sub: 'user-456',
          email: 'minimal@example.com',
          name: 'Minimal User',
          role: null,
        },
      };

      // Act
      const result = await controller.getMe(mockRequest);

      // Assert
      expect(result).toEqual({
        id: 'user-456',
        email: 'minimal@example.com',
        name: 'Minimal User',
        role: null,
        companyId: null,
        veterinaryClinicId: null,
      });
    });
  });
});
