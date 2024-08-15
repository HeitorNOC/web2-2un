import React, { FC, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { createInstructorSchema } from "@/schemas/index"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { FaUser } from "react-icons/fa"

interface CreateInstructorModalProps {
  isOpen: boolean
  onConfirm: (data: any) => void
  onCancel: () => void
}

type CreateInstructorFormData = z.infer<typeof createInstructorSchema>

const CreateInstructorModal: FC<CreateInstructorModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<CreateInstructorFormData>({
    resolver: zodResolver(createInstructorSchema),
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit: SubmitHandler<CreateInstructorFormData> = (data) => {
    const formattedData = {
      ...data,
      image: selectedImage,
    }
    onConfirm(formattedData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Professor</DialogTitle>
          <DialogDescription>Preencha os detalhes do novo professor abaixo.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4 rounded-full">
                    {selectedImage ? (
                        <AvatarImage src={selectedImage} className="rounded-full w-full h-full object-cover" />
                    ) : (
                        <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center bg-gray-700">
                        <FaUser size={48} />
                        </AvatarFallback>
                    )}
                </Avatar>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
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
              <label className="block text-sm font-medium">CPF</label>
              <Input
                type="text"
                {...register("cpf")}
                className={`mt-1 block w-full ${errors.cpf ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.cpf && <p className="text-red-600 text-sm">{errors.cpf.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Telefone</label>
              <Input
                type="text"
                {...register("phone")}
                className={`mt-1 block w-full ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">CREF</label>
              <Input
                type="text"
                {...register("cref")}
                className={`mt-1 block w-full ${errors.cref ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.cref && <p className="text-red-600 text-sm">{errors.cref.message}</p>}
            </div>
          </div>
          <div className="mt-4">
            <DialogFooter>
              <Button type="submit">Cadastrar</Button>
              <Button variant="outline" onClick={onCancel}>Cancelar</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateInstructorModal
