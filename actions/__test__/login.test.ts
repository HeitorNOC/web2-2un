import { login } from '../login';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { db } from '@/lib/db';
import { signIn } from '@/auth';
import { AuthError } from "next-auth"

jest.mock('@/data/user', () => ({
  getUserByEmail: jest.fn(),
}));

jest.mock('@/lib/tokens', () => ({
  generateVerificationToken: jest.fn(),
  generateTwoFactorToken: jest.fn(),
}));

jest.mock('@/lib/mail', () => ({
  sendVerificationEmail: jest.fn(),
  sendTwoFactorTokenEmail: jest.fn(),
}));

jest.mock('@/data/two-factor-token', () => ({
  getTwoFactorTokenByEmail: jest.fn(),
}));

jest.mock('@/data/two-factor-confirmation', () => ({
  getTwoFactorConfirmationByUserId: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    twoFactorToken: {
      delete: jest.fn(),
    },
    twoFactorConfirmation: {
      delete: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@/auth', () => ({
  signIn: jest.fn(),
}));

describe('login function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error when fields are invalid', async () => {
    const result = await login({ email: '', password: '' });

    expect(result).toEqual({ error: 'Invalid fields' });
  });

  it('should return error when user is not registered', async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue(null);

    const result = await login({ email: 'unknown@example.com', password: '123456' });

    expect(result).toEqual({ error: 'User not registered!' });
  });

  it('should send verification email if user email is not verified', async () => {
    const mockUser = { email: 'john@example.com', password: 'hashedPassword', emailVerified: false };
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (generateVerificationToken as jest.Mock).mockResolvedValue({ email: mockUser.email, token: 'token123' });

    const result = await login({ email: 'john@example.com', password: '123456' });

    expect(generateVerificationToken).toHaveBeenCalledWith(mockUser.email);
    expect(sendVerificationEmail).toHaveBeenCalledWith(mockUser.email, 'token123');
    expect(result).toEqual({ success: 'Verification email sent!' });
  });

  it('should handle two-factor authentication when enabled and code is provided', async () => {
    const mockUser = { id: 'user123', email: 'jane@example.com', password: 'hashedPassword', emailVerified: true, isTwoFactorEnabled: true };
    const mockTwoFactorToken = { token: '123456', expires: new Date(Date.now() + 10000), id: 'token123' };
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (getTwoFactorTokenByEmail as jest.Mock).mockResolvedValue(mockTwoFactorToken);
    (getTwoFactorConfirmationByUserId as jest.Mock).mockResolvedValue(null);

    const result = await login({ email: 'jane@example.com', password: '123456', code: '123456' });

    expect(db.twoFactorToken.delete).toHaveBeenCalledWith({ where: { id: mockTwoFactorToken.id } });
    expect(db.twoFactorConfirmation.create).toHaveBeenCalledWith({ data: { userId: mockUser.id } });
    expect(result).toBeUndefined(); 
  });

  it('should handle two-factor authentication when enabled but code is not provided', async () => {
    const mockUser = { id: 'user123', email: 'jane@example.com', password: 'hashedPassword', emailVerified: true, isTwoFactorEnabled: true };
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (generateTwoFactorToken as jest.Mock).mockResolvedValue({ email: mockUser.email, token: '123456' });

    const result = await login({ email: 'jane@example.com', password: '123456' });

    expect(generateTwoFactorToken).toHaveBeenCalledWith(mockUser.email);
    expect(sendTwoFactorTokenEmail).toHaveBeenCalledWith(mockUser.email, '123456');
    expect(result).toEqual({ twoFactor: true });
  });

  it('should return error when two-factor code is invalid', async () => {
    const mockUser = { id: 'user123', email: 'jane@example.com', password: 'hashedPassword', emailVerified: true, isTwoFactorEnabled: true };
    const mockTwoFactorToken = { token: 'wrongcode', expires: new Date(Date.now() + 10000), id: 'token123' };
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (getTwoFactorTokenByEmail as jest.Mock).mockResolvedValue(mockTwoFactorToken);

    const result = await login({ email: 'jane@example.com', password: '123456', code: 'invalidcode' });

    expect(result).toEqual({ error: 'Invalid code!' });
  });

  it('should return error when two-factor code is expired', async () => {
    const mockUser = { id: 'user123', email: 'jane@example.com', password: 'hashedPassword', emailVerified: true, isTwoFactorEnabled: true };
    const mockTwoFactorToken = { token: '123456', expires: new Date(Date.now() - 10000), id: 'token123' }; // Token expired
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (getTwoFactorTokenByEmail as jest.Mock).mockResolvedValue(mockTwoFactorToken);

    const result = await login({ email: 'jane@example.com', password: '123456', code: '123456' });

    expect(result).toEqual({ error: 'Code expired!' });
  });

  it('should sign in the user when credentials are correct', async () => {
    const mockUser = { id: 'user123', email: 'john@example.com', password: 'hashedPassword', emailVerified: true, isTwoFactorEnabled: false };
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (signIn as jest.Mock).mockResolvedValue(true);
  
    const result = await login({ email: 'john@example.com', password: '123456' });
  
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: 'john@example.com',
      password: '123456',
      redirectTo: '/home', 
    });
    expect(result).toBeUndefined(); 
  });

  it('should return error when credentials are invalid', async () => {
    const mockUser = { id: 'user123', email: 'john@example.com', password: 'hashedPassword', emailVerified: true, isTwoFactorEnabled: false };
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (signIn as jest.Mock).mockRejectedValue(new AuthError('CredentialsSignin'))
  
    const result = await login({ email: 'john@example.com', password: 'wrongpassword' });
  
    expect(result).toEqual({ error: 'Invalid credentials!' });
  });

  it('should return generic error for unexpected issues', async () => {
    const mockUser = { id: 'user123', email: 'john@example.com', password: 'hashedPassword', emailVerified: true, isTwoFactorEnabled: false };
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (signIn as jest.Mock).mockRejectedValue(new AuthError('UnknownError'));

    const result = await login({ email: 'john@example.com', password: '123456' });

    expect(result).toEqual({ error: 'Something went wrong!' });
  });
});
