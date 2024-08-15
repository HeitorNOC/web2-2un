import { FC } from "react"
import { Button } from "@/components/ui/button"
import { FaEdit, FaTrashAlt, FaUser } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

interface InstructorListProps {
  instructors: Array<{
    id: string
    name: string
    email: string
    cpf: string
    image?: string
    InstructorAdditionalData: {
      id: string
      userId: string
      name: string | null
      phone: string | null
      cref: string | null
      createdAt: Date
      updatedAt: Date
    } | null
  }>
  onEdit: (instructor: any) => void
  onDelete: (instructor: any) => void
}

const InstructorList: FC<InstructorListProps> = ({ instructors, onEdit, onDelete }) => {
    console.log(instructors)
  return instructors.length === 0 ? (
    <p className="text-center text-gray-500">Não há professores cadastrados.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-slate-800 text-white">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-4 py-2 text-left"></th>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Telefone</th>
            <th className="px-4 py-2 text-left">CREF</th>
            <th className="px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr key={instructor.id} className="border-t border-slate-700">
              <td className="px-4 py-3">
                <Avatar>
                  {instructor.image ? (
                    <AvatarImage src={instructor.image} className="w-10 h-10 mb-4 rounded-full" />
                  ) : (
                    <AvatarFallback className="w-24 h-24 mb-4 rounded-full">
                      <FaUser size={16} />
                    </AvatarFallback>
                  )}
                </Avatar>
              </td>
              <td className="px-4 py-3">{instructor.name}</td>
              <td className="px-4 py-3">{instructor.email}</td>
              <td className="px-4 py-3">{instructor.InstructorAdditionalData?.phone || "N/A"}</td>
              <td className="px-4 py-3">{instructor.InstructorAdditionalData?.cref || "N/A"}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                  <Button title="Editar" variant="outline" onClick={() => onEdit(instructor)}>
                    <FaEdit />
                  </Button>
                  <Button title="Excluir" variant="destructive" onClick={() => onDelete(instructor)}>
                    <FaTrashAlt />
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

export default InstructorList