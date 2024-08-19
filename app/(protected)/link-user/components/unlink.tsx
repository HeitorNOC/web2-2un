import { FC } from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Role } from "@/enums/role"
import { AdministratorAdditionalData, InstructorAdditionalData, StudentAdditionalData, User } from "@prisma/client"

export interface UserWithRelations extends User {
  StudentAdditionalData?: StudentAdditionalData;
  InstructorAdditionalData?: InstructorAdditionalData;
  AdministratorAdditionalData?: AdministratorAdditionalData;
}

interface UnlinkUserModalProps {
  isOpen: boolean
  user: UserWithRelations | null
  actualUser: UserWithRelations
  onConfirm: () => void
  onCancel: () => void
}

const UnlinkUserModal: FC<UnlinkUserModalProps> = ({ isOpen, user, actualUser, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desassociar Usuário</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja desassociar o usuário <strong>{user?.name}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={onConfirm} disabled={actualUser.role === Role.INSTRUCTOR && actualUser.id === user?.StudentAdditionalData?.userId}>
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

export default UnlinkUserModal
