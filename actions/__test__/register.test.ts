import { register } from '../register';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import bcrypt from 'bcryptjs';

jest.mock('@/data/user', () => ({
  getUserByEmail: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      create: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

jest.mock('@/lib/tokens', () => ({
  generateVerificationToken: jest.fn().mockResolvedValue({
    email: 'john@example.com',
    token: 'token123',
  }),
}));

jest.mock('@/lib/mail', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
}));

describe('register function', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa todos os mocks antes de cada teste para evitar vazamento de memória
  });

  it('should return error when fields are invalid', async () => {
    // Simula um cenário onde os campos são inválidos
    const result = await register({
      name: '',
      email: 'invalido',
      password: '123456',
      passwordConfirmation: '123456',
    });

    expect(result.error).toBe('Invalid fields.');
  });

  it('should return error when user already exists', async () => {
    // Simula um cenário onde o usuário já existe
    (getUserByEmail as jest.Mock).mockResolvedValue({ id: 'user123' });

    const result = await register({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      passwordConfirmation: '123456',
    });

    expect(result.error).toBe('User email already exists.');
  });

  it('should create a new user when data is valid', async () => {
    // Simula um cenário onde o usuário não existe
    (getUserByEmail as jest.Mock).mockResolvedValue(null);

    const result = await register({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      passwordConfirmation: '123456',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(db.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        isActive: false,
      },
    });

    expect(result.success).toBe('Registro realizado. Verifique seu Email!');
  });

  it('should send verification email after creating a user', async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue(null);

    await register({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
      passwordConfirmation: '123456',
    });

    expect(generateVerificationToken).toHaveBeenCalledWith('jane@example.com');
    expect(sendVerificationEmail).toHaveBeenCalledWith('john@example.com', 'token123');
  });
});
