"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useCurrentUser } from "@/hooks/use-current-user";

const Dashboard = () => {
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    if (user.role === "STUDENT") {
      router.push("/unauthorized");
    } else if (user.role === "ADMIN") {
      router.push("/adminDashboard");
    } else if (user.role === "INSTRUCTOR") {
      router.push("/unauthorized");
    }
  }, [user, router]);
  return null;
};

export default Dashboard;
