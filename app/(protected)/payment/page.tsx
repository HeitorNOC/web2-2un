"use client"

import { useRouter } from 'next/navigation'
import { PlanType } from '@/enums/plan'

const PaymentPage = () => {
  const router = useRouter()

  const handlePlanSelection = (planType: PlanType) => {
    router.push(`/payment/${planType}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Escolha seu Plano</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Plano Normal</h2>
          <p className="text-4xl font-bold mb-4">R$100 / mês</p>
          <ul className="mb-4">
            <li className="flex items-center mb-2">
              ✓ Acesso às máquinas de musculação
            </li>
            <li className="flex items-center mb-2">
              ✓ Aulas de ginástica
            </li>
            <li className="flex items-center mb-2">
              ✓ Aulas de spinning
            </li>
            <li className="flex items-center mb-2">
              ✗ Personal Trainer
            </li>
            <li className="flex items-center mb-2">
              ✗ Acesso à sauna
            </li>
            <li className="flex items-center mb-2">
              ✗ Nutricionista
            </li>
          </ul>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={() => handlePlanSelection(PlanType.NORMAL)}
          >
            Escolher Plano Normal
          </button>
        </div>
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Plano VIP</h2>
          <p className="text-4xl font-bold mb-4">R$200 / mês</p>
          <ul className="mb-4">
            <li className="flex items-center mb-2">
              ✓ Acesso às máquinas de musculação
            </li>
            <li className="flex items-center mb-2">
              ✓ Aulas de ginástica
            </li>
            <li className="flex items-center mb-2">
              ✓ Aulas de spinning
            </li>
            <li className="flex items-center mb-2">
              ✓ Personal Trainer
            </li>
            <li className="flex items-center mb-2">
              ✓ Acesso à sauna
            </li>
            <li className="flex items-center mb-2">
              ✓ Nutricionista
            </li>
          </ul>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={() => handlePlanSelection(PlanType.VIP)}
          >
            Escolher Plano VIP
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
