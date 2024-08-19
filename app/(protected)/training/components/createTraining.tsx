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
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const handleSaveBlock = () => {
    const updatedBlocks = [...blocks];
    updatedBlocks.push(currentBlock);
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
              value={currentBlock.exercises[currentExerciseIndex]?.name || ""}
              onChange={(e) => {
                const updatedExercises = [...currentBlock.exercises];
                updatedExercises[currentExerciseIndex] = { ...updatedExercises[currentExerciseIndex], name: e.target.value };
                setCurrentBlock({ ...currentBlock, exercises: updatedExercises });
              }}
            />
            <Select
              value={currentBlock.exercises[currentExerciseIndex]?.machineId || ""}
              onValueChange={(value) => {
                const updatedExercises = [...currentBlock.exercises];
                updatedExercises[currentExerciseIndex] = { ...updatedExercises[currentExerciseIndex], machineId: value };
                setCurrentBlock({ ...currentBlock, exercises: updatedExercises });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a Máquina" />
              </SelectTrigger>
              <SelectContent>
                {machines.map((machine) => (
                  <SelectItem key={machine.id} value={machine.id}>{machine.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Descrição"
              value={currentBlock.exercises[currentExerciseIndex]?.description || ""}
              onChange={(e) => {
                const updatedExercises = [...currentBlock.exercises];
                updatedExercises[currentExerciseIndex] = { ...updatedExercises[currentExerciseIndex], description: e.target.value };
                setCurrentBlock({ ...currentBlock, exercises: updatedExercises });
              }}
            />
            <div className="flex space-x-2">
              <Input
                placeholder="Séries"
                value={currentBlock.exercises[currentExerciseIndex]?.series || ""}
                onChange={(e) => {
                  const updatedExercises = [...currentBlock.exercises];
                  updatedExercises[currentExerciseIndex] = { ...updatedExercises[currentExerciseIndex], series: e.target.value };
                  setCurrentBlock({ ...currentBlock, exercises: updatedExercises });
                }}
              />
              <span>x</span>
              <Input
                placeholder="Repetições"
                value={currentBlock.exercises[currentExerciseIndex]?.repetitions || ""}
                onChange={(e) => {
                  const updatedExercises = [...currentBlock.exercises];
                  updatedExercises[currentExerciseIndex] = { ...updatedExercises[currentExerciseIndex], repetitions: e.target.value };
                  setCurrentBlock({ ...currentBlock, exercises: updatedExercises });
                }}
              />
            </div>
            <Input
              placeholder="Carga Sugerida"
              value={currentBlock.exercises[currentExerciseIndex]?.suggestedWeight || ""}
              onChange={(e) => {
                const updatedExercises = [...currentBlock.exercises];
                updatedExercises[currentExerciseIndex] = { ...updatedExercises[currentExerciseIndex], suggestedWeight: e.target.value };
                setCurrentBlock({ ...currentBlock, exercises: updatedExercises });
              }}
            />
            <div className="flex justify-between mt-4">
              <Button onClick={() => setCurrentStep(1)}>Voltar</Button>
              <Button variant="outline" onClick={handleSaveBlock}>Salvar Bloco</Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={handleSaveAll}>Salvar Tudo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTraining;
