"use server"

import { db } from "@/lib/db";
import dayjs from "dayjs";

export async function getUserPaymentStatus(userId: string) {
  if (!userId) {
    throw new Error("ID do usuário não fornecido.");
  }

  try {
    // Busca os dados do usuário e o pagamento mais recente
    const userData = await db.studentAdditionalData.findUnique({
      where: {
        userId,
      },
      include: {
        Payment: {
          orderBy: {
            paymentDate: "desc",
          },
          take: 1,
        },
      },
    });

    // Verifica se o usuário existe
    if (!userData) {
      console.warn(`Nenhum dado de usuário encontrado para o ID: ${userId}`);
      return { status: "Usuário não encontrado", daysRemaining: null };
    }

    // Verifica se o usuário possui pagamentos
    if (!userData.Payment || userData.Payment.length === 0) {
      console.warn(`Nenhum pagamento encontrado para o usuário ID: ${userId}`);
      return { status: "Sem Pagamento", daysRemaining: null };
    }

    // Se há um pagamento registrado, calcula os dias restantes para o vencimento
    const latestPayment = userData.Payment[0];
    const expirationDate = latestPayment.adjustedExpirationDate || dayjs(latestPayment.paymentDate).add(30, 'days').toDate();
    const daysRemaining = dayjs(expirationDate).diff(new Date(), 'days');

    let status = "Pago";
    if (daysRemaining <= 0) {
      status = "Vencido";
    } else if (daysRemaining <= 5) {
      status = "A Vencer em Breve";
    }

    return { status, daysRemaining };
  } catch (error) {
    console.error("Erro ao buscar status de pagamento:", error);
    throw new Error("Erro ao buscar status de pagamento.");
  }
}
