export const mockUserBase = {
  id: '1',
  name: 'Usuário Teste',
  email: 'teste@exemplo.com',
  password: '$2b$10$hashedpassword',
  role: 1,
  veterinaryClinicId: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockUserWithProfiles = {
  ...mockUserBase,
  UserProfileEmployee: [
    {
      id: '1',
      employeeId: 'emp1',
      userId: '1',
      veterinaryClinicId: 'clinic1',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  ],
  UserProfileTutor: [
    {
      id: '2',
      tutorId: 'tut1',
      userId: '1',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  ],
};

export const mockUserWithoutProfiles = {
  ...mockUserBase,
  UserProfileEmployee: [],
  UserProfileTutor: [],
};

export const mockUserWithMultipleProfiles = {
  ...mockUserBase,
  UserProfileEmployee: [
    {
      id: '1',
      employeeId: 'emp1',
      userId: '1',
      veterinaryClinicId: 'clinic1',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
    {
      id: '2',
      employeeId: 'emp2',
      userId: '1',
      veterinaryClinicId: 'clinic2',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  ],
  UserProfileTutor: [
    {
      id: '3',
      tutorId: 'tut1',
      userId: '1',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
    {
      id: '4',
      tutorId: 'tut2',
      userId: '1',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  ],
};

export const mockUserWithDifferentRole = {
  ...mockUserBase,
  id: '2',
  name: 'Usuário Admin',
  email: 'admin@exemplo.com',
  role: 2,
  UserProfileEmployee: [],
  UserProfileTutor: [],
};

export const mockUsers = {
  base: mockUserBase,
  withProfiles: mockUserWithProfiles,
  withoutProfiles: mockUserWithoutProfiles,
  withMultipleProfiles: mockUserWithMultipleProfiles,
  differentRole: mockUserWithDifferentRole,
};

export const createMockUser = (overrides?: Partial<typeof mockUserBase>) => ({
  ...mockUserBase,
  ...overrides,
  UserProfileEmployee: [],
  UserProfileTutor: [],
});

export const mockLoginDto = {
  valid: {
    email: 'teste@exemplo.com',
    password: 'senha123',
  },
  invalidEmail: {
    email: 'invalido@exemplo.com',
    password: 'senha123',
  },
  invalidPassword: {
    email: 'teste@exemplo.com',
    password: 'senhaErrada',
  },
  withUpperCase: {
    email: 'TESTE@EXEMPLO.COM',
    password: 'senha123',
  },
  withSpecialChars: {
    email: 'teste@exemplo.com',
    password: 'Senh@Especial!123#$%',
  },
  different: {
    email: 'outro@teste.com',
    password: 'outraSenha456',
  },
};

export const validEmails = [
  'user@example.com',
  'test.user@example.com',
  'user+tag@example.co.uk',
  'usuario.teste@dominio.com.br',
];

export const testPasswords = {
  short: 'short',
  medium: 'medium123',
  long: 'longPasswordWith123AndSpecial!@#',
  withSpecialChars: 'P@ssw0rd!#$',
  onlyNumbers: '12345678',
  onlyLetters: 'abcdefgh',
};

/**
 * Tokens JWT para testes
 */
export const mockJwtTokens = {
  valid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0ZUBleGVtcGxvLmNvbSIsIm5hbWUiOiJVc3XDoXJpbyBUZXN0ZSIsInJvbGUiOjEsInZldGVyaW5hcnlDbGluaWNJZCI6bnVsbCwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwODY0MDB9.signature',
  expired: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0ZUBleGVtcGxvLmNvbSIsIm5hbWUiOiJVc3XDoXJpbyBUZXN0ZSIsInJvbGUiOjEsInZldGVyaW5hcnlDbGluaWNJZCI6bnVsbCwiaWF0IjoxNTAwMDAwMDAwLCJleHAiOjE1MDAwODY0MDB9.signature',
  invalid: 'invalid.token.here',
  differentUser: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZW1haWwiOiJhZG1pbkBleGVtcGxvLmNvbSIsIm5hbWUiOiJVc3XDoXJpbyBBZG1pbiIsInJvbGUiOjIsInZldGVyaW5hcnlDbGluaWNJZCI6bnVsbCwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwODY0MDB9.signature',
};

/**
 * Respostas de autenticação com JWT para testes
 */
export const mockAuthResponses = {
  base: {
    access_token: mockJwtTokens.valid,
    token_type: 'Bearer',
    expires_in: 86400,
    user: {
      id: mockUserBase.id,
      name: mockUserBase.name,
      email: mockUserBase.email,
      role: mockUserBase.role,
      veterinaryClinicId: mockUserBase.veterinaryClinicId,
    },
  },
  differentRole: {
    access_token: mockJwtTokens.differentUser,
    token_type: 'Bearer',
    expires_in: 86400,
    user: {
      id: mockUserWithDifferentRole.id,
      name: mockUserWithDifferentRole.name,
      email: mockUserWithDifferentRole.email,
      role: mockUserWithDifferentRole.role,
      veterinaryClinicId: mockUserWithDifferentRole.veterinaryClinicId,
    },
  },
  shortExpiration: {
    access_token: mockJwtTokens.valid,
    token_type: 'Bearer',
    expires_in: 3600, // 1 hora
    user: {
      id: mockUserBase.id,
      name: mockUserBase.name,
      email: mockUserBase.email,
      role: mockUserBase.role,
      veterinaryClinicId: mockUserBase.veterinaryClinicId,
    },
  },
};

export const mockJwtPayloads = {
  base: {
    sub: mockUserBase.id,
    email: mockUserBase.email,
    name: mockUserBase.name,
    role: mockUserBase.role,
    veterinaryClinicId: mockUserBase.veterinaryClinicId,
  },
  differentRole: {
    sub: mockUserWithDifferentRole.id,
    email: mockUserWithDifferentRole.email,
    name: mockUserWithDifferentRole.name,
    role: mockUserWithDifferentRole.role,
    veterinaryClinicId: mockUserWithDifferentRole.veterinaryClinicId,
  },
};

