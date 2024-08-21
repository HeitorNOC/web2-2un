"use client";

import { useState, useEffect, startTransition } from "react";
import { Role } from "@/enums/role";
import { Pager } from "@/components/pager";
import Spinner from "@/components/spinner";
import UserList from "./components/list";
import UnlinkUserModal from "./components/unlink";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import AssociateInstructorModal from "./components/link";
import { associateInstructorAction } from "@/actions/associateInstructorAction";
import { fetchUsersAction } from "@/actions/user-management";
import { fetchInstructorsAction } from "@/actions/instructor-management";

const UserManagementPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [userToUnlink, setUserToUnlink] = useState<any>(null);
  const [userToAssign, setUserToAssign] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const actualUser = useCurrentUser();
  const MAX_DATA_PAGE = 10;

  useEffect(() => {
    if (actualUser.role === Role.STUDENT) {
      router.push("/unauthorized");
    } else {
      startTransition(() => {
        fetchUsers();
        fetchInstructors()
      });
    }
  }, [page]);

  const fetchInstructors = async () => {
    setLoading(true)
    try {
      await fetchInstructorsAction().then((data: any) => {
        if (data.success) setInstructors(data.success)
      })
    } catch(e: any) {
      console.log('erro ao buscar instrutores: ', e)
    }
  }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { users, total } = await fetchUsersAction({
        role: Role.STUDENT,
        page,
        limit: MAX_DATA_PAGE,
        actualUserId: actualUser.id,
      });

      setUsers(users);
      setTotalUsers(total);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkUser = () => {
    if (!userToUnlink) return;

    startTransition(() => {
      setLoading(true);
      associateInstructorAction({ studentId: userToUnlink.id, instructorId: null })
        .then(() => {
          setUserToUnlink(null);
          fetchUsers();
        })
        .catch((error) => {
          console.error("Erro ao desassociar professor:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleAssignInstructor = (data: any) => {
    if (!userToAssign) return;

    startTransition(() => {
      setLoading(true);
      associateInstructorAction({ studentId: data.studentId, instructorId: data.instructorId })
        .then(() => {
          setUserToAssign(null);
          setIsModalOpen(false);
          fetchUsers();
        })
        .catch((error) => {
          console.error("Erro ao associar professor:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const validatePage = (page: number) => {
    return page >= 0 && page < Math.ceil(totalUsers / MAX_DATA_PAGE);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="px-6 py-6">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold">Associar Usuário a Professor</h4>
        </div>

        <div className="mt-4">
          <UserList
            users={users}
            onUnlink={(user) => setUserToUnlink(user)}
            onLink={(user) => {
              setUserToAssign(user);
              setIsModalOpen(true);
            }}
          />

          <div className="flex justify-center mt-6">
            <Pager
              itemsCount={totalUsers}
              interval={MAX_DATA_PAGE}
              handleChangePage={handleChangePage}
              validatePage={validatePage}
            />
          </div>
        </div>
      </section>

      {userToUnlink && (
        <UnlinkUserModal
          user={userToUnlink}
          onConfirm={handleUnlinkUser}
          onCancel={() => setUserToUnlink(null)}
          isOpen={!!userToUnlink}
          actualUser={userToAssign}
        />
      )}

      {userToAssign && (
        <AssociateInstructorModal
          isOpen={isModalOpen}
          user={userToAssign}
          onConfirm={handleAssignInstructor}
          onCancel={() => setIsModalOpen(false)}
          instructors={instructors}
          actualUser={actualUser}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
