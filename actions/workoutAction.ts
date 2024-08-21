'use server'
import { db } from "../lib/db";

export async function fetchWorkoutLogs(userId: string) {
    try {
        const logs = await db.workoutLog.findMany({
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
        return logs;
    } catch (error) {
        console.error("Erro ao buscar logs de treino:", error);
        throw new Error("Erro ao buscar logs de treino.");
    }
}
