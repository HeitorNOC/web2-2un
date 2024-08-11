import { FC } from "react"

import { Button } from "@/components/ui/button"
import { User } from "@/types/next-auth"

interface UserListProps {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const UserList: FC<UserListProps> = ({ users, loading, onEdit, onDelete }) => {
  return loading ? (
    <p>Carregando...</p>
  ) : users.length === 0 ? (
    <p>Não há usuários cadastrados.</p>
  ) : (
    <div className="table-responsive">
      <table className="table">
        <thead className="bg-secondary">
          <tr>
            <th className="border-0 py-2 text-body-secondary">Nome</th>
            <th className="border-0 py-2 text-body-secondary">Email</th>
            <th className="border-0 py-2 text-body-secondary">Role</th>
            <th className="border-0 py-2 text-body-secondary text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-3 text-break">{user.name}</td>
              <td className="py-3 text-break">{user.email}</td>
              <td className="py-3 text-break">{user.role}</td>
              <td className="py-3 text-center">
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => onEdit(user)}>
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={() => onDelete(user)}>
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
