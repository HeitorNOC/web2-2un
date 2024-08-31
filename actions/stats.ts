// src/actions/stats.ts
"use server"
import { db } from "@/lib/db";
import dayjs from "dayjs";

// src/actions/stats.js

export async function getStudentsWithoutInstructor() {
  try {
    // Buscar todos os usuários com a role "STUDENT"
    const students = await db.user.findMany({
      where: {
        role: "STUDENT",
      },
      select: {
        id: true,
      },
    });

    // Buscar todos os StudentAdditionalData
    const studentAdditionalData = await db.studentAdditionalData.findMany({
      select: {
        id: true,
        userId: true,
        assignedInstructorId: true,
      },
    });

    // Contar os alunos com professor (ou seja, aqueles que têm assignedInstructorId)
    const studentsWithInstructor = studentAdditionalData.filter(
      (data) => data.assignedInstructorId !== null
    ).length;

    // Contar o total de alunos com a role "STUDENT"
    const totalStudents = students.length;

    // Alunos sem professor são o total menos os com professor
    const studentsWithoutInstructor = totalStudents - studentsWithInstructor;

    return {
      withInstructor: studentsWithInstructor,
      withoutInstructor: studentsWithoutInstructor,
    };
  } catch (error) {
    console.error("Erro ao buscar dados de alunos:", error);
    return {
      withInstructor: 0,
      withoutInstructor: 0,
    };
  }
}

export async function getPaymentStatus() {
  try {
    // Buscar todos os alunos
    const students = await db.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        StudentAdditionalData: {
          select: {
            Payment: {
              select: {
                paymentDate: true,
              },
            },
          },
        },
      },
    });

    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);


    let active = 0;
    let overdue = 0;
    let noPayment = 0;

    students.forEach(student => {
      const paymentRecords = student.StudentAdditionalData?.Payment;
      if (!paymentRecords || paymentRecords.length === 0) {
        noPayment++;
      } else {
        const latestPaymentDate = paymentRecords.reduce((latest, payment) =>
          payment.paymentDate > latest ? payment.paymentDate : latest, new Date(0)
        );

        if (latestPaymentDate >= thirtyDaysAgo) {
          active++;
        } else {
          overdue++;
        }
      }
    });

    return {
      active,
      overdue,
      noPayment,
    };
  } catch (error) {
    console.error("Erro ao buscar dados de pagamento:", error);
    return {
      active: 0,
      overdue: 0,
      noPayment: 0,
    };
  }
}
