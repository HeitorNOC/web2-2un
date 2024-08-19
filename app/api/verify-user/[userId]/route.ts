import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Role } from "../../../../enums/role"

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
        StudentAdditionalData: {
          include: {
            Payment: true
          }
        },
        InstructorAdditionalData: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const isComplete =  user.AdministratorAdditionalData || user.StudentAdditionalData || user.InstructorAdditionalData
    const hasActivePayment = user.role === Role.STUDENT && user.StudentAdditionalData && user.StudentAdditionalData.Payment.some(payment => payment.status === 'completed' && new Date(payment.paymentDate).getMonth() === new Date().getMonth())
    const hasAccess = user.role === 'STUDENT' || (user.role === 'INSTRUCTOR')

    return NextResponse.json({ isComplete, hasActivePayment: true, hasAccess }, { status: 200 })
  } catch (error: any) {
    console.error('Error verifying user:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
