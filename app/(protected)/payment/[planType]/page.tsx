// pages/payment/[planType].tsx
"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { PlanType } from '@/enums/plan'
import { useCurrentUser } from '@/hooks/use-current-user'

const planPrices = {
  [PlanType.NORMAL]: 10000,
  [PlanType.VIP]: 20000,
}

const Payment = ({params}: any ) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [isValidPlan, setIsValidPlan] = useState<boolean>()
  const [convertedPlanType, setConvertedPlanType] = useState<PlanType | null>(null)
  const user = useCurrentUser()

  const isValidPlanType = (value: number): value is PlanType => {
    return Object.values(PlanType).includes(value)
  }

  useEffect(() => {
    const planTypeNum = parseInt(params.planType, 10)
    if (!isNaN(planTypeNum) && isValidPlanType(planTypeNum)) {
      setIsValidPlan(true)
      setConvertedPlanType(planTypeNum)
    } else {
      setIsValidPlan(false)
    }
  }, [params.planType])

  const handlePayment = async () => {
    if (!convertedPlanType) {
      setError("Plano inválido.")
      return
    }

    setLoading(true)
    setError(undefined)

    try {
      const response = await axios.post('/api/create-checkout-session', {
        planType: convertedPlanType,
        amount: planPrices[convertedPlanType],
        userId: user.id
      })

      const { sessionId } = response.data

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
      await stripe!.redirectToCheckout({ sessionId })
    } catch (error) {
      setError("Erro ao processar o pagamento. Tente novamente.")
      setLoading(false)
    }
  }

  if (!isValidPlan) {
    return <p>Plano inválido</p>
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Pagamento do Plano {convertedPlanType === PlanType.NORMAL ? 'Normal' : 'VIP'}
      </h1>
      <p className="mb-4">Preço: R$ {(planPrices[convertedPlanType!] / 100).toFixed(2)}</p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processando...' : 'Pagar'}
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  )
}

export default Payment
