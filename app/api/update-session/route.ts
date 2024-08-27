"use server"
import { unstable_update } from "@/auth";
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return new NextResponse(null, { status: 405 }) 
  }

  const { name, email, image, role, isTwoFactorEnabled } = await req.json();

  try {
    // Chame o `unstable_update` com os dados do usuário atualizados
    console.log('image: ', image)
    unstable_update({
      user: {
        name: name,
        email: email,
        image: image,
        role,
        isTwoFactorEnabled,
      },
    });
console.log('res: ',res)
    return new NextResponse("Sessão atualizada com sucesso.", { status: 200 })
  } catch (error) {
    console.log("Erro ao atualizar a sessão:", error);
    return new NextResponse("Erro ao atualizar a sessão.", { status: 500 })
  }
}
