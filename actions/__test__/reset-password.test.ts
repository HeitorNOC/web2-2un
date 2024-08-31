import { newPassword } from '../new-password';
import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

jest.mock('@/data/password-reset-token', () => ({
  getPasswordResetTokenByToken: jest.fn(),
}));

jest.mock('@/data/user', () => ({
  getUserByEmail: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      update: jest.fn(),
    },
    passwordResetToken: {
      delete: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('newPassword function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error when token is missing', async () => {
    const result = await newPassword({ password: 'newPassword123', passwordConfirmation: 'newPassword123' }, null);

    expect(result).toEqual({ error: 'Missing token!' });
  });

  it('should return error when fields are invalid', async () => {
    const result = await newPassword({ password: '', passwordConfirmation: '' }, 'validToken');

    expect(result).toEqual({ error: 'Invalid fields!' });
  });

  it('should return error when token is invalid', async () => {
    (getPasswordResetTokenByToken as jest.Mock).mockResolvedValue(null);

    const result = await newPassword({ password: 'newPassword123', passwordConfirmation: 'newPassword123' }, 'invalidToken');

    expect(result).toEqual({ error: 'Invalid token!' });
  });

  it('should return error when token has expired', async () => {
    const expiredToken = {
      id: 'token123',
      email: 'user@example.com',
      expires: new Date(Date.now() - 10000).toISOString(), 
    };
    (getPasswordResetTokenByToken as jest.Mock).mockResolvedValue(expiredToken);

    const result = await newPassword({ password: 'newPassword123', passwordConfirmation: 'newPassword123' }, 'expiredToken');

    expect(result).toEqual({ error: 'Token has expired!' });
  });

  it('should return error when user email does not exist', async () => {
    const validToken = {
      id: 'token123',
      email: 'user@example.com',
      expires: new Date(Date.now() + 10000).toISOString(), 
    };
    (getPasswordResetTokenByToken as jest.Mock).mockResolvedValue(validToken);
    (getUserByEmail as jest.Mock).mockResolvedValue(null);

    const result = await newPassword({ password: 'newPassword123', passwordConfirmation: 'newPassword123' }, 'validToken');

    expect(result).toEqual({ error: 'User email does not exist!' });
  });

  it('should successfully update the password and delete the token', async () => {
    const validToken = {
      id: 'token123',
      email: 'user@example.com',
      expires: new Date(Date.now() + 10000).toISOString(), 
    };
    const mockUser = { id: 'user123', email: 'user@example.com' };
    
    (getPasswordResetTokenByToken as jest.Mock).mockResolvedValue(validToken);
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    const result = await newPassword({ password: 'newPassword123', passwordConfirmation: 'newPassword123' }, 'validToken');

    expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { password: 'hashedPassword' },
    });
    expect(db.passwordResetToken.delete).toHaveBeenCalledWith({
      where: { id: validToken.id },
    });
    expect(result).toEqual({ success: 'Password updated!' });
  });
});
