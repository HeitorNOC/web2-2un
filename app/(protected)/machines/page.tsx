"use client"

import { useState, useEffect, startTransition } from "react"
import { Pager } from "@/components/pager"
import Spinner from "@/components/spinner"
import MachineList from "./components/list"
import DeleteMachineModal from "./components/delete"
import UpdateMachineModal from "./components/update"
import CreateMachineModal from "./components/create"
import { fetchMachinesAction, deleteMachineAction, updateMachineAction, createMachineAction } from "@/actions/machines-management"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Role } from "@/enums/role"

const MachineManagementPage = () => {
  const [machines, setMachines] = useState<any[]>([])
  const [totalMachines, setTotalMachines] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [machineToDelete, setMachineToDelete] = useState<any>(null)
  const [machineToEdit, setMachineToEdit] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const router = useRouter()
  const actualUser = useCurrentUser()
  const MAX_DATA_PAGE = 10

  useEffect(() => {
    if(actualUser.role != Role.ADMIN){
      router.push('/unauthorized')
    }else{
      startTransition(() => {
        fetchMachines()
      })
    }
  }, [page, selectedStatus])

  const fetchMachines = async () => {
    setLoading(true)
    try {
      const { machines, total } = await fetchMachinesAction({
        page,
        limit: MAX_DATA_PAGE,
        status: selectedStatus, 
      })
      setMachines(machines)
      setTotalMachines(total)
    } catch (error) {
      console.error("Erro ao buscar máquinas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMachine = () => {
    if (!machineToDelete) return

    startTransition(() => {
      setLoading(true)
      deleteMachineAction(machineToDelete.id)
        .then(() => {
          setMachineToDelete(null)
          fetchMachines()
        })
        .catch((error) => {
          console.error("Erro ao excluir máquina:", error)
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const handleUpdateMachine = (data: any) => {
    startTransition(() => {
      setLoading(true)
      updateMachineAction(machineToEdit.id, data)
        .then(() => {
          setMachineToEdit(null)
          setIsModalOpen(false)
          fetchMachines()
        })
        .catch((error) => {
          console.error("Erro ao atualizar máquina:", error)
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const handleCreateMachine = (data: any) => {
    startTransition(() => {
      setLoading(true)
      createMachineAction(data)
        .then(() => {
          setIsCreateModalOpen(false)
          fetchMachines()
        })
        .catch((error) => {
          console.error("Erro ao criar máquina:", error)
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const handleChangePage = (newPage: number) => {
    setPage(newPage)
  }

  const validatePage = (page: number) => {
    return page >= 0 && page < Math.ceil(totalMachines / MAX_DATA_PAGE)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="px-6 py-6">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold">Gerenciamento de Máquinas</h4>
          <div className="flex items-center">
            <select
              className="bg-slate-900 text-white rounded-md p-2 mr-4"
              onChange={(e) => setSelectedStatus(e.target.value)}
              value={selectedStatus || ""}
            >
              <option value="">Todos</option>
              <option value="WORKING">Em Funcionamento</option>
              <option value="MAINTENANCE">Em Manutenção</option>
              <option value="OUT_OF_SERVICE">Fora de Serviço</option>
            </select>
            <Button onClick={() => setIsCreateModalOpen(true)}>Cadastrar Máquina</Button>
          </div>
        </div>

        <div className="mt-4">
          {machines.length > 0 ? (
            <>
              <MachineList
                machines={machines}
                onDelete={(machine) => setMachineToDelete(machine)}
                onEdit={(machine) => {
                  setMachineToEdit(machine)
                  setIsModalOpen(true)
                }}
              />

              <div className="flex justify-center mt-6">
                <Pager
                  itemsCount={totalMachines}
                  interval={MAX_DATA_PAGE}
                  handleChangePage={handleChangePage}
                  validatePage={validatePage}
                />
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Nenhuma máquina cadastrada. Use o botão acima para cadastrar uma nova máquina.</p>
          )}
        </div>
      </section>

      {machineToDelete && (
        <DeleteMachineModal
          machine={machineToDelete}
          onConfirm={handleDeleteMachine}
          onCancel={() => setMachineToDelete(null)}
          isOpen={!!machineToDelete}
        />
      )}

      {machineToEdit && (
        <UpdateMachineModal
          isOpen={isModalOpen}
          machine={machineToEdit}
          onConfirm={handleUpdateMachine}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      {isCreateModalOpen && (
        <CreateMachineModal
          isOpen={isCreateModalOpen}
          onConfirm={handleCreateMachine}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  )
}

export default MachineManagementPage
