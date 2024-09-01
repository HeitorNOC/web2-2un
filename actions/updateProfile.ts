"use server"
import { unstable_update } from "@/auth";
import { db } from "@/lib/db";

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
