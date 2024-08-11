"use server"
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json()

    if (!session_id) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status === 'paid') {
      return NextResponse.json({ success: true, paymentStatus: 'aproved' }, { status: 200 })
    } else {
      return NextResponse.json({ success: true, paymentStatus: session.payment_status }, { status: 200 })
    } 
  } catch (error: any) {
    console.error('Erro ao verificar o pagamento:', error)
    return NextResponse.json({ success: false, error: 'Erro ao verificar o pagamento.' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json({ allow: 'POST' }, { status: 200 })
}
