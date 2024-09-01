import { fetchWorkoutLogs } from '../workoutAction';
import { db } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  db: {
    workoutLog: {
      findMany: jest.fn(),
    },
  },
}));

describe('fetchWorkoutLogs function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  afterEach(() => {
    jest.restoreAllMocks(); 
  });

  it('should fetch workout logs for a user successfully', async () => {
    const mockLogs = [
      {
        id: 'log1',
        userId: 'user1',
        createdAt: new Date(),
        exercise: { id: 'exercise1', name: 'Squat' },
        trainingBlock: {
          id: 'block1',
          training: { id: 'training1', name: 'Strength Training' },
        },
      },
    ];

    (db.workoutLog.findMany as jest.Mock).mockResolvedValue(mockLogs);

    const userId = 'user1';
    const result = await fetchWorkoutLogs(userId);

    expect(db.workoutLog.findMany).toHaveBeenCalledWith({
      where: { userId },
      include: {
        exercise: true,
        trainingBlock: {
          include: {
            training: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    expect(result).toEqual(mockLogs);
  });

  it('should throw an error if there is an issue fetching workout logs', async () => {
    (db.workoutLog.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const userId = 'user1';

    await expect(fetchWorkoutLogs(userId)).rejects.toThrow('Erro ao buscar logs de treino.');
    expect(console.error).toHaveBeenCalledWith('Erro ao buscar logs de treino:', expect.any(Error));
  });
});