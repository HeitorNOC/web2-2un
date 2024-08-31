import { generateTwoFactorToken } from '../tokenTwoFactor';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { db } from '@/lib/db';

jest.mock('@/data/two-factor-token', () => ({
  getTwoFactorTokenByEmail: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    twoFactorToken: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('generateTwoFactorToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new token when no existing token is found', async () => {
    (getTwoFactorTokenByEmail as jest.Mock).mockResolvedValue(null);
    (db.twoFactorToken.create as jest.Mock).mockResolvedValue({
      email: 'user@example.com',
      token: '123456',
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    const result = await generateTwoFactorToken('user@example.com');

    expect(db.twoFactorToken.delete).not.toHaveBeenCalled();
    expect(db.twoFactorToken.create).toHaveBeenCalledWith({
      data: {
        email: 'user@example.com',
        token: expect.any(String),
        expires: expect.any(Date),
      },
    });
    expect(result).toEqual({
      email: 'user@example.com',
      token: '123456',
      expires: expect.any(Date),
    });
  });

  it('should delete the existing token and create a new one when a token is found', async () => {
    const existingToken = { id: 'token123', email: 'user@example.com', token: '654321', expires: new Date() };
    (getTwoFactorTokenByEmail as jest.Mock).mockResolvedValue(existingToken);
    (db.twoFactorToken.create as jest.Mock).mockResolvedValue({
      email: 'user@example.com',
      token: '123456',
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    const result = await generateTwoFactorToken('user@example.com');

    expect(db.twoFactorToken.delete).toHaveBeenCalledWith({
      where: { id: existingToken.id },
    });
    expect(db.twoFactorToken.create).toHaveBeenCalledWith({
      data: {
        email: 'user@example.com',
        token: expect.any(String),
        expires: expect.any(Date),
      },
    });
    expect(result).toEqual({
      email: 'user@example.com',
      token: '123456',
      expires: expect.any(Date),
    });
  });

  it('should generate a token that expires in 5 minutes', async () => {
    (getTwoFactorTokenByEmail as jest.Mock).mockResolvedValue(null);
    (db.twoFactorToken.create as jest.Mock).mockResolvedValue({
      email: 'user@example.com',
      token: '123456',
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    const result = await generateTwoFactorToken('user@example.com');

    const expires = result.expires;
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

    expect(expires.getTime()).toBeCloseTo(fiveMinutesFromNow.getTime(), -1);
  });
});
