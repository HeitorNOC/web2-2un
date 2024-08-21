'use client';

import { useEffect, useState } from "react";

import { useCurrentUser } from "../../../hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { fetchWorkoutLogs } from "../../../actions/workoutAction";
import { Eye } from "phosphor-react";


interface WorkoutLogEntry {
    id: string;
    trainingBlockId: string;
    trainingBlock: {
        name: string;
        type: string;
    };
    exercise: {
        id: string;
        name: string;
    };
    weightUsed: number | null;
    intensity: string;
    duration: number;
    createdAt: string;
}

const WorkoutLogEvolution = () => {
    const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>([]);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
    const [groupedExercises, setGroupedExercises] = useState<{ [key: string]: WorkoutLogEntry[] }>({});
    const actualUser = useCurrentUser();

    useEffect(() => {
        const loadWorkoutLogs = async () => {
            try {
                const response = await fetchWorkoutLogs(actualUser.id);
                const logs = response.map((log: any) => ({
                    ...log,
                    weightUsed: log.weightUsed ?? 0,
                    createdAt: new Date(log.createdAt).toISOString(),
                }));
                setWorkoutLogs(logs);
            } catch (error) {
                console.error("Erro ao carregar logs de treino:", error);
            }
        };

        if (actualUser.id) {
            loadWorkoutLogs();
        }
    }, [actualUser.id]);

    const handleViewBlock = (blockId: string) => {
        const selectedLogs = workoutLogs.filter(log => log.trainingBlockId === blockId);
        const grouped = selectedLogs.reduce((acc: { [key: string]: WorkoutLogEntry[] }, log) => {
            if (!acc[log.exercise.name]) {
                acc[log.exercise.name] = [];
            }
            acc[log.exercise.name].push(log);
            return acc;
        }, {});

        setGroupedExercises(grouped);
        setSelectedBlock(blockId);
    };

    // Ajuste para aceitar tanto 'duration' quanto 'weightUsed'
    const calculateMinMax = (entries: WorkoutLogEntry[], key: 'duration' | 'weightUsed') => {
        let min = Infinity, max = -Infinity;

        entries.forEach(entry => {
            const value = entry[key] || 0;
            if (value < min) min = value;
            if (value > max) max = value;
        });

        return { min, max };
    };

    const groupedBlocks = workoutLogs.reduce((acc: { [key: string]: WorkoutLogEntry[] }, log) => {
        const blockKey = log.trainingBlock.name;

        if (!acc[blockKey]) {
            acc[blockKey] = [];
        }
        acc[blockKey].push(log);

        return acc;
    }, {});

    return (
        <div className="p-4">
            {!selectedBlock ? (
                <Table className="w-full text-sm">
                    <TableHeader>
                        <TableRow>
                            <TableCell className="text-lg">Nome do Bloco</TableCell>
                            <TableCell className="text-lg">Menor Duração (min)</TableCell>
                            <TableCell className="text-lg">Maior Duração (min)</TableCell>
                            <TableCell className="text-lg">Ações</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.keys(groupedBlocks).map((blockName, index) => {
                            const { min: minDuration, max: maxDuration } = calculateMinMax(groupedBlocks[blockName], 'duration');

                            return (
                                <TableRow key={index}>
                                    <TableCell className="py-4">{blockName}</TableCell>
                                    <TableCell className="py-4">{minDuration}</TableCell>
                                    <TableCell className="py-4">{maxDuration}</TableCell>
                                    <TableCell className="py-4">
                                        <Button onClick={() => handleViewBlock(groupedBlocks[blockName][0].trainingBlockId)}>
                                            <Eye className="w-5 h-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            ) : (
                <div>
                    <h2 className="text-xl font-bold mb-4">Evolução dos Exercícios</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell>Exercício</TableCell>
                                <TableCell>Menor Peso (kg)</TableCell>
                                <TableCell>Maior Peso (kg)</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.keys(groupedExercises).map((exerciseName, index) => {
                                const { min: minWeight, max: maxWeight } = calculateMinMax(groupedExercises[exerciseName], 'weightUsed');

                                return (
                                    <TableRow key={index}>
                                        <TableCell>{exerciseName}</TableCell>
                                        <TableCell>{minWeight}</TableCell>
                                        <TableCell>{maxWeight}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Button className="mt-4" onClick={() => setSelectedBlock(null)}>Voltar</Button>
                </div>
            )}
        </div>
    );
};

export default WorkoutLogEvolution;
