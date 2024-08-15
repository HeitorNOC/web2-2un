'use client'

import React from 'react'
import Link from "next/link"
import { links, RoleLinks, Link as LinkType, ROLES } from "@/app/(protected)/_constants" 
import { useCurrentRole } from "@/hooks/use-current-role"
import { FaUser, FaCog, FaIndustry, FaChalkboardTeacher } from 'react-icons/fa'
import { ScrollArea } from "@/components/ui/scroll-area"
import "./style.css"
import UserButton from '@/components/auth/user-button'

const Sidebar = () => {
  const userRole = useCurrentRole()

  const roleLinks: LinkType[] = links[userRole as keyof RoleLinks] || []

  const icons: { [key: string]: any } = {
    "Perfil": <FaUser />,
    "Settings": <FaCog />,
    "Admin": <FaUser />,
    "Machines": <FaIndustry/>,
    "Instructors": <FaChalkboardTeacher/>
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
