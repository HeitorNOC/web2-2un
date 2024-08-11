"use server"

import { Role } from "@/enums/role"
import { db } from "@/lib/db"
import { adminProfileSchema, instructorProfileSchema, studentProfileSchema } from "@/schemas"

interface CompleteProfileActionProps {
    userId: string
    role: string
    cpf: string
    additionalData: any
}

export const completeProfileAction = async ({ userId, role, cpf, additionalData }: CompleteProfileActionProps) => {
    let validatedData


    try {
        switch (role) {
            case Role.STUDENT:
                validatedData = studentProfileSchema.safeParse({
                    cpf,
                    height: additionalData.height.toString(),
                    weight: additionalData.weight.toString(),
                    bodyFat: additionalData.bodyFat.toString(),
                    ...additionalData,
                })

                if (!validatedData.success) {
                    console.log(validatedData.error.errors)
                    return { error: "Invalid fields." }
                }
                await db.studentAdditionalData.create({
                    data: {
                        userId,
                        height: parseFloat(validatedData.data.height),
                        weight: parseFloat(validatedData.data.weight),
                        bf: parseFloat(validatedData.data.bodyFat),
                        comorbidity: validatedData.data.comorbidity,
                        planType: 1,
                        gender: validatedData.data.gender,
                        birthDate: new Date(validatedData.data.birthDate).toISOString(),
                        phone: validatedData.data.phone,
                    },
                })
                break
            case Role.INSTRUCTOR:
                validatedData = instructorProfileSchema.safeParse({
                    cpf,
                    ...additionalData,
                })
                if (!validatedData.success) {
                    return { error: "Invalid fields." }
                }
                await db.instructorAdditionalData.create({
                    data: {
                        userId,
                        cref: validatedData.data.cref,
                        phone: validatedData.data.phone,
                    },
                })
                break
            case Role.ADMIN:
                validatedData = adminProfileSchema.safeParse({
                    cpf,
                })
                if (!validatedData.success) {
                    return { error: "Invalid fields." }
                }
                await db.administratorAdditionalData.create({
                    data: {
                        userId,
                    },
                })
                break
        }

        if (validatedData) {
            await db.user.update({
                where: { id: userId },
                data: { cpf: validatedData.data.cpf },
            })
        } else {
            return { error: 'Erro ao completar o cadastro.' }
        }
        return { success: "Cadastro finalizado com sucesso." }
    } catch (error) {
        console.error('Error completing profile:', error)
        throw new Error('Erro ao completar o cadastro.')
    }
}
