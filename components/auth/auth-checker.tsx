"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return; 

    const checkAccess = async () => {
      if (session) {
        const userId = session.user.id;

        try {
          const { data } = await axiosInstance.get(`/api/verify-user/${userId}`);

          if (!data.isComplete) {
            router.push("/completeProfile");
          } else if (!data.hasActivePayment) {
            router.push("/payment");
          } else if (!data.hasAccess) {
            router.push("/unauthorized");
          } else {
            setLoading(false);
          }
        } catch (error: any) {
          console.error('Error fetching user verification:', error.response?.data || error.message);
          router.push("/error"); 
        }
      } else {
        router.push("/auth/login"); 
      }
    };

    checkAccess();
  }, [session, status, router]);

  if (loading || status === "loading") {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default AuthChecker;
