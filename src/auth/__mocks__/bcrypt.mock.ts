import * as bcrypt from 'bcrypt';
jest.mock('bcrypt');

export const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

export const resetBcryptMock = () => {
  (bcrypt.compare as jest.Mock).mockReset();
  (bcrypt.hash as jest.Mock).mockReset();
  (bcrypt.genSalt as jest.Mock).mockReset();
};

export const clearBcryptMock = () => {
  (bcrypt.compare as jest.Mock).mockClear();
  (bcrypt.hash as jest.Mock).mockClear();
  (bcrypt.genSalt as jest.Mock).mockClear();
};

export const bcryptMockReturns = {
  compareSuccess: () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  },

  compareFail: () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
  },

  compareError: (error: Error) => {
    (bcrypt.compare as jest.Mock).mockRejectedValue(error);
  },

  hashSuccess: (hashedPassword: string = '$2b$10$hashedpassword') => {
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
  },

  hashError: (error: Error) => {
    (bcrypt.hash as jest.Mock).mockRejectedValue(error);
  },
};

export const setupBcryptMock = (config: {
  compare?: boolean | Error;
  hash?: string | Error;
}) => {
  if (config.compare !== undefined) {
    if (config.compare instanceof Error) {
      bcryptMockReturns.compareError(config.compare);
    } else if (config.compare === true) {
      bcryptMockReturns.compareSuccess();
    } else {
      bcryptMockReturns.compareFail();
    }
  }

  if (config.hash !== undefined) {
    if (config.hash instanceof Error) {
      bcryptMockReturns.hashError(config.hash);
    } else {
      bcryptMockReturns.hashSuccess(config.hash);
    }
  }
};
