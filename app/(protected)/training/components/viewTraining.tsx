import { FC, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ViewTrainingProps {
  isOpen: boolean;
  trainings: any[];
  onCancel: () => void;
}

const ViewTraining: FC<ViewTrainingProps> = ({ isOpen, trainings, onCancel }) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ficha de Treino</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={selectedBlockIndex.toString()}
            onValueChange={(value) => setSelectedBlockIndex(parseInt(value, 10))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Bloco" />
            </SelectTrigger>
            <SelectContent>
              {trainings[0].blocks.map((block: any, index: any) => (
                <SelectItem key={index} value={index.toString()}>
                  {`Bloco: ${block.name} - Tipo: ${block.type}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="p-4 bg-gray-700 rounded-lg">
            {trainings[0].blocks[selectedBlockIndex].exercises.map((exercise: any, index: any) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">Exercício: {exercise.name}</h3>
                <p>Máquina: {exercise.machine.name}</p>
                <p>Descrição: {exercise.description}</p>
                <p>Séries: {exercise.series} x Repetições: {exercise.repetitions}</p>
                <p>Carga Sugerida: {exercise.suggestedWeight} kg</p>
                {index < trainings[0].blocks[selectedBlockIndex].exercises.length - 1 && (
                  <div className="border-t border-gray-500 my-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onCancel}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTraining;
