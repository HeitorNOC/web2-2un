import React, { FC } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { createMachineSchema } from "@/schemas/index"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { Select } from "@/components/ui/selectUI"

interface CreateMachineModalProps {
  isOpen: boolean
  onConfirm: (data: any) => void
  onCancel: () => void
}

type CreateMachineFormData = z.infer<typeof createMachineSchema>;

const CreateMachineModal: FC<CreateMachineModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateMachineFormData>({
    resolver: zodResolver(createMachineSchema),
  });

  const onSubmit: SubmitHandler<CreateMachineFormData> = (data) => {
    const formattedData = {
      ...data,
      acquisitionDate: new Date(data.acquisitionDate).toISOString(),
    }
    onConfirm(formattedData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Máquina</DialogTitle>
          <DialogDescription>Preencha os detalhes da nova máquina abaixo.</DialogDescription>
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
              <label className="block text-sm font-medium">Número de Série</label>
              <Input
                type="text"
                {...register("serialNumber")}
                className={`mt-1 block w-full ${errors.serialNumber ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.serialNumber && <p className="text-red-600 text-sm">{errors.serialNumber.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Data de Aquisição</label>
              <Input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...register("acquisitionDate")}
                className={`mt-1 block w-full ${errors.acquisitionDate ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.acquisitionDate && <p className="text-red-600 text-sm">{errors.acquisitionDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <Select
                {...register("status", { required: "Status é obrigatório" })}
                className={`mt-1 block w-full ${errors.status ? "border-red-500" : "border-gray-300"}`}>
                <option className="bg-black text-white" value="WORKING">Em Funcionamento</option>
                <option className="bg-black text-white" value="MAINTENANCE">Em Manutenção</option>
                <option className="bg-black text-white" value="OUT_OF_SERVICE">Fora de Serviço</option>
              </Select>
              {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}
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
  );
};

export default CreateMachineModal;
