"use client"

import { FaUser } from "react-icons/fa"
import { ExitIcon } from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user"
import LogoutButton from "@/components/auth/logout-button"
import { useEffect } from "react"

const UserButton = () => {
  const user = useCurrentUser()

  useEffect(() => {

  }, [user])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} width={200} height={200}/>
          <AvatarFallback className="bg-sky-400 text-primary-foreground">
            <FaUser className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40"
        align="end"
      >
        <LogoutButton>
          <DropdownMenuItem className="hover:bg-sky-400 focus:bg-sky-400 hover:text-primary-foreground focus:text-primary-foreground text-center justify-center">
            <ExitIcon className="h-4 w-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
