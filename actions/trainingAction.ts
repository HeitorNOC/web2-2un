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
  console.log('create blocks: ', blocks)
  console.log('create blocks: ', studentId)
  console.log('create blocks: ', instructorId)
  try {
    let instructorData
    let studentData

    if (instructorId) {
      instructorData = await db.user.findUnique({
        where: { id: instructorId },
        include: {
          InstructorAdditionalData: true
        }
      })

    }
    if (!instructorData || !instructorData.InstructorAdditionalData) {
      return { success: false, error: "Instrutor não encontrado ou inválido" }
    }
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
    console.log(`block: `, blocks[0].exercises)
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
                suggestedWeight: parseFloat(exercise.suggestedWeight)
              }))
            },
          })),
        },
      },
    })

    return { success: true, training }
  } catch (error) {
    console.error("Erro ao criar treino:", error)
    return { success: false, error: "Erro ao criar treino." }
  }
}


export async function updateTrainingAction(trainingId: string, data: { blocks: CreateTrainingProps["blocks"] }) {
  const { blocks } = data

  try {
    const training = await db.training.update({
      where: { id: trainingId },
      data: {
        blocks: {
          deleteMany: {}, // Remove todos os blocos existentes antes de adicionar os novos
          create: blocks.map((block) => ({
            name: block.name,
            type: block.type,
            exercises: {
              create: block.exercises,
            },
          })),
        },
      },
    })

    return { success: true, training }
  } catch (error) {
    console.error("Erro ao atualizar treino:", error)
    return { success: false, error: "Erro ao atualizar treino." }
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

