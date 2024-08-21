import { FC, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "../../../../components/ui/button";

interface UpdateTrainingProps {
  isOpen: boolean;
  studentId: string;
  instructorId: string;
  machines: any[];
  trainings: any[];
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

const UpdateTraining: FC<UpdateTrainingProps> = ({
  isOpen,
  studentId,
  instructorId,
  machines,
  trainings,
  onConfirm,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [blocks, setBlocks] = useState<Block[]>(trainings || []);
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number | undefined>();
  const [currentBlock, setCurrentBlock] = useState<Block>({ name: "", type: "", exercises: [] });
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  useEffect(() => {
    if (trainings && trainings.length > 0 && currentBlockIndex !== undefined) {
      const selectedBlock = trainings[0].blocks[currentBlockIndex];
      setCurrentBlock(selectedBlock);
      setCurrentExerciseIndex(0); // Start with the first exercise
      setCurrentStep(2);
    }
  }, [trainings, currentBlockIndex]);

  const handleAddExercise = () => {
    const updatedExercises = [...currentBlock.exercises, { name: "", machineId: "", description: "", suggestedWeight: "", series: "", repetitions: "" }];
    setCurrentBlock({ ...currentBlock, exercises: updatedExercises });
    setCurrentExerciseIndex(updatedExercises.length - 1); // Go to the new exercise
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < currentBlock.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleSaveBlock = async () => {
    const updatedBlocks = [...blocks];
  
    if (currentBlockIndex !== undefined && currentBlockIndex < blocks.length) {
      // Atualiza bloco existente
      updatedBlocks[currentBlockIndex] = currentBlock;
    } else {
      // Adiciona novo bloco (sem id)
      updatedBlocks.push({ ...currentBlock });
    }
  
    setBlocks(updatedBlocks);
  
    // Salva todos os blocos e fecha o modal
    try {
      await onConfirm({ studentId, instructorId, blocks: updatedBlocks });
      onCancel(); // Fecha o modal após salvar
    } catch (error) {
      console.error("Erro ao salvar bloco:", error);
    }
  };
  
  
  

  const handleSaveAll = async () => {
    try {
      await onConfirm({ studentId, instructorId, blocks });
      setBlocks([]); // Reset blocks after saving
      onCancel(); // Close the modal after saving
    } catch (error) {
      console.error("Erro ao salvar treino:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentStep === 1
              ? "Selecionar Bloco"
              : "Adicionar/Editar Exercício"}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-4">
            <h3>Selecione um bloco para editar:</h3>
            {trainings[0].blocks.map((block: any, index: any) => (
              <Button key={index} onClick={() => setCurrentBlockIndex(index)}>
                {`Bloco: ${block.name} - Tipo: ${block.type}`}
              </Button>
            ))}
            <Button onClick={() => setCurrentStep(2)}>Adicionar Novo Bloco</Button>
          </div>
        )}

        {currentStep === 2 && (
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
            <div className="space-y-4">
              {currentBlock.exercises.length > 0 && (
                <div className="flex space-between mb-4">
                  <Button onClick={handlePrevExercise} disabled={currentExerciseIndex === 0}>
                    Voltar Exercício
                  </Button>
                  <span>{`${currentExerciseIndex + 1} / ${currentBlock.exercises.length}`}</span>
                  <Button onClick={handleNextExercise} disabled={currentExerciseIndex >= currentBlock.exercises.length - 1}>
                    Próximo Exercício
                  </Button>
                </div>
              )}
              <div className="space-y-2">
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
              </div>
              <Button onClick={handleAddExercise}>Adicionar Exercício</Button>
            </div>
            <div className="flex justify-between mt-4">
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

export default UpdateTraining;
