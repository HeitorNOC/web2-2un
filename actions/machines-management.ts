"use server"

import { db } from "@/lib/db"

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

export async function deleteMachineAction(machineId: string) {
    try {
        await db.machine.delete({
            where: {
                id: machineId,
            },
        })
        return { success: true }
    } catch (error) {
        console.error("Erro ao excluir maquinário:", error)
        return { error: "Erro ao excluir maquinário." }
    }
}

export async function updateMachineAction(machineId: string, data: any['data']) {
    try {
        await db.machine.update({
            where: {
                id: machineId,
            },
            data,
        })
        return { success: true }
    } catch (error) {
        console.error("Erro ao atualizar maquinário:", error)
        return { error: "Erro ao atualizar maquinário." }
    }
}

interface CreateMachineActionProps {
    name: string
    serialNumber: string
    acquisitionDate: Date
    status: string
}

export async function createMachineAction({
    name,
    serialNumber,
    acquisitionDate,
    status,
}: CreateMachineActionProps) {
    try {
        const machine = await db.machine.create({
            data: {
                name,
                serialNumber,
                acquisitionDate,
                status,
            },
        })
        return { success: true, machine }
    } catch (error) {
        console.error("Erro ao criar maquinário:", error)
        return { error: "Erro ao criar maquinário." }
    }
}