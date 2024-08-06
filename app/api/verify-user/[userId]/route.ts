import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';


export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  const user = await db.user.findUnique({
    where: { id: userId as string },
    include: {
      AdministratorAdditionalData: true,
      StudentAdditionalData: true,
      InstructorAdditionalData: true,
      Payment: true,
    },
  });

  if (!user) return { error: 'Usuário não encontrado' }

  const isComplete = user.AdministratorAdditionalData.length > 0 || user?.StudentAdditionalData.length > 0 || user?.InstructorAdditionalData.length > 0;
  const hasActivePayment = user.Payment.some(payment => payment.status === 'completed' && new Date(payment.paymentDate).getMonth() === new Date().getMonth());
  const hasAccess = user.role === 'STUDENT' || (user?.role === 'INSTRUCTOR' && req.url?.includes('/instructor'));

  res.status(200).json({ isComplete, hasActivePayment, hasAccess });
};
