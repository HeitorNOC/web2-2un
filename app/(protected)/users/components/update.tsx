import { FC } from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userUpdateSchema } from "@/schemas"
import { Select } from "@/components/ui/selectUI"


interface UpdateUserModalProps {
  isOpen: boolean
  user: any
  onConfirm: (data: any) => void
  onCancel: () => void
}

interface UpdateUserFormData {
  name: string
  email: string
  role: string
}

const UpdateUserModal: FC<UpdateUserModalProps> = ({ isOpen, user, onConfirm, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    }
  })

  const onSubmit: SubmitHandler<UpdateUserFormData> = (data) => {
    onConfirm(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Usuário</DialogTitle>
          <DialogDescription>Atualize as informações do usuário abaixo.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nome</label>
              <Input
                type="text"
                {...register("name")}
                className={`mt-1 block w-full ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                {...register("email")}
                className={`mt-1 block w-full ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Role</label>
              <Select
                {...register("role")}
                className={`mt-1 block w-full ${errors.role ? "border-red-500" : "border-gray-300"}`}>
                <option className="bg-black text-white" value="STUDENT">Usuário</option>
                <option className="bg-black text-white" value="INSTRUCTOR">Professor</option>
              </Select>
              {errors.role && <p className="text-red-600 text-sm">{errors.role.message}</p>}
            </div>
          </div>
          <div className="mt-4">
          <DialogFooter>
            <Button type="submit">Atualizar</Button>
            <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateUserModal
