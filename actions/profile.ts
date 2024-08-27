// src/actions/userActions.ts
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

interface UpdateUserProfileProps {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  cref?: string;
  gender?: string;
  birthDate?: string;
  height?: string;
  weight?: string;
  bf?: string;
  comorbidity?: string;
  image?: string | null;
  role: string;
}

export const updateUserProfile = async ({ userId, data }: { userId: string; data: UpdateUserProfileProps }) => {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        image: data.image,
      },
    });

    if (data.role === "STUDENT" && data.phone && data.gender && data.birthDate) {
      await db.studentAdditionalData.update({
        where: { userId },
        data: {
          phone: data.phone,
          gender: data.gender,
          birthDate: new Date(data.birthDate),
          height: data.height ? parseFloat(data.height) : null,
          weight: data.weight ? parseFloat(data.weight) : null,
          bf: data.bf ?parseFloat(data.bf) : null,
          comorbidity: data.comorbidity,
        },
      });
    } else if (data.role === "INSTRUCTOR" && data.phone && data.cref) {
      await db.instructorAdditionalData.update({
        where: { userId },
        data: {
          phone: data.phone,
          cref: data.cref,
        },
      });
    }

    unstable_update({
      user:{
        image: data.image,
        name: data.name,
        email: data.email
      }
    })

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar o perfil do usuário:", error);
    throw new Error("Erro ao atualizar o perfil do usuário.");
  }
};
