// actions/__test__/delete-user.test.ts

import { deleteUserAction } from '../delete_user';
import { db } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      delete: jest.fn(),
    },
  },
}));

describe('deleteUserAction function', () => {
  const userId = 'test-user-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete user successfully', async () => {
    (db.user.delete as jest.Mock).mockResolvedValue({});

    const result = await deleteUserAction(userId);

    expect(db.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
    expect(result).toEqual({ success: true });
  });

  it('should return an error if deletion fails', async () => {
    const mockError = new Error('Deletion failed');
    (db.user.delete as jest.Mock).mockRejectedValue(mockError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await deleteUserAction(userId);

    expect(db.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao excluir usuário:", mockError);
    expect(result).toEqual({ error: "Erro ao excluir usuário." });

    consoleErrorSpy.mockRestore();
  });
});
