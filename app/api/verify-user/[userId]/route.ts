import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        AdministratorAdditionalData: true,
        StudentAdditionalData: true,
        InstructorAdditionalData: true,
        Payment: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const isComplete = user.AdministratorAdditionalData.length > 0 || user.StudentAdditionalData.length > 0 || user.InstructorAdditionalData.length > 0
    const hasActivePayment = user.Payment.some(payment => payment.status === 'completed' && new Date(payment.paymentDate).getMonth() === new Date().getMonth())
    const hasAccess = user.role === 'STUDENT' || (user.role === 'INSTRUCTOR' && req.url.includes('/instructor'))

    return NextResponse.json({ isComplete, hasActivePayment, hasAccess }, { status: 200 })
  } catch (error: any) {
    console.error('Error verifying user:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
