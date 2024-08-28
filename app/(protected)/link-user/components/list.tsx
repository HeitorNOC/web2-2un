import { FC } from "react";
import { Button } from "@/components/ui/button";
import { FaLink , FaUnlink } from "react-icons/fa";
import { FaUser } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

interface UserListProps {
  users: any[];
  onLink: (user: any) => void;
  onUnlink: (user: any) => void;
}

const UserList: FC<UserListProps> = ({ users, onLink, onUnlink }) => {
  return users.length === 0 ? (
    <p className="text-center text-gray-500">Não Há alunos sem professores.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-slate-800 text-white">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-4 py-2 text-left"></th>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-700">
              <td className="px-4 py-3">
                <Avatar>
                  {user.image ? (
                    <AvatarImage src={user.image} className="w-10 h-10 mb-4 rounded-full" />
                  ) : (
                    <AvatarFallback className="w-24 h-24 mb-4 rounded-full">
                      <FaUser size={40} />
                    </AvatarFallback>
                  )}
                </Avatar>
              </td>
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                <Button title="Associar" variant="outline" onClick={() => onLink(user)}>
                  <FaLink />
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
