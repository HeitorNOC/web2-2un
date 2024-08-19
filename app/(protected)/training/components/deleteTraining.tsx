import { FC } from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteTrainingModalProps {
  isOpen: boolean
  training: any | null
  onConfirm: () => void
  onCancel: () => void
}

const DeleteTrainingModal: FC<DeleteTrainingModalProps> = ({ isOpen, training, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Treino</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir o treino do usuário <strong>{training?.name}</strong>? Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteTrainingModal
