"use server"
import { unstable_update } from "@/auth";
import { db } from "@/lib/db";
import { UserProfileSchema, StudentProfileSchema, InstructorProfileSchema, AdminProfileSchema } from "@/schemas";

export async function getUserProfile(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        StudentAdditionalData: true,
        InstructorAdditionalData: true,
        AdministratorAdditionalData: true,
      },
    });

    if (!user) throw new Error("Usuário não encontrado");

    let profileData: any = {
      cpf: user.cpf,
      name: user.name,
      email: user.email,
      phone: user.StudentAdditionalData?.phone || user.InstructorAdditionalData?.phone || null,
      image: user.image,
      role: user.role,
      credentials: user.password ? true : false
    };

    if (user.role === "STUDENT") {
      profileData = {
        ...profileData,
        gender: user.StudentAdditionalData?.gender || null,
        birthDate: user.StudentAdditionalData?.birthDate || null,
        height: user.StudentAdditionalData?.height?.toString() || null,
        weight: user.StudentAdditionalData?.weight?.toString() || null,
        bf: user.StudentAdditionalData?.bf?.toString() || null,
        comorbidity: user.StudentAdditionalData?.comorbidity || null,
      };
    }

    if (user.role === "INSTRUCTOR") {
      profileData.cref = user.InstructorAdditionalData?.cref || null;
    }

    return profileData;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw new Error("Erro ao buscar perfil do usuário.");
  }
}