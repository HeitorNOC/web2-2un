import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { auth } from "@/auth";
import Sidebar from "./_components/sidebar";

export const metadata = {
  title: "Protected Routes",
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return (
    <SessionProvider session={session}>
      <ProtectedContent>{children}</ProtectedContent>
    </SessionProvider>
  );
}

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (session) {
        const userId = session.user.id;
        const { data } = await axios.get(`/api/verify-user/${userId}`);
        
        if (!data.isComplete) {
          router.push("/complete-profile");
        } else if (!data.hasActivePayment) {
          router.push("/payment");
        } else if (!data.hasAccess) {
          router.push("/unauthorized");
        } else {
          setLoading(false);
        }
      }
    };
    checkAccess();
  }, [session]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex items-center justify-center mx-4 my-6 lg:mt-20">
        {children}
      </div>
    </>
  );
}

