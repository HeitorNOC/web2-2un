import { fetchTrainingsForStudent } from '../fetch-traning'
import { db } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
    training: {
      findMany: jest.fn(),
    },
  },
}));

describe('fetchTrainingsForStudent function', () => {
  const mockStudentId = 'student-id-123';
  const mockStudentData = {
    id: 'user-id-123',
    StudentAdditionalData: { id: 'student-id-123' },
  };
  const mockTrainings = [
    {
      id: 'training-id-123',
      blocks: [
        {
          exercises: [
            {
              machine: { id: 'machine-id-123', name: 'Machine 1' },
            },
          ],
        },
      ],
      instructor: {
        user: { id: 'instructor-id-123', name: 'Instructor 1' },
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should fetch trainings for a student successfully', async () => {
    // Mocking the database responses
    (db.user.findUnique as jest.Mock).mockResolvedValue(mockStudentData);
    (db.training.findMany as jest.Mock).mockResolvedValue(mockTrainings);

    const result = await fetchTrainingsForStudent(mockStudentId);

    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockStudentId },
      include: { StudentAdditionalData: true },
    });
    expect(db.training.findMany).toHaveBeenCalledWith({
      where: { studentId: mockStudentData.StudentAdditionalData.id },
      include: {
        blocks: { include: { exercises: { include: { machine: true } } } },
        instructor: { include: { user: true } },
      },
    });
    expect(result).toEqual({ success: true, trainings: mockTrainings });
  });

  it('should return an error if student data is not found', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await fetchTrainingsForStudent(mockStudentId);

    expect(result).toEqual({
      success: false,
      error: 'Instrutor não encontrado ou inválido',
    });
    expect(db.training.findMany).not.toHaveBeenCalled();
  });

  it('should return an error if an exception occurs', async () => {
    (db.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

    const result = await fetchTrainingsForStudent(mockStudentId);

    expect(result).toEqual({
      success: false,
      error: 'Erro ao buscar treinos.',
    });
    expect(console.error).toHaveBeenCalledWith('Erro ao buscar treinos:', expect.any(Error));
  });
});
