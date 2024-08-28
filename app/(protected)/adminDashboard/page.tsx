"use client";

import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getStudentsWithoutInstructor, getPaymentStatus } from "@/actions/stats";

type StudentData = { name: string; withInstructor: number; withoutInstructor: number };
type PaymentStatusData = { name: string; value: number };

const AdminDashboard = () => {
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [paymentStatusData, setPaymentStatusData] = useState<PaymentStatusData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const unassigned = await getStudentsWithoutInstructor();
        const paymentStatus = await getPaymentStatus();

        // Configurando dados para o gráfico de alunos
        setStudentData([
          {
            name: "Alunos",
            withInstructor: unassigned.withInstructor,
            withoutInstructor: unassigned.withoutInstructor,
          },
        ]);

        // Configurando dados para o gráfico de pagamento
        setPaymentStatusData([
          { name: "Ativo", value: paymentStatus.active },
          { name: "Sem Pagamento", value: paymentStatus.noPayment },
          { name: "Atrasado", value: paymentStatus.overdue },
        ]);
      } catch (error) {
        console.error("Erro ao buscar dados para o gráfico:", error);
      }
    }

    fetchData();
  }, []);

  const studentColors = ["#0088FE", "#FFBB28"]; // Azul e Amarelo
  const paymentColors = ["#00C49F", "#FF0000", "#FF8042"]; // Verde, Vermelho e Laranja

  return (
    <div className="min-h-screen">
      <h1 className="text-white mb-4">Admin Dashboard</h1>
      <div className="flex justify-center gap-4">
        <div className="w-1/2 bg-gray-800 p-4 shadow rounded">
          <h2 className="text-white mb-2">Alunos por Professor</h2>
          <ChartContainer
            config={{
              withInstructor: { color: studentColors[0] },
              withoutInstructor: { color: studentColors[1] },
            }}
            className="min-h-[300px] w-full"
          >
            <BarChart data={studentData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: "#ffffff" }}
              />
              <YAxis tick={{ fill: "#ffffff" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value: number, name: string) => [`${value}`, `${name}`]}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="square"
                formatter={(value) => {
                  if (value === "withInstructor") {
                    return <span style={{ color: studentColors[0] }}>Alunos com Professor</span>;
                  }
                  if (value === "withoutInstructor") {
                    return <span style={{ color: studentColors[1] }}>Alunos sem Professor</span>;
                  }
                  return value;
                }}
              />
              <Bar dataKey="withInstructor" name="Alunos com Professor" fill={studentColors[0]} radius={4} />
              <Bar dataKey="withoutInstructor" name="Alunos sem Professor" fill={studentColors[1]} radius={4} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="w-1/2 bg-gray-800 p-4 shadow rounded">
          <h2 className="text-white mb-2">Status de Pagamento dos Alunos</h2>
          <ChartContainer
            config={{
              Ativo: { color: paymentColors[0] },
              "Sem Pagamento": { color: paymentColors[1] },
              Atrasado: { color: paymentColors[2] },
            }}
            className="min-h-[300px] w-full"
          >
            <PieChart>
              <Pie
                data={paymentStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={paymentColors[index % paymentColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value: number, name: string) => {
                  const colorIndex = paymentStatusData.findIndex((d) => d.name === name);
                  return <span style={{ color: paymentColors[colorIndex] }}>{`${value}`}</span>;
                }}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => {
                  const colorIndex = paymentStatusData.findIndex((d) => d.name === value);
                  return (
                    <span style={{ color: paymentColors[colorIndex] }}>
                      {value}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
