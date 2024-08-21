import { FC, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface CreateTrainingProps {
  isOpen: boolean;
  studentId: string;
  instructorId: string;
  machines: any[];
  onConfirm: (data: any) => Promise<void>;
  onCancel: () => void;
}

interface Exercise {
  name: string;
  machineId: string;
  description: string;
  suggestedWeight: string;
  series: string;
  repetitions: string;
}

interface Block {
  name: string;
  type: string;
  exercises: Exercise[];
}

const CreateTraining: FC<CreateTrainingProps> = ({
  isOpen,
  studentId,
  instructorId,
  machines,
  onConfirm,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block>({ name: "", type: "", exercises: [] });
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: "",
    machineId: "",
    description: "",
    suggestedWeight: "",
    series: "",
    repetitions: "",
  });

  const handleSaveExercise = () => {
    setCurrentBlock({
      ...currentBlock,
      exercises: [...currentBlock.exercises, currentExercise],
    });
    setCurrentExercise({
      name: "",
      machineId: "",
      description: "",
      suggestedWeight: "",
      series: "",
      repetitions: "",
    });
  };

  const handleSaveBlock = () => {
    const updatedBlocks = [...blocks, currentBlock];
    setBlocks(updatedBlocks);
    setCurrentBlock({ name: "", type: "", exercises: [] });
    setCurrentStep(1);
  };

  const handleSaveAll = async () => {
    try {
      await onConfirm({ studentId, instructorId, blocks });
      setBlocks([]);
      onCancel();
    } catch (error) {
      console.error("Erro ao salvar treino:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Definir Bloco</DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-4">
            <Input
              placeholder="Nome do Bloco"
              value={currentBlock.name}
              onChange={(e) => setCurrentBlock({ ...currentBlock, name: e.target.value })}
            />
            <Select
              value={currentBlock.type}
              onValueChange={(value) => setCurrentBlock({ ...currentBlock, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo do Bloco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superior">Superior</SelectItem>
                <SelectItem value="inferior">Inferior</SelectItem>
                <SelectItem value="aerobico">Aeróbico</SelectItem>
                <SelectItem value="fullbody">Full Body</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setCurrentStep(2)}>Próximo</Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <Input
              placeholder="Nome do Exercício"
              value={currentExercise.name}
              onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
            />
            <Select
              value={currentExercise.machineId}
              onValueChange={(value) => setCurrentExercise({ ...currentExercise, machineId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a Máquina" />
              </SelectTrigger>
              <SelectContent>
                {machines.map((machine) => (
                  <SelectItem key={machine.id} value={machine.id}>
                    {machine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Descrição"
              value={currentExercise.description}
              onChange={(e) => setCurrentExercise({ ...currentExercise, description: e.target.value })}
            />
            <div className="flex space-x-2">
              <Input
                placeholder="Séries"
                value={currentExercise.series}
                onChange={(e) => setCurrentExercise({ ...currentExercise, series: e.target.value })}
              />
              <span>x</span>
              <Input
                placeholder="Repetições"
                value={currentExercise.repetitions}
                onChange={(e) => setCurrentExercise({ ...currentExercise, repetitions: e.target.value })}
              />
            </div>
            <Input
              placeholder="Carga Sugerida"
              value={currentExercise.suggestedWeight}
              onChange={(e) => setCurrentExercise({ ...currentExercise, suggestedWeight: e.target.value })}
            />
            <div className="flex justify-between mt-4">
              <Button onClick={handleSaveExercise}>Salvar Exercício</Button>
              <Button variant="outline" onClick={handleSaveBlock}>
                Salvar Bloco
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSaveAll}>Salvar Tudo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTraining;
