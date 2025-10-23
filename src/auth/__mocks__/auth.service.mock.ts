export const mockAuthService = {
  login: jest.fn(),
};

export const resetAuthServiceMock = () => {
  Object.values(mockAuthService).forEach((fn) => {
    if (typeof fn === 'function' && 'mockReset' in fn) {
      (fn as jest.Mock).mockReset();
    }
  });
};

export const clearAuthServiceMock = () => {
  Object.values(mockAuthService).forEach((fn) => {
    if (typeof fn === 'function' && 'mockClear' in fn) {
      (fn as jest.Mock).mockClear();
    }
  });
};

export const authServiceMockReturns = {
  loginSuccess: (user: any) => {
    mockAuthService.login.mockResolvedValue(user);
  },
  loginUserNotFound: (error: Error) => {
    mockAuthService.login.mockRejectedValue(error);
  },

  loginInvalidPassword: (error: Error) => {
    mockAuthService.login.mockRejectedValue(error);
  },

  loginError: (error: Error) => {
    mockAuthService.login.mockRejectedValue(error);
  },
};

export const setupAuthServiceMock = (config: {
  loginResult?: any;
  loginError?: Error;
}) => {
  if (config.loginResult !== undefined) {
    authServiceMockReturns.loginSuccess(config.loginResult);
  }

  if (config.loginError !== undefined) {
    authServiceMockReturns.loginError(config.loginError);
  }
};

