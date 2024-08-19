import { FC } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewTrainingProps {
  isOpen: boolean;
  trainings: any[];
  machines: any[];
  onCancel: () => void;
}

const ViewTraining: FC<ViewTrainingProps> = ({ isOpen, trainings, machines, onCancel }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ficha de Treino</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {trainings[0].blocks.map((block: any, index: any) => (
            <div key={index} className="mt-4 p-4 border rounded-lg bg-gray-800">
              <h3 className="text-xl font-semibold mb-2">{`Bloco: ${block.name} - Tipo: ${block.type}`}</h3>
              <div className="space-y-4">
                {block.exercises.map((exercise: any, exIndex: any) => (
                  <div key={exIndex} className="p-3 border-b border-gray-700">
                    <p className="text-lg font-semibold">{`Exercício: ${exercise.name}`}</p>
                    <p>{`Máquina: ${machines.find(m => m.id === exercise.machineId)?.name || "Máquina não encontrada"}`}</p>
                    <p>{`Descrição: ${exercise.description || "Sem descrição"}`}</p>
                    <p>{`Séries: ${exercise.series} x Repetições: ${exercise.repetitions}`}</p>
                    <p>{`Carga Sugerida: ${exercise.suggestedWeight} kg`}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTraining;
