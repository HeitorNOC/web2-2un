import { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UnlinkUserModalProps {
  isOpen: boolean;
  student: any | null;
  onConfirm: () => void
  onCancel: () => void;
}

const UnlinkUserModal: FC<UnlinkUserModalProps> = ({ isOpen, student, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desassociar Aluno</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja desassociar o aluno <strong>{student?.name}</strong> do instrutor? Essa ação não pode ser desfeita.
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
  );
};

export default UnlinkUserModal;