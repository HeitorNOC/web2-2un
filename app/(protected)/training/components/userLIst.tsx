import { FC } from "react"
import { Button } from "@/components/ui/button"
import { FaEye, FaPlus, FaEdit, FaTrash, FaUser, FaUnlink } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

interface UserListProps {
  users: any[]
  onCreateTraining: (student: any) => void
  onViewTraining: (student: any) => void
  onEditTraining: (student: any) => void
  onDeleteTraining: (student: any) => void
  onUnLinkUser: (student: any) => void
}

const UserList: FC<UserListProps> = ({ users, onCreateTraining, onViewTraining, onEditTraining, onDeleteTraining, onUnLinkUser }) => {

  return (
    <div className="overflow-x-auto">
       <table className="min-w-full bg-slate-800 text-white">
         <thead className="bg-slate-900">
          <tr>
            <th className="px-4 py-2 border-b"></th>
            <th className="px-6 py-3 border-b">Nome</th>
            <th className="px-6 py-3 border-b">Email</th>
            <th className="px-6 py-3 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user.id}>
              <td className="px-4 py-3">
                <Avatar>
                  {user.user.image ? (
                    <AvatarImage src={user.user.image} className="w-10 h-10 mb-4 rounded-full" />
                  ) : (
                    <AvatarFallback className="w-24 h-24 mb-4 rounded-full">
                      <FaUser size={30} />
                    </AvatarFallback>
                  )}
                </Avatar>
              </td>
              <td className="px-6 py-4 border-b">{user.user.name}</td>
              <td className="px-6 py-4 border-b">{user.user.email}</td>
              <td className="px-6 py-4 border-b flex space-x-2">
              <Button 
                disabled={!user.Training} 
                onClick={() => onViewTraining(user.user)} 
                title="Visualizar Treinamento"
              >
              <FaEye />
              </Button>

              <Button 
              disabled={user.Training} 
              onClick={() => onCreateTraining(user.user)} 
              title="Criar Treinamento"
              >
              <FaPlus />
              </Button>

              <Button 
              disabled={!user.Training} 
              onClick={() => onEditTraining(user.user)} 
              title="Editar Treinamento"
              >
              <FaEdit />
              </Button>

              <Button 
              disabled={!user.Training} 
              onClick={() => onDeleteTraining(user.user)} 
              title="Excluir Treinamento"
              >
              <FaTrash />
              </Button>

              <Button 
              disabled={user.Training} 
              onClick={() => onUnLinkUser(user.user)} 
              title="Desvincular Usuário"
              >
              <FaUnlink/>
              </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
