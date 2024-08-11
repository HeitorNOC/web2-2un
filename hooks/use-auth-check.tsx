import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from "@/lib/axios"

const useAuthCheck = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Espera a sessão ser carregada
    console.log(`status, `, status)
    const checkAccess = async () => {
      if (session) {
        const userId = session.user.id

        try {
          const { data } = await axiosInstance.get(`/api/verify-user/${userId}`)

          if (!data.isComplete) {
            router.push("/complete-profile")
          } else if (!data.hasActivePayment) {
            router.push("/payment")
          } else if (!data.hasAccess) {
            router.push("/unauthorized")
          }
        } catch (error:any) {
          console.error('Error fetching user verification:', error.response?.data || error.message)
          router.push("/error") // Redireciona para uma página de erro se necessário
        }
      } else {
        router.push("/auth/login") // Redireciona para a página de login se não houver sessão
      }
    }

    checkAccess()
  }, [session, status, router])

  return { session }
}

export default useAuthCheck
