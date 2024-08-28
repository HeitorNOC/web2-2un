"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/router or next/navigation based on your setup
import { useCurrentUser } from "@/hooks/use-current-user";

const Dashboard = () => {
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    if (user.role === "STUDENT") {
      // Redireciona para uma página de acesso não autorizado
      router.push("/unauthorized");
    } else if (user.role === "ADMIN") {
      // Redireciona para o dashboard do administrador
      router.push("/adminDashboard");
    } else if (user.role === "INSTRUCTOR") {
      // Redireciona para o dashboard do instrutor
      router.push("/unauthorized");
    }
  }, [user, router]);

  // Você pode retornar um loader ou um texto vazio enquanto o redirecionamento acontece
  return null;
};

export default Dashboard;
