"use client"
import { useState, useEffect, startTransition } from "react";
import { Role } from "@/enums/role";
import Spinner from "@/components/spinner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import {
  createTrainingAction,
  deleteTrainingAction,
  fetchAssociatedStudents,
  fetchMachinesAction,
  fetchTrainingsForStudent,
  updateTrainingAction,
} from "@/actions/trainingAction";

import UserList from "./components/userLIst";
import CreateTraining from "./components/createTraining";
import UpdateTraining from "./components/updateTraining";
import ViewTraining from "./components/viewTraining";
import DeleteTrainingModal from "./components/deleteTraining";

const StudentTrainingPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [machines, setMachines] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any>();
  const [modalType, setModalType] = useState<'create' | 'update' | 'view' | 'delete' | null>(null);
  const router = useRouter();
  const actualUser = useCurrentUser();

  useEffect(() => {
    if (actualUser.role !== Role.INSTRUCTOR) {
      router.push("/unauthorized");
    } else {
      startTransition(() => {
        fetchStudents();
        fetchMachines();
      });
    }
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetchAssociatedStudents(actualUser.id);
      if (response.students) {
        setStudents(response.students || []);
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const { machines } = await fetchMachinesAction({ page: 0, limit: 100 });
      setMachines(machines || []);
    } catch (error) {
      console.error("Erro ao buscar máquinas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentTrainings = async (studentId: string) => {
    setLoading(true);
    try {
      const { trainings } = await fetchTrainingsForStudent(studentId);
      setTrainings(trainings || {});
    } catch (error) {
      console.error("Erro ao buscar treinos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTraining = (student: any) => {
    setSelectedStudent(student);
    setModalType('create');
    setIsTrainingModalOpen(true);
  };

  const handleViewTraining = async (student: any) => {
    setSelectedStudent(student);
    await fetchStudentTrainings(student.id);
    setModalType('view');
    setIsTrainingModalOpen(true);
  };

  const handleEditTraining = async (student: any) => {
    setSelectedStudent(student);
    await fetchStudentTrainings(student.id);
    setModalType('update');
    setIsTrainingModalOpen(true);
  };

  const handleDeleteTraining = async (student: any) => {
    setSelectedStudent(student);
    await fetchStudentTrainings(student.id);
    setModalType('delete');
    setIsTrainingModalOpen(true);
  };

  const handleTrainingSave = async (data: any) => {
    setLoading(true);
    const trainingData = {
      studentId: selectedStudent?.id || "",
      instructorId: actualUser.id,
      blocks: data.blocks,
    };
    try {
      if (modalType === 'update') {
        await updateTrainingAction(selectedStudent.id, {
          blocks: trainingData.blocks,
        });
      } else {
        await createTrainingAction(trainingData);
      }
    } catch (error) {
      console.error("Erro ao salvar treino:", error);
    } finally {
      setLoading(false);
      setIsTrainingModalOpen(false);
      fetchStudents();
    }
  };

  const handleDeleteTrainingAction = () => {
    if (!selectedStudent) return;
    console.log('selectedStudent: ',selectedStudent)
    startTransition(() => {
      setLoading(true);
      deleteTrainingAction(selectedStudent.id)
        .then(() => {
          setSelectedStudent(null);
        })
        .catch((error: any) => {
          console.error("Erro ao excluir usuário:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="px-6 py-6">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold">Gerenciamento de Treinos</h4>
        </div>

        <div className="mt-4">
          <UserList
            users={students}
            onCreateTraining={handleCreateTraining}
            onViewTraining={handleViewTraining}
            onEditTraining={handleEditTraining}
            onDeleteTraining={handleDeleteTraining}
          />
        </div>
      </section>

      {isTrainingModalOpen && modalType === 'create' && (
        <CreateTraining
          isOpen={isTrainingModalOpen}
          studentId={selectedStudent?.id}
          instructorId={actualUser.id}
          machines={machines}
          onConfirm={handleTrainingSave}
          onCancel={() => setIsTrainingModalOpen(false)}
        />
      )}

      {isTrainingModalOpen && modalType === 'update' && (
        <UpdateTraining
          isOpen={isTrainingModalOpen}
          studentId={selectedStudent?.id}
          instructorId={actualUser.id}
          machines={machines}
          trainings={trainings}
          onConfirm={handleTrainingSave}
          onCancel={() => setIsTrainingModalOpen(false)}
        />
      )}

      {isTrainingModalOpen && modalType === 'view' && (
        <ViewTraining
          isOpen={isTrainingModalOpen}
          trainings={trainings}
          machines={machines}
          onCancel={() => setIsTrainingModalOpen(false)}
        />
      )}
      {isTrainingModalOpen && modalType === 'delete' && (
        <DeleteTrainingModal
          training={selectedStudent}
          onConfirm={handleDeleteTrainingAction}
          onCancel={() => setSelectedStudent(null)}
          isOpen={!!selectedStudent}
        />
      )}
    </div>
  );
};

export default StudentTrainingPage;
