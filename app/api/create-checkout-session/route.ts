// app/api/create-checkout-session/route.ts

"use server"

import { PlanType } from '@/enums/plan'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  try {
    const { planType, amount, userId } = await req.json()

    if (!planType || !amount || !userId) {
      return NextResponse.json({ error: 'planType, amount, and userId are required' }, { status: 400 })
    }

    if (!Object.values(PlanType).includes(planType)) {
      return NextResponse.json({ error: 'Invalid planType' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: planType === PlanType.NORMAL ? 'Plano Normal' : 'Plano VIP',
              images: ['https://drive.google.com/uc?id=1vssmk1m87iJCS-gzxKErDNneaqefThh-'], // URL da imagem
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
      metadata: {
        userId, // Inclui o userId na metadata da sessão
        planType, // Inclui o tipo do plano na metadata
      },
    })

    return NextResponse.json({ sessionId: session.id }, { status: 200 })
  } catch (err: any) {
    console.error('Erro ao criar sessão de checkout:', err)
    return NextResponse.json({ error: 'Erro ao criar sessão de checkout', details: err.message }, { status: 500 })
  }
}
