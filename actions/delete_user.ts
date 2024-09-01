'user-server'
import { db } from "@/lib/db";

export async function deleteUserAction(userId: string) {
  try {
      await db.user.delete({
          where: {
              id: userId,
          },
      })
      return { success: true }
  } catch (error) {
      console.error("Erro ao excluir usuário:", error)
      return { error: "Erro ao excluir usuário." }
  }
}