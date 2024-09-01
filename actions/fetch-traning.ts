"use server"
import { db } from "@/lib/db";

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