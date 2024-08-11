import { FC } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/next-auth";

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserList: FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  return users.length === 0 ? (
    <p className="text-center text-gray-500">Não há usuários cadastrados.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-slate-800 text-white">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-700">
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => onEdit(user)}>
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={() => onDelete(user)}>
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
