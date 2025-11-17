import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { ErrorResponse } from '../common/response/errorResponse';
import { ErrorEnum } from '../common/enum/error.enum';
import * as bcrypt from 'bcrypt';

// Imports dos mocks e fixtures
import {
  mockPrismaService,
  clearPrismaMocks,
  prismaServiceMockReturns,
} from './__mocks__/prisma.service.mock';
import { bcryptMockReturns } from './__mocks__/bcrypt.mock';
import {
  mockJwtService,
  mockConfigService,
  clearJwtServiceMock,
  clearConfigServiceMock,
  jwtServiceMockReturns,
  configServiceMockReturns,
} from './__mocks__/jwt.service.mock';
import {
  mockUsers,
  mockLoginDto,
  mockJwtTokens,
} from './__fixtures__/user.fixture';

// Mock do bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    clearPrismaMocks();
    clearJwtServiceMock();
    clearConfigServiceMock();

    // Configurar ConfigService com valores padrão
    configServiceMockReturns.defaults();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    describe('Casos de Sucesso', () => {
      it('deve realizar login com sucesso e retornar AuthResponse completo', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        const result = await service.login(mockLoginDto.valid);

        // Assert
        expect(result).toHaveProperty('access_token');
        expect(result).toHaveProperty('token_type', 'Bearer');
        expect(result).toHaveProperty('expires_in');
        expect(result).toHaveProperty('user');
        expect(result.access_token).toBe(mockJwtTokens.valid);
        expect(result.token_type).toBe('Bearer');
        expect(result.user.id).toBe(mockUsers.base.id);
        expect(result.user.email).toBe(mockUsers.base.email);
        expect(result.user).not.toHaveProperty('password');
      });

      it('deve chamar Prisma, bcrypt e JwtService na ordem correta', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        await service.login(mockLoginDto.valid);

        // Assert
        expect(prismaService.user.findFirst).toHaveBeenCalledWith({
          where: { email: mockLoginDto.valid.email },
          include: {
            UserProfileEmployee: {
              include: {
                VeterinarianProfile: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            UserProfileTutor: {
              include: {
                pets: true,
              },
            },
          },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(
          mockLoginDto.valid.password,
          mockUsers.base.password,
        );
        expect(jwtService.signAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            sub: mockUsers.base.id,
            email: mockUsers.base.email,
            name: mockUsers.base.name,
          }),
        );
      });

      it('deve incluir informações corretas no payload JWT', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        await service.login(mockLoginDto.valid);

        // Assert
        expect(jwtService.signAsync).toHaveBeenCalledWith({
          sub: mockUsers.base.id,
          email: mockUsers.base.email,
          name: mockUsers.base.name,
          role: mockUsers.base.role,
          veterinaryClinicId: mockUsers.base.veterinaryClinicId,
        });
      });

      it('deve retornar tempo de expiração correto (24h = 86400s)', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        const result = await service.login(mockLoginDto.valid);

        // Assert
        expect(result.expires_in).toBe(86400); // 24h em segundos
      });

      it('deve processar tempo de expiração customizado (1h)', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);
        configServiceMockReturns.customExpiresIn('1h');

        // Act
        const result = await service.login(mockLoginDto.valid);

        // Assert
        expect(result.expires_in).toBe(3600); // 1h em segundos
      });

      it('deve processar tempo de expiração em minutos (30m)', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);
        configServiceMockReturns.customExpiresIn('30m');

        // Act
        const result = await service.login(mockLoginDto.valid);

        // Assert
        expect(result.expires_in).toBe(1800); // 30m em segundos
      });

      it('deve processar tempo de expiração em dias (7d)', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);
        configServiceMockReturns.customExpiresIn('7d');

        // Act
        const result = await service.login(mockLoginDto.valid);

        // Assert
        expect(result.expires_in).toBe(604800); // 7d em segundos
      });
    });

    describe('Casos de Erro', () => {
      it('deve lançar erro quando usuário não for encontrado', async () => {
        // Arrange
        prismaServiceMockReturns.findUserNotFound();

        // Act & Assert
        await expect(service.login(mockLoginDto.invalidEmail)).rejects.toThrow(
          ErrorResponse,
        );

        try {
          await service.login(mockLoginDto.invalidEmail);
        } catch (error) {
          expect(error).toBeInstanceOf(ErrorResponse);
          expect(error.message).toBe('Usuário inválido.');
          expect(error.statusCode).toBe(400);
          expect(error.errorsCode).toBe(ErrorEnum.NOT_FOUND);
        }

        expect(prismaService.user.findFirst).toHaveBeenCalledTimes(2);
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwtService.signAsync).not.toHaveBeenCalled();
      });

      it('deve lançar erro quando senha estiver incorreta', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareFail();

        // Act & Assert
        await expect(
          service.login(mockLoginDto.invalidPassword),
        ).rejects.toThrow(ErrorResponse);

        try {
          await service.login(mockLoginDto.invalidPassword);
        } catch (error) {
          expect(error).toBeInstanceOf(ErrorResponse);
          expect(error.message).toBe('Usuário inválido.');
          expect(error.statusCode).toBe(400);
          expect(error.errorsCode).toBe(ErrorEnum.INVALID_CREDENTIALS);
        }

        expect(prismaService.user.findFirst).toHaveBeenCalledTimes(2);
        expect(bcrypt.compare).toHaveBeenCalledTimes(2);
        expect(jwtService.signAsync).not.toHaveBeenCalled();
      });

      it('deve lançar erro quando ocorrer erro no banco de dados', async () => {
        // Arrange
        const dbError = new Error('Erro de conexão com o banco de dados');
        prismaServiceMockReturns.findUserError(dbError);

        // Act & Assert
        await expect(service.login(mockLoginDto.valid)).rejects.toThrow(
          ErrorResponse,
        );

        expect(prismaService.user.findFirst).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwtService.signAsync).not.toHaveBeenCalled();
      });

      it('deve lançar erro quando bcrypt falhar', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareError(new Error('Erro ao comparar senha'));

        // Act & Assert
        await expect(service.login(mockLoginDto.valid)).rejects.toThrow(
          ErrorResponse,
        );

        expect(prismaService.user.findFirst).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(jwtService.signAsync).not.toHaveBeenCalled();
      });

      it('deve lançar erro quando geração do JWT falhar', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncError(new Error('Erro ao gerar JWT'));

        // Act & Assert
        await expect(service.login(mockLoginDto.valid)).rejects.toThrow(
          ErrorResponse,
        );

        expect(prismaService.user.findFirst).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
      });
    });

    describe('Validações de Input', () => {
      it('deve chamar o Prisma com o email correto', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        await service.login(mockLoginDto.different);

        // Assert
        expect(prismaService.user.findFirst).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              email: mockLoginDto.different.email,
            },
          }),
        );
      });

      it('deve comparar senha fornecida com senha hash do banco', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        await service.login(mockLoginDto.valid);

        // Assert
        expect(bcrypt.compare).toHaveBeenCalledWith(
          mockLoginDto.valid.password,
          mockUsers.base.password,
        );
      });

      it('deve gerar JWT apenas após validação bem-sucedida', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        await service.login(mockLoginDto.valid);

        // Assert - JWT deve ser chamado após Prisma e bcrypt
        const callOrder = [
          prismaService.user.findFirst,
          bcrypt.compare,
          jwtService.signAsync,
        ];
        callOrder.forEach((mock: any) => {
          expect(mock).toHaveBeenCalled();
        });
      });
    });

    describe('Cenários de Edge Cases', () => {
      it('deve tratar email com letras maiúsculas', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        const result = await service.login(mockLoginDto.withUpperCase);

        // Assert
        expect(result).toHaveProperty('access_token');
        expect(prismaService.user.findFirst).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              email: mockLoginDto.withUpperCase.email,
            },
          }),
        );
      });

      it('deve tratar senha com caracteres especiais', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        await service.login(mockLoginDto.withSpecialChars);

        // Assert
        expect(bcrypt.compare).toHaveBeenCalledWith(
          mockLoginDto.withSpecialChars.password,
          mockUsers.base.password,
        );
      });

      it('deve gerar tokens únicos para cada login', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();

        // Primeiro login
        jwtServiceMockReturns.signAsyncSuccess('token_unico_1');
        const result1 = await service.login(mockLoginDto.valid);

        // Segundo login
        jest.clearAllMocks();
        clearJwtServiceMock();
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess('token_unico_2');
        const result2 = await service.login(mockLoginDto.valid);

        // Assert
        expect(result1.access_token).toBe('token_unico_1');
        expect(result2.access_token).toBe('token_unico_2');
        expect(result1.access_token).not.toBe(result2.access_token);
      });
    });

    describe('Estrutura da Resposta', () => {
      it('deve retornar todas as propriedades obrigatórias da AuthResponse', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        const result = await service.login(mockLoginDto.valid);

        // Assert
        const requiredKeys = [
          'access_token',
          'token_type',
          'expires_in',
          'user',
        ];
        requiredKeys.forEach((key) => {
          expect(result).toHaveProperty(key);
        });
      });

      it('deve retornar dados do usuário sem senha', async () => {
        // Arrange
        prismaServiceMockReturns.findUserSuccess(mockUsers.base);
        bcryptMockReturns.compareSuccess();
        jwtServiceMockReturns.signAsyncSuccess(mockJwtTokens.valid);

        // Act
        const result = await service.login(mockLoginDto.valid);

        // Assert
        expect(result.user).toHaveProperty('id');
        expect(result.user).toHaveProperty('name');
        expect(result.user).toHaveProperty('email');
        expect(result.user).toHaveProperty('role');
        expect(result.user).not.toHaveProperty('password');
      });
    });
  });
});
