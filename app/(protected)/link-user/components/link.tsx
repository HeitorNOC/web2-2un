import { FC } from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { associateInstructorSchema } from "@/schemas"
import { Select } from "@/components/ui/selectUI"
import { User } from "@/types/next-auth"
import { Role } from "@/enums/role"

interface AssociateInstructorModalProps {
  isOpen: boolean
  user: any
  instructors: { id: string; name: string }[]
  actualUser: User
  onConfirm: (data: any) => void
  onCancel: () => void
}

interface AssociateInstructorFormData {
  instructorId: string
}

const AssociateInstructorModal: FC<AssociateInstructorModalProps> = ({ isOpen, user, instructors, actualUser, onConfirm, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AssociateInstructorFormData>({
    resolver: zodResolver(associateInstructorSchema),
  })

  const onSubmit: SubmitHandler<AssociateInstructorFormData> = (data) => {
    onConfirm({ studentId: user.id, ...data })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Associar Professor</DialogTitle>
          <DialogDescription>
            Selecione um professor para associar ao aluno <strong>{user?.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Professor</label>
              <Select
                {...register("instructorId")}
                className={`mt-1 block w-full ${errors.instructorId ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="" disabled>Selecione um professor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id} disabled={actualUser.role === Role.INSTRUCTOR && actualUser.id !== instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </Select>
              {errors.instructorId && <p className="text-red-600 text-sm">{errors.instructorId.message}</p>}
            </div>
          </div>
          <div className="mt-4">
            <DialogFooter>
              <Button type="submit">Associar</Button>
              <Button variant="outline" onClick={onCancel}>Cancelar</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AssociateInstructorModal
