import { currentUser } from "@/lib/auth";
import UserInfo from "@/components/user-info";
import useAuthCheck from "../../../hooks/use-auth-check";
import Spinner from "../../../components/spinner";

export default async function ServerPage() {
  const user = await currentUser();

  const { session } = useAuthCheck();

  if (!session?.user) {
    return <Spinner />
  }

  return (
    <UserInfo
      user={user}
      label="Server Page Example"
    />
  );
}
