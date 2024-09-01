import { getUserProfile } from '../userProfile';
import { db } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('getUserProfile function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the user profile with student additional data when role is STUDENT', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user123',
      cpf: '123.456.789-10',
      name: 'Student User',
      email: 'student@example.com',
      role: 'STUDENT',
      image: null,
      password: 'hashedpassword',
      StudentAdditionalData: {
        phone: '123456789',
        gender: 'male',
        birthDate: new Date('2000-01-01'),
        height: 1.75,
        weight: 70,
        bf: 15,
        comorbidity: 'None',
      },
      InstructorAdditionalData: null,
      AdministratorAdditionalData: null,
    });

    const result = await getUserProfile('user123');

    expect(result).toEqual({
      cpf: '123.456.789-10',
      name: 'Student User',
      email: 'student@example.com',
      phone: '123456789',
      image: null,
      role: 'STUDENT',
      credentials: true,
      gender: 'male',
      birthDate: new Date('2000-01-01'),
      height: '1.75',
      weight: '70',
      bf: '15',
      comorbidity: 'None',
    });
  });

  it('should return the user profile with instructor additional data when role is INSTRUCTOR', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user456',
      cpf: '987.654.321-00',
      name: 'Instructor User',
      email: 'instructor@example.com',
      role: 'INSTRUCTOR',
      image: 'profile.jpg',
      password: null,
      StudentAdditionalData: null,
      InstructorAdditionalData: {
        phone: '987654321',
        cref: '123456',
      },
      AdministratorAdditionalData: null,
    });

    const result = await getUserProfile('user456');

    expect(result).toEqual({
      cpf: '987.654.321-00',
      name: 'Instructor User',
      email: 'instructor@example.com',
      phone: '987654321',
      image: 'profile.jpg',
      role: 'INSTRUCTOR',
      credentials: false,
      cref: '123456',
    });
  });

  it('should return basic profile data when there are no additional data', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user789',
      cpf: '111.222.333-44',
      name: 'Basic User',
      email: 'basic@example.com',
      role: 'ADMIN',
      image: null,
      password: 'hashedpassword',
      StudentAdditionalData: null,
      InstructorAdditionalData: null,
      AdministratorAdditionalData: null,
    });

    const result = await getUserProfile('user789');

    expect(result).toEqual({
      cpf: '111.222.333-44',
      name: 'Basic User',
      email: 'basic@example.com',
      phone: null,
      image: null,
      role: 'ADMIN',
      credentials: true,
    });
  });

  it('should throw an error if the user is not found', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(getUserProfile('unknownUser')).rejects.toThrow('Erro ao buscar perfil do usuário.');
  });
});
