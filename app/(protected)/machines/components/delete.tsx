import { FC } from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteMachineModalProps {
  isOpen: boolean
  machine: { id: string; name: string } | null
  onConfirm: () => void
  onCancel: () => void
}

const DeleteMachineModal: FC<DeleteMachineModalProps> = ({ isOpen, machine, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Máquina</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir a máquina <strong>{machine?.name}</strong>? Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteMachineModal;
