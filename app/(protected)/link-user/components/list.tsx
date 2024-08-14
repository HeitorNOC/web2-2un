import { FC } from "react";
import { Button } from "@/components/ui/button";
import { FaLink , FaUnlink } from "react-icons/fa";

interface UserListProps {
  users: any[];
  onLink: (user: any) => void;
  onUnlink: (user: any) => void;
}

const UserList: FC<UserListProps> = ({ users, onLink, onUnlink }) => {
  return users.length === 0 ? (
    <p className="text-center text-gray-500">Não há usuários cadastrados.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-slate-800 text-white">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-700">
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                <Button title="Associar" variant="outline" onClick={() => onLink(user)}>
                  <FaLink />
                </Button>
                <Button title="Desassociar" variant="destructive" onClick={() => onUnlink(user)}>
                  <FaUnlink/>
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
