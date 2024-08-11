"use client";

import { useState, useEffect, startTransition } from "react";
import { Role } from "@/enums/role";
import { Pager } from "@/components/pager";
import Spinner from "@/components/spinner";
import UserList from "./components/list";
import DeleteUserModal from "./components/delete";
import UpdateUserModal from "./components/update";
import { fetchUsersAction, deleteUserAction, updateUserAction } from "@/actions/user-management";
import { useCurrentUser } from "@/hooks/use-current-user";

const UserManagementPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [userToEdit, setUserToEdit] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const actualUser = useCurrentUser()
    const MAX_DATA_PAGE = 10;

    useEffect(() => {
        startTransition(() => {
            fetchUsers();
        });
    }, [page, selectedRole]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { users, total } = await fetchUsersAction({
                role: selectedRole,
                page,
                limit: MAX_DATA_PAGE,
                actualUserId: actualUser.id
            });
            setUsers(users);
            setTotalUsers(total);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = () => {
        if (!userToDelete) return;

        startTransition(() => {
            setLoading(true);
            deleteUserAction(userToDelete.id).then(() => {
                setUserToDelete(null);
                fetchUsers();
            }).catch(error => {
                console.error("Erro ao excluir usuário:", error);
            }).finally(() => {
                setLoading(false);
            });
        });
    };

    const handleUpdateUser = (data: any) => {
        startTransition(() => {
            setLoading(true);
            updateUserAction(userToEdit.id, data).then(() => {
                setUserToEdit(null);
                setIsModalOpen(false);
                fetchUsers();
            }).catch(error => {
                console.error("Erro ao atualizar usuário:", error);
            }).finally(() => {
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
        <div className="container-fluid py-4">
            <section>
                <div className="row align-items-center mb-3">
                    <div className="col d-flex justify-content-between align-items-center">
                        <h4 className="m-0">Gerenciamento de Usuários</h4>
                        <select
                            className="form-select form-select-sm w-auto bg-slate-900"
                            onChange={(e) => setSelectedRole(e.target.value as Role)}
                            value={selectedRole || ""}
                        >
                            <option value="">Todos</option>
                            <option value={Role.STUDENT}>Usuários</option>
                            <option value={Role.INSTRUCTOR}>Professores</option>
                        </select>
                    </div>
                </div>

                <div className="row mt-3">
                    <UserList
                        users={users}
                        loading={loading}
                        onDelete={(user) => setUserToDelete(user)}
                        onEdit={(user) => {
                            setUserToEdit(user);
                            setIsModalOpen(true);
                        }}
                    />

                    <div className="d-flex justify-content-center mt-4">
                        <Pager
                            itemsCount={totalUsers}
                            interval={MAX_DATA_PAGE}
                            handleChangePage={handleChangePage}
                            validatePage={validatePage}
                        />
                    </div>
                </div>
            </section>

            {userToDelete && (
                <DeleteUserModal
                    user={userToDelete}
                    onConfirm={handleDeleteUser}
                    onCancel={() => setUserToDelete(null)}
                    isOpen={!!userToDelete}
                />
            )}

            {userToEdit && (
                <UpdateUserModal
                    isOpen={isModalOpen}
                    user={userToEdit}
                    onConfirm={handleUpdateUser}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default UserManagementPage;
