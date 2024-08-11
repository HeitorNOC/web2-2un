"use client"

import { startTransition, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { updatePaymentAction } from '@/actions/update-payment'

const SuccessPage = () => {
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (session_id) {
            const verifyPayment = async () => {
                try {
                    const response = await axios.post('/api/verify-payment', { session_id })
                    if (response.data.success) {
                        updatePayment()
                    } else {
                        setError('Pagamento não pôde ser verificado.')
                    }
                } catch (error) {
                    setError('Erro ao verificar o pagamento.')
                } finally {
                    setLoading(false)
                }
            }

            verifyPayment()
        }
    }, [session_id])

    async function updatePayment() {
        if (session_id) {
            startTransition(() => {
                updatePaymentAction({ sessionId: session_id }).then((data: any) => {
                    if (data?.error) {
                        setError(data.error)
                        return
                    } else if (data.success) {
                        router.push('/settings')
                    }
                })
            })
        }
    }

    if (loading) {
        return <p>Verificando pagamento...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return <p>Pagamento bem-sucedido! Obrigado pela sua compra.</p>
}

export default SuccessPage
