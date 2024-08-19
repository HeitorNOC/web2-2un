import { FC } from "react"
import { Button } from "@/components/ui/button"

interface UserListProps {
  users: any[]
  onCreateTraining: (student: any) => void
  onViewTraining: (student: any) => void
  onEditTraining: (student: any) => void
}

const UserList: FC<UserListProps> = ({ users, onCreateTraining, onViewTraining, onEditTraining }) => {
  console.log(users)
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-slate-900">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b">Nome</th>
            <th className="px-6 py-3 border-b">Email</th>
            <th className="px-6 py-3 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user.id}>
              <td className="px-6 py-4 border-b">{user.user.name}</td>
              <td className="px-6 py-4 border-b">{user.user.email}</td>
              <td className="px-6 py-4 border-b flex space-x-2">
                <Button onClick={() => onViewTraining(user.user)}>Ver Treino</Button>
                <Button disabled={user.Training.length > 0} onClick={() => onCreateTraining(user.user)}>Criar Treino</Button>
                <Button onClick={() => onEditTraining(user.user)}>Editar Treino</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
