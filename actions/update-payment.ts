"use server";

import { db } from '@/lib/db';
import Stripe from 'stripe';
import { getUserById } from "../data/user";
import dayjs from 'dayjs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

interface UpdatePaymentActionProps {
  sessionId: string;
}

export const updatePaymentAction = async ({ sessionId }: UpdatePaymentActionProps) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || !session.metadata || !session.amount_total) {
      return { error: 'Sessão inválida' };
    }

    const userId = session.metadata.userId;

    if (!userId) {
      return { error: 'User ID not found in session metadata' };
    }

    const userFromDB = await getUserById(userId);

    if (!userFromDB || !userFromDB.StudentAdditionalData) {
      return { error: 'User not valid' };
    }

    // Verifica se existe um pagamento atual na tabela `Payment`
    const existingPayment = await db.payment.findFirst({
      where: {
        studentAdditionalDataId: userFromDB.StudentAdditionalData.id,
      },
      orderBy: {
        createdAt: 'desc', // Seleciona o pagamento mais recente
      },
    });

    if (existingPayment) {
      // Mover os dados do pagamento atual para `PaymentHistory`
      await db.paymentHistory.create({
        data: {
          paymentId: existingPayment.id,
          studentAdditionalDataId: userFromDB.StudentAdditionalData.id,
          createdAt: new Date(),
        },
      });

      // Excluir o pagamento existente da tabela `Payment`
      await db.payment.delete({
        where: {
          id: existingPayment.id,
        },
      });
    }

    // Criar o novo pagamento
    const payment = await db.payment.create({
      data: {
        studentAdditionalDataId: userFromDB.StudentAdditionalData.id,
        amount: session.amount_total / 100,
        method: session.payment_method_types[0],
        paymentDate: new Date(),
        planType: Number(session.metadata.planType),
        status: session.payment_status,
      },
    });

    // Registrar o novo pagamento na tabela `PaymentHistory`
    await db.paymentHistory.create({
      data: {
        paymentId: payment.id,
        studentAdditionalDataId: userFromDB.StudentAdditionalData.id,
      },
    });

    return { success: 'Pagamento atualizado com sucesso' };

  } catch (error) {
    console.error('Erro ao atualizar o pagamento:', error);
    throw new Error('Erro ao atualizar o pagamento');
  }
};
