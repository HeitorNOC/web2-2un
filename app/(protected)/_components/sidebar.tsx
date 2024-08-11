'use client'

import React from 'react'
import Link from "next/link"
import { links, RoleLinks, Link as LinkType, ROLES } from "@/app/(protected)/_constants" // Ajuste o caminho conforme necessário
import { useCurrentRole } from "@/hooks/use-current-role"
import { FaUser, FaCalendar, FaCog, FaCut, FaCashRegister, FaShoppingCart, FaClipboardList, FaChartLine, FaBox, FaChalkboardTeacher, FaBookOpen } from 'react-icons/fa'
import { ScrollArea } from "@/components/ui/scroll-area" // Importe o componente de scroll do shadcn UI
import "./style.css"
import UserButton from '@/components/auth/user-button'

const Sidebar = () => {
  const userRole = useCurrentRole()

  const roleLinks: LinkType[] = links[userRole as keyof RoleLinks] || []

  const icons: { [key: string]: any } = {
    "Perfil": <FaUser />,
    "Settings": <FaCog />,
    "Admin": <FaUser />,
  }

  return (
    <div className="sidebar">
      <ScrollArea className='p-4 pr-7'>
        {roleLinks.map((link, index) => (
          <Link key={index} href={link.path}>
            <div className="link-container">
              <span className="icon">{icons[link.title]}</span>
              <span className="link-title">{link.title}</span>
            </div>
          </Link>
        ))}
        <div className='button-user'>
          <UserButton />
        </div>
      </ScrollArea>
    </div>
  )
}

export default Sidebar
