"use client"

import { useState, useEffect, startTransition } from "react"
import { Pager } from "@/components/pager"
import Spinner from "@/components/spinner"
import InstructorList from "./components/list"
import DeleteInstructorModal from "./components/delete"
import UpdateInstructorModal from "./components/update"
import CreateInstructorModal from "./components/create"
import { getInstructors, deleteInstructor, updateInstructor, createInstructor } from "@/actions/instructor-management"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Role } from "@/enums/role"

const InstructorManagementPage = () => {
  const [instructors, setInstructors] = useState<any[]>([])
  const [filteredInstructors, setFilteredInstructors] = useState<any[]>([])
  const [totalInstructors, setTotalInstructors] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [instructorToDelete, setInstructorToDelete] = useState<any>(null)
  const [instructorToEdit, setInstructorToEdit] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const actualUser = useCurrentUser()
  const MAX_DATA_PAGE = 10

  useEffect(() => {
    if (actualUser.role !== Role.ADMIN) {
      router.push('/unauthorized')
    } else {
      startTransition(() => {
        fetchInstructors()
      })
    }
  }, [page])

  useEffect(() => {
    const filtered = instructors.filter(instructor =>
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredInstructors(filtered)
  }, [searchQuery, instructors])

  const fetchInstructors = async () => {
    setLoading(true)
    try {
      const { instructors, total } = await getInstructors()
      setInstructors(instructors)
      setTotalInstructors(total)
      setFilteredInstructors(instructors)
    } catch (error) {
      console.error("Erro ao buscar professores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInstructor = () => {
    if (!instructorToDelete) return

    startTransition(() => {
      setLoading(true)
      deleteInstructor(instructorToDelete.id)
        .then(() => {
          setInstructorToDelete(null)
          fetchInstructors()
        })
        .catch((error) => {
          console.error("Erro ao excluir professor:", error)
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const handleUpdateInstructor = (data: any) => {
    startTransition(() => {
      setLoading(true)
      updateInstructor(instructorToEdit.id, data)
        .then(() => {
          setInstructorToEdit(null)
          setIsModalOpen(false)
          fetchInstructors()
        })
        .catch((error) => {
          console.error("Erro ao atualizar professor:", error)
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const handleCreateInstructor = (data: any) => {
    startTransition(() => {
      setLoading(true)
      createInstructor(data)
        .then(() => {
          setIsCreateModalOpen(false)
          fetchInstructors()
        })
        .catch((error) => {
          console.error("Erro ao criar professor:", error)
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
    return page >= 0 && page < Math.ceil(totalInstructors / MAX_DATA_PAGE)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="px-6 py-6">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold">Gerenciamento de Professores</h4>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Pesquisar por nome"
              className="bg-slate-900 text-white rounded-md p-2 mr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={() => setIsCreateModalOpen(true)}>Cadastrar Professor</Button>
          </div>
        </div>

        <div className="mt-4">
          {filteredInstructors.length > 0 ? (
            <>
              <InstructorList
                instructors={filteredInstructors}
                onDelete={(instructor) => setInstructorToDelete(instructor)}
                onEdit={(instructor) => {
                  setInstructorToEdit(instructor)
                  setIsModalOpen(true)
                }}
              />

              <div className="flex justify-center mt-6">
                <Pager
                  itemsCount={totalInstructors}
                  interval={MAX_DATA_PAGE}
                  handleChangePage={handleChangePage}
                  validatePage={validatePage}
                />
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Nenhum professor cadastrado. Use o botão acima para cadastrar um novo professor.</p>
          )}
        </div>
      </section>

      {instructorToDelete && (
        <DeleteInstructorModal
          instructor={instructorToDelete}
          onConfirm={handleDeleteInstructor}
          onCancel={() => setInstructorToDelete(null)}
          isOpen={!!instructorToDelete}
        />
      )}

      {instructorToEdit && (
        <UpdateInstructorModal
          isOpen={isModalOpen}
          instructor={instructorToEdit}
          onConfirm={handleUpdateInstructor}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      {isCreateModalOpen && (
        <CreateInstructorModal
          isOpen={isCreateModalOpen}
          onConfirm={handleCreateInstructor}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  )
}

export default InstructorManagementPage
