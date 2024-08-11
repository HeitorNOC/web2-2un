import { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteUserModalProps {
  isOpen: boolean;
  user: { id: string; name: string } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteUserModal: FC<DeleteUserModalProps> = ({ isOpen, user, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Usuário</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir o usuário <strong>{user?.name}</strong>? Essa ação não pode ser desfeita.
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
  );
};

export default DeleteUserModal;
