import { FC } from "react"
import { Button } from "@/components/ui/button"
import { FaEdit, FaTrashAlt } from "react-icons/fa"

interface MachineListProps {
  machines: any[]
  onEdit: (machine: any) => void
  onDelete: (machine: any) => void
}

const MachineList: FC<MachineListProps> = ({ machines, onEdit, onDelete }) => {
  return machines.length === 0 ? (
    <p className="text-center text-gray-500">Não há máquinas cadastradas.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-slate-800 text-white">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Número de Série</th>
            <th className="px-4 py-2 text-left">Data de Aquisição</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr key={machine.id} className="border-t border-slate-700">
              <td className="px-4 py-3">{machine.name}</td>
              <td className="px-4 py-3">{machine.serialNumber}</td>
              <td className="px-4 py-3">{new Date(machine.acquisitionDate).toLocaleDateString()}</td>
              <td className="px-4 py-3">{machine.status}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                  <Button title="Editar" variant="outline" onClick={() => onEdit(machine)}>
                    <FaEdit />
                  </Button>
                  <Button title="Excluir" variant="destructive" onClick={() => onDelete(machine)}>
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

export default MachineList
