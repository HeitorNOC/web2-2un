"use client"

import React, { useState, useEffect } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { format } from "date-fns" 
import Image from 'next/image'
import Logo from '@/public/Logo.png'

const HomePage = () => {
  const user = useCurrentUser()
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const today = new Date()
    const formattedDate = format(today, "dd/MM/yyyy")
    setCurrentDate(formattedDate)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center text-gray-100 p-6 overflow-hidden" >
      <header className="text-center mb-8">
        <Image src={Logo} alt="Flex Gym Logo" width={400} height={400} className="mb-4" />
        <h1 className="text-3xl font-bold mb-2">Bem-vindo, {user.name}!</h1>
        <p className="text-gray-400">Data Atual: {currentDate}</p>
      </header>
    </div>
  )
}

export default HomePage
