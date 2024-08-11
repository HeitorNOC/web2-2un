"use client"

import UserInfo from "@/components/user-info"
import { useCurrentUser } from "@/hooks/use-current-user"
import useAuthCheck from "../../../hooks/use-auth-check"
import Spinner from "../../../components/spinner"

const ClientPage = () => {
  const user = useCurrentUser()
  const { session } = useAuthCheck()

  if (!session?.user) {
    return <Spinner />
  }
  return (
    <UserInfo
      user={user}
      label="Client Page Example"
    />
  )
}

export default ClientPage
