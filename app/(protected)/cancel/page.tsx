"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const CancelPage = () => {
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (session_id) {
      setLoading(false)
    } else {
      setError('Sessão não encontrada. Cancelamento não pôde ser verificado.')
      setLoading(false)
    }
  }, [session_id])

  if (loading) {
    return <p>Verificando cancelamento...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h1>Pagamento Cancelado</h1>
      <p>O pagamento foi cancelado. Se isso foi um engano, por favor, tente novamente.</p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        onClick={() => router.push('/payment')}
      >
        Tentar Novamente
      </button>
    </div>
  )
}

export default CancelPage
