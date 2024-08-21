"use server"

import { db } from "@/lib/db"

interface CreateTrainingProps {
  studentId: string
  instructorId: string
  blocks: {
    name: string
    type: string
    exercises: {
      name: string
      description?: string
      machineId: string
      series: string
      repetitions: string
      suggestedWeight: string
    }[]
  }[]
}

export async function createTrainingAction({
  studentId,
  instructorId,
  blocks,
}: CreateTrainingProps) {
  try {
    // Verifique se o estudante já possui um treino
    const existingTraining = await db.training.findUnique({
      where: { studentId }
    });

    if (existingTraining) {
      return { success: false, error: "Este estudante já possui um treino." };
    }

    // Verifique os dados do instrutor e do estudante
    const instructorData = await db.user.findUnique({
      where: { id: instructorId },
      include: {
        InstructorAdditionalData: true
      }
    });

    if (!instructorData || !instructorData.InstructorAdditionalData) {
      return { success: false, error: "Instrutor não encontrado ou inválido" };
    }

    const studentData = await db.user.findUnique({
      where: { id: studentId },
      include: {
        StudentAdditionalData: true
      }
    });

    if (!studentData || !studentData.StudentAdditionalData || !studentData.StudentAdditionalData.id) {
      return { success: false, error: "Estudante não encontrado ou inválido" };
    }

    // Criação do novo treino
    const training = await db.training.create({
      data: {
        studentId: studentData.StudentAdditionalData.id,
        instructorId: instructorData.InstructorAdditionalData.id,
        blocks: {
          create: blocks.map((block) => ({
            name: block.name,
            type: block.type,
            exercises: {
              create: block.exercises.map(exercise => ({
                name: exercise.name,
                description: exercise.description,
                machineId: exercise.machineId,
                series: parseInt(exercise.series, 10),
                repetitions: parseInt(exercise.repetitions, 10),
                suggestedWeight: parseFloat(exercise.suggestedWeight),
              })),
            },
          })),
        },
      },
    });

    return { success: true, training };
  } catch (error) {
    console.error("Erro ao criar treino:", error);
    return { success: false, error: "Erro ao criar treino." };
  }
}



export async function updateTrainingAction(studentID: string, data: { blocks: CreateTrainingProps["blocks"] }) {
  const { blocks } = data;

  if (!blocks || blocks.length === 0) {
    console.error("Erro: Nenhum bloco fornecido para atualização.");
    return { success: false, error: "Nenhum bloco fornecido para atualização." };
  }

  try {
    // Verifica se o treinamento existe
    const existingTraining = await db.training.findFirst({
      where: {
        student: {
          userId: studentID,
        },
      },
      include: {
        blocks: {
          include: {
            exercises: true,
          },
        },
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existingTraining) {
      return { success: false, error: "Treinamento não encontrado." };
    }

    // Atualizar ou criar blocos
    for (const block of blocks) {
      if (!block.exercises || block.exercises.length === 0) {
        console.error("Erro: O bloco não contém exercícios.");
        continue;
      }

      const existingBlock = existingTraining.blocks.find(
        (existingBlock) => existingBlock.name === block.name && existingBlock.type === block.type
      );

      if (existingBlock) {
        // Atualiza o bloco existente
        await db.trainingBlock.update({
          where: { id: existingBlock.id },
          data: {
            name: block.name,
            type: block.type,
            exercises: {
              deleteMany: {}, // Remove os exercícios antigos
              create: block.exercises.map((exercise) => ({
                name: exercise.name,
                description: exercise.description || "",
                machine: {
                  connect: { id: exercise.machineId },
                },
                series: parseInt(exercise.series, 10),
                repetitions: parseInt(exercise.repetitions, 10),
                suggestedWeight: parseFloat(exercise.suggestedWeight),
              })),
            },
          },
        });
      } else {
        // Cria um novo bloco se não existir
        await db.trainingBlock.create({
          data: {
            trainingId: existingTraining.id,
            name: block.name,
            type: block.type,
            exercises: {
              create: block.exercises.map((exercise) => ({
                name: exercise.name,
                description: exercise.description || "",
                machine: {
                  connect: { id: exercise.machineId },
                },
                series: parseInt(exercise.series, 10),
                repetitions: parseInt(exercise.repetitions, 10),
                suggestedWeight: parseFloat(exercise.suggestedWeight),
              })),
            },
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar treino:", error);
    return { success: false, error: "Erro ao atualizar treino." };
  }
}



export async function fetchTrainingsForStudent(studentId: string) {
  try {
    let studentData
    if (studentId) {
      studentData = await db.user.findUnique({
        where: { id: studentId },
        include: {
          StudentAdditionalData: true
        }
      })

    }
    if (!studentData || !studentData.StudentAdditionalData || !studentData.StudentAdditionalData.id) {
      return { success: false, error: "Instrutor não encontrado ou inválido" }
    }
    const trainings = await db.training.findMany({
      where: { studentId: studentData.StudentAdditionalData.id },
      include: {
        blocks: {
          include: {
            exercises: {
              include: {
                machine: true,
              },
            },
          },
        },
        instructor: {
          include: {
            user: true,
          },
        },
      },
    })

    return { success: true, trainings }
  } catch (error) {
    console.error("Erro ao buscar treinos:", error)
    return { success: false, error: "Erro ao buscar treinos." }
  }
}

export async function fetchAssociatedStudents(instructorId: string) {
  try {
    const instructorFromDB = await db.user.findUnique({
      where: {
        id: instructorId
      },
      include: {
        InstructorAdditionalData: true
      }
    })

    if (!instructorFromDB || !instructorFromDB.InstructorAdditionalData) {
      return { success: false, error: "Erro ao buscar instrutor." }
    }
    const students = await db.studentAdditionalData.findMany({
      where: {
        assignedInstructorId: instructorFromDB.InstructorAdditionalData.id,
      },
      include: {
        user: true,
        Training: {
          include: {
            blocks: {
              include: {
                exercises: true
              }
            }
          }
        }
      },
    })

    return { success: true, students }
  } catch (error) {
    console.error("Erro ao buscar alunos associados:", error)
    return { success: false, error: "Erro ao buscar alunos associados." }
  }
}

interface FetchMachinesActionProps {
  page: number
  limit: number
}

export async function fetchMachinesAction({
  page,
  limit,
  status,
}: FetchMachinesActionProps & { status?: string | null }) {
  const currentPage = Math.max(0, page)
  const skip = currentPage * limit

  const whereClause = status ? { status } : {}

  const [machines, total] = await Promise.all([
    db.machine.findMany({
      skip,
      take: limit,
      where: whereClause,
    }),
    db.machine.count({
      where: whereClause,
    }),
  ])

  return {
    machines,
    total,
  }
}

export async function deleteTrainingAction(id: string) {
  if (!id) {
    return { success: false, error: 'id do usuário vazio' }
  }

  try {
      const getUserFromDB  = await db.studentAdditionalData.findFirst({
        where: {
          userId: id
        },
        include: {
          Training: true
        }
      })

      if (!getUserFromDB) {
        return { success: false, error: 'usuário invalido' }
      }

      await db.trainingBlock.deleteMany({ where: { trainingId: getUserFromDB.Training?.id } })
      await db.training.delete({ where: { id: getUserFromDB.Training?.id } })

      return { success: true }
    } catch (error) {
      console.error("Erro ao deletar o training:", error);
      return { success: false, error: 'Erro ao deletar o training' }
    }
  
}