import { updateUserProfile } from '../updateProfile'; 
import { db } from '@/lib/db';
import { unstable_update } from "@/auth";

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      update: jest.fn(),
    },
    studentAdditionalData: {
      update: jest.fn(),
    },
    instructorAdditionalData: {
      update: jest.fn(),
    },
  },
}));

jest.mock('@/auth', () => ({
  unstable_update: jest.fn(),
}));

describe('updateUserProfile function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  afterEach(() => {
    jest.restoreAllMocks(); 
  });

  it('should update user profile successfully', async () => {
    const userId = 'user123';
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '123.456.789-10',
      role: 'STUDENT',
    };

    const result = await updateUserProfile({ userId, data });

    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        image: undefined,
      },
    });

    expect(unstable_update).toHaveBeenCalledWith({
      user: {
        image: undefined,
        name: data.name,
        email: data.email,
      }
    });

    expect(result).toEqual({ success: true });
  });

  it('should update student additional data when role is STUDENT', async () => {
    const userId = 'user123';
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '123.456.789-10',
      role: 'STUDENT',
      phone: '123456789',
      gender: 'male',
      birthDate: '2000-01-01',
      height: '180',
      weight: '70',
      bf: '10',
      comorbidity: 'none',
    };

    const result = await updateUserProfile({ userId, data });

    expect(db.user.update).toHaveBeenCalled();
    expect(db.studentAdditionalData.update).toHaveBeenCalledWith({
      where: { userId },
      data: {
        phone: data.phone,
        gender: data.gender,
        birthDate: new Date(data.birthDate),
        height: parseFloat(data.height),
        weight: parseFloat(data.weight),
        bf: parseFloat(data.bf),
        comorbidity: data.comorbidity,
      },
    });

    expect(result).toEqual({ success: true });
  });

  it('should update instructor additional data when role is INSTRUCTOR', async () => {
    const userId = 'user123';
    const data = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      cpf: '123.456.789-11',
      role: 'INSTRUCTOR',
      phone: '987654321',
      cref: '12345',
    };

    const result = await updateUserProfile({ userId, data });

    expect(db.user.update).toHaveBeenCalled();
    expect(db.instructorAdditionalData.update).toHaveBeenCalledWith({
      where: { userId },
      data: {
        phone: data.phone,
        cref: data.cref,
      },
    });

    expect(result).toEqual({ success: true });
  });

  it('should throw an error if the update fails', async () => {
    const userId = 'user123';
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '123.456.789-10',
      role: 'STUDENT',
    };

    (db.user.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

    await expect(updateUserProfile({ userId, data })).rejects.toThrow(
      'Erro ao atualizar o perfil do usuário.'
    );

    expect(console.error).toHaveBeenCalledWith(
      'Erro ao atualizar o perfil do usuário:',
      expect.any(Error)
    );
  });
});