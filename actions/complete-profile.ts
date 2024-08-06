import { Role } from "@/enums/role";
import { db } from "@/lib/db";
import { adminProfileSchema, instructorProfileSchema, studentProfileSchema } from "@/schemas";

interface CompleteProfileActionProps {
    userId: string
    role: string
    cpf: string
    additionalData: any
}

export const completeProfileAction = async ({ userId, role, cpf, additionalData }: CompleteProfileActionProps) => {
    let validatedData;

    switch (role) {
        case Role.STUDENT:
            validatedData = studentProfileSchema.parse({
                cpf,
                ...additionalData,
            });
            await db.studentAdditionalData.create({
                data: {
                    userId,
                    height: validatedData.height,
                    weight: validatedData.weight,
                    bf: validatedData.bodyFat,
                    comorbidity: validatedData.comorbidity,
                    planType: 1
                },
            });
            break;
        case Role.INSTRUCTOR:
            validatedData = instructorProfileSchema.parse({
                cpf,
                ...additionalData,
            });
            await db.instructorAdditionalData.create({
                data: {
                    userId,
                    cref: validatedData.cref,
                },
            });
            break;
        case Role.ADMIN:
            validatedData = adminProfileSchema.parse({
                cpf,
            });
            await db.administratorAdditionalData.create({
                data: {
                    userId,
                },
            });
            break;
    }

    if (validatedData) {

        await db.user.update({
            where: { id: userId },
            data: { cpf: validatedData.cpf },
        });
    } else {
        return { error: 'Erro ao completar o cadastro.' }
    }
};
