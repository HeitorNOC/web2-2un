"use client"
import React from 'react'
import { useRouter } from "next/navigation"
import { ArrowLeft } from 'phosphor-react'
import Image from 'next/image'
import Logo from '@/public/Logo.png'

const Unauthorized = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-gray-100">
      <div className="text-center">
        <div className="mb-5 text-center">
          <Image src={Logo} alt="Logo" width={450} height={450} />
        </div>
        <h1 className="text-6xl font-bold mb-4">401</h1>
        <p className="text-2xl mb-6">Não Autorizado</p>
        <p className="text-gray-400 mb-8">
          Você não tem permissão para acessar esta página.
        </p>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} className="mr-2" />
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  )
}

export default Unauthorized