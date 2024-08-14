"use server"
import { db } from "@/lib/db"

interface AssociateInstructorActionProps {
  studentId: string
  instructorId: string | null
}

export async function associateInstructorAction({ studentId, instructorId }: AssociateInstructorActionProps) {
  console.log('studentId: ', studentId)
  console.log('instructorId: ', instructorId)
  try {
    const studentData = await db.user.findUnique({
      where: { id: studentId },
      include: {
        StudentAdditionalData: true
      }
    })

    if (!studentData || !studentData.StudentAdditionalData) {
      return { success: false, error: "Aluno não encontrado ou inválido" }
    }
    let updatedStudentData

    if (instructorId) {
      const instructorData = await db.user.findUnique({
        where: { id: instructorId },
        include: {
          InstructorAdditionalData: true
        }
      })

      if (!instructorData || !instructorData.InstructorAdditionalData) {
        return { success: false, error: "Instrutor não encontrado ou inválido" }
      }

      updatedStudentData = await db.studentAdditionalData.update({
        where: { id: studentData.StudentAdditionalData.id },
        data: { assignedInstructorId: instructorData.InstructorAdditionalData.id }
      })
    } else {
      updatedStudentData = await db.studentAdditionalData.update({
        where: { id: studentData.StudentAdditionalData.id },
        data: { assignedInstructorId: null }
      })
    }

    return { success: true, studentData: updatedStudentData }
  } catch (error) {
    console.error("Erro ao associar o professor:", error)
    return { success: false, error: "Erro ao associar o professor" }
  }
}
