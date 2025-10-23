export const mockPrismaService = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userProfileEmployee: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userProfileTutor: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn(),
};

export const resetPrismaMocks = () => {
  Object.values(mockPrismaService.user).forEach((fn) => {
    if (typeof fn === 'function' && 'mockReset' in fn) {
      (fn as jest.Mock).mockReset();
    }
  });
  Object.values(mockPrismaService.userProfileEmployee).forEach((fn) => {
    if (typeof fn === 'function' && 'mockReset' in fn) {
      (fn as jest.Mock).mockReset();
    }
  });
  Object.values(mockPrismaService.userProfileTutor).forEach((fn) => {
    if (typeof fn === 'function' && 'mockReset' in fn) {
      (fn as jest.Mock).mockReset();
    }
  });
};

export const clearPrismaMocks = () => {
  Object.values(mockPrismaService.user).forEach((fn) => {
    if (typeof fn === 'function' && 'mockClear' in fn) {
      (fn as jest.Mock).mockClear();
    }
  });
  Object.values(mockPrismaService.userProfileEmployee).forEach((fn) => {
    if (typeof fn === 'function' && 'mockClear' in fn) {
      (fn as jest.Mock).mockClear();
    }
  });
  Object.values(mockPrismaService.userProfileTutor).forEach((fn) => {
    if (typeof fn === 'function' && 'mockClear' in fn) {
      (fn as jest.Mock).mockClear();
    }
  });
};

export const prismaServiceMockReturns = {
  findUserSuccess: (user: any) => {
    mockPrismaService.user.findFirst.mockResolvedValue(user);
  },

  findUserNotFound: () => {
    mockPrismaService.user.findFirst.mockResolvedValue(null);
  },

  findUserError: (error: Error) => {
    mockPrismaService.user.findFirst.mockRejectedValue(error);
  },

  createUserSuccess: (user: any) => {
    mockPrismaService.user.create.mockResolvedValue(user);
  },

  createUserError: (error: Error) => {
    mockPrismaService.user.create.mockRejectedValue(error);
  },
};

