"use server"
import { db } from "@/lib/db"

interface AssociateInstructorActionProps {
  studentId: string
  instructorId: string | null
}

export async function associateInstructorAction({ studentId, instructorId }: AssociateInstructorActionProps) {
  try {
    const studentData = await db.user.findUnique({
      where: { id: studentId },
      include: {
        StudentAdditionalData: true
      }
    })

    if (!studentData?.StudentAdditionalData) {
      return { success: false, error: "Aluno não encontrado" }
    }

    const updatedStudentData = await db.studentAdditionalData.update({
      where: { id: studentData.id },
      data: { assignedInstructorId: instructorId }
    })

    return { success: true, studentData: updatedStudentData }
  } catch (error) {
    console.error("Erro ao associar o professor:", error)
    return { success: false, error: "Erro ao associar o professor" }
  }
}
