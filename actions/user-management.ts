"use server"

import { db } from "@/lib/db"
import { Role } from "@/enums/role"
import { User, StudentAdditionalData, InstructorAdditionalData, AdministratorAdditionalData } from "@prisma/client";

interface FetchUsersActionProps {
    role?: Role | null
    page: number
    limit: number
    actualUserId: string
}


export async function fetchUsersAction({
    role,
    page,
    limit,
    actualUserId
}: FetchUsersActionProps): Promise<{ users: any; total: number }>  {
    const currentPage = Math.max(0, page)
    const skip = currentPage * limit
    const whereClause = role ? { role, id: { not: actualUserId } } : { id: { not: actualUserId } }

    const [users, total] = await Promise.all([
        db.user.findMany({
            where: whereClause,
            skip,
            take: limit,
            include: {
                StudentAdditionalData: true,
                InstructorAdditionalData: true,
            },
        }),
        db.user.count({ where: whereClause }),
    ])

    return {
        users,
        total,
    }
}

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

export async function updateUserAction(userId: string, data: any['data']) {
    try {
        await db.user.update({
            where: {
                id: userId,
            },
            data,
        })
        return { success: true }
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error)
        return { error: "Erro ao atualizar usuário." }
    }
}