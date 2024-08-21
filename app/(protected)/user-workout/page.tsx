'use client';

import { FC, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchTrainings, logWorkoutEntries } from "../../../actions/trainingAction";
import { useCurrentUser } from "../../../hooks/use-current-user";
import Spinner from "../../../components/spinner";
import { Role } from "../../../enums/role";
import { useRouter } from "next/navigation";

const UserWorkout: FC = () => {
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
    const [weights, setWeights] = useState<{ [key: string]: string }>({});
    const [workoutTime, setWorkoutTime] = useState("");
    const [intensity, setIntensity] = useState("moderado");
    const [trainings, setTrainings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const actualUser = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        if (actualUser.role !== Role.INSTRUCTOR) {
            router.push("/unauthorized");
        } else {

            const loadTrainings = async () => {
                setLoading(true);
                try {
                    const response = await fetchTrainings(actualUser.id);
                    if (response && response.length > 0) {
                        console.log('Treinos carregados:', response);
                        setTrainings(response);
                    } else {
                        console.error("Nenhum treino encontrado");
                    }
                } catch (error) {
                    console.error("Erro ao buscar treinos:", error);
                } finally {
                    setLoading(false);
                }
            }

            if (actualUser.id) {
                loadTrainings();
            }
        };
    }, [actualUser.id]);

    function transformWorkoutData(workoutData: {
        trainingId: string;
        blockId: string;
        weights: { [key: string]: string };
        workoutTime: string;
        intensity: string;
        userId: string;
    }): Array<{
        trainingBlockId: string;
        exerciseId: string;
        userId: string;
        weightUsed: number;
        intensity: string;
        duration: number;
    }> {
        return Object.keys(workoutData.weights).map(exerciseId => ({
            trainingBlockId: workoutData.blockId,
            exerciseId,
            userId: workoutData.userId,
            weightUsed: parseFloat(workoutData.weights[exerciseId]),
            intensity: workoutData.intensity,
            duration: parseFloat(workoutData.workoutTime),
        }));
    }

    const handleSave = async () => {
        if (!trainings.length) {
            console.error("Nenhum treino disponível");
            return;
        }

        const selectedBlock = trainings[0]?.blocks[selectedBlockIndex];

        if (!selectedBlock) {
            console.error("Nenhum bloco selecionado");
            return;
        }

        const workoutData = {
            trainingId: trainings[0].id,
            blockId: selectedBlock.id,
            weights,
            workoutTime,
            intensity,
            userId: actualUser.id,
        };

        try {
            const transformedData = transformWorkoutData(workoutData);
            await logWorkoutEntries(transformedData);
            alert("Treino salvo com sucesso!"); // Exibe uma mensagem de sucesso
        } catch (error) {
            console.error("Erro ao salvar treino:", error);
        }
    };

    if (loading) {
        return <Spinner />; // Exibe um Spinner enquanto carrega
    }

    if (!trainings.length) {
        return <h1>Você não possui treinos</h1>; // Exibe mensagem se nenhum treino for encontrado
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Registrar Treino</h1>
            <div className="space-y-4">
                <Select
                    value={selectedBlockIndex.toString()}
                    onValueChange={(value) => setSelectedBlockIndex(parseInt(value, 10))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o Bloco" />
                    </SelectTrigger>
                    <SelectContent>
                        {trainings[0]?.blocks.map((block: any, index: any) => (
                            <SelectItem key={index} value={index.toString()}>
                                {`Bloco: ${block.name} - Tipo: ${block.type}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="p-4 bg-gray-700 rounded-lg">
                    {trainings[0]?.blocks[selectedBlockIndex]?.exercises.map((exercise: any, index: any) => (
                        <div key={index} className="mb-4">
                            <h3 className="font-semibold">Exercício: {exercise.name}</h3>
                            <p>Máquina: {exercise.machine.name}</p>
                            <Input
                                placeholder="Peso utilizado (kg)"
                                value={weights[exercise.id] || ""}
                                onChange={(e) =>
                                    setWeights({ ...weights, [exercise.id]: e.target.value })
                                }
                            />
                        </div>
                    ))}
                </div>

                <Input
                    placeholder="Tempo do Treino (minutos)"
                    value={workoutTime}
                    onChange={(e) => setWorkoutTime(e.target.value)}
                />

                <Select
                    value={intensity}
                    onValueChange={setIntensity}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Intensidade do Treino" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="facil">Fácil</SelectItem>
                        <SelectItem value="moderado">Moderado</SelectItem>
                        <SelectItem value="intenso">Intenso</SelectItem>
                        <SelectItem value="muito intenso">Muito Intenso</SelectItem>
                    </SelectContent>
                </Select>

                <div className="mt-4">
                    <Button variant="outline" onClick={() => alert("Ação cancelada.")}>Cancelar</Button>
                    <Button onClick={handleSave} className="ml-2">Salvar Treino</Button>
                </div>
            </div>
        </div>
    );
};

export default UserWorkout;
