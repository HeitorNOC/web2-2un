"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserProfileSchema,
  StudentProfileSchema,
  InstructorProfileSchema,
  AdminProfileSchema,
} from "@/schemas";
import { getUserProfile, updateUserProfile } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react"; 
import { Spinner } from "phosphor-react";
import { useCurrentUser } from "@/hooks/use-current-user";

const UserProfile = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAdditionalFields, setShowAdditionalFields] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFromCredentials, setIsFromCredentials] = useState<boolean>(false)

  const { data: session } = useSession();
  const currentUser = useCurrentUser();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserProfileSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (currentUser.id) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    if (!currentUser) {
      return;
    }
    setLoading(true);
    try {
      const profile = await getUserProfile(currentUser.id);
      if (profile) {
        reset(profile);
        setUserImage(profile.image || null);
        setRole(profile.role);
        setIsFromCredentials(profile.credentials)
        console.log('cred: ', profile.credentials)
      }
    } catch (error) {
      console.error("Erro ao carregar perfil do usuário:", error);
      setErrorMessage("Erro ao carregar perfil do usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const updatedData = {
        ...data,
        image: userImage,
        role: role,
      };

      // Atualize o perfil do usuário no banco de dados
      await updateUserProfile({ userId: currentUser.id, data: updatedData });

      setSuccessMessage("Perfil atualizado com sucesso.");
      setErrorMessage(null);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setSuccessMessage(null);
      setErrorMessage("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    fetchProfile();
  };

  const handleLoadMore = () => {
    setShowAdditionalFields(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-32 h-32">
              {userImage ? (
                <AvatarImage
                  src={userImage}
                  alt="User Avatar"
                  className="w-full h-full rounded-full"
                />
              ) : (
                <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-700 rounded-full">
                  <FaUser className="h-6 w-6" />
                </AvatarFallback>
              )}
            </Avatar>
            {
              isFromCredentials ? (<div className="flex space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="upload-image"
              />
              <label
                htmlFor="upload-image"
                className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
              >
                {userImage ? "Editar Foto" : "Enviar Foto"}
              </label>
              {userImage && (
                <button
                  type="button"
                  onClick={() => setUserImage(null)}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Apagar Foto
                </button>
              )}
            </div>) : (<></>)
            }
            
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Nome</label>
                <Input type="text" disabled={!isFromCredentials} {...register("name")} />
                {errors.name && (
                  <span className="text-red-600 text-sm">{errors.name.message?.toString()}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <Input type="email" disabled={!isFromCredentials} {...register("email")} />
                {errors.email && (
                  <span className="text-red-600 text-sm">{errors.email.message?.toString()}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">CPF</label>
                <Input type="text" {...register("cpf")} />
                {errors.cpf && (
                  <span className="text-red-600 text-sm">{errors.cpf.message?.toString()}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Telefone</label>
                <Input type="text" {...register("phone")} />
                {errors.phone && (
                  <span className="text-red-600 text-sm">{errors.phone.message?.toString()}</span>
                )}
              </div>
              {
                showAdditionalFields && role === "INSTRUCTOR" && (
                  <>
                    <div>
                    <label className="block text-sm font-bold mb-2">CREF</label>
                    <Input type="text" {...register("cref")} />
                    {errors.cref && (
                      <span className="text-red-600 text-sm">{errors.cref.message?.toString()}</span>
                    )}
                    </div>
                  </>
                )
              }
              {showAdditionalFields && role === "STUDENT" && (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-2">Gênero</label>
                    <Input type="text" {...register("gender")} />
                    {errors.gender && (
                      <span className="text-red-600 text-sm">{errors.gender.message?.toString()}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Data de Nascimento</label>
                    <Input type="date" {...register("birthDate")} />
                    {errors.birthDate && (
                      <span className="text-red-600 text-sm">{errors.birthDate.message?.toString()}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Altura</label>
                    <Input type="text" {...register("height")} />
                    {errors.height && (
                      <span className="text-red-600 text-sm">{errors.height.message?.toString()}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Peso</label>
                    <Input type="text" {...register("weight")} />
                    {errors.weight && (
                      <span className="text-red-600 text-sm">{errors.weight.message?.toString()}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Percentual de Gordura</label>
                    <Input type="text" {...register("bf")} />
                    {errors.bf && (
                      <span className="text-red-600 text-sm">{errors.bf.message?.toString()}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Comorbidades</label>
                    <Input type="text" {...register("comorbidity")} />
                    {errors.comorbidity && (
                      <span className="text-red-600 text-sm">{errors.comorbidity.message?.toString()}</span>
                    )}
                  </div>
                </>
              )}
            </div>
            {!showAdditionalFields && (role === "STUDENT" || role === "INSTRUCTOR") && (
              <Button type="button" onClick={handleLoadMore} className="mt-4 bg-gray-500 text-white">
                Carregar Mais
              </Button>
            )}
            <div className="flex justify-end mt-6 space-x-4">
              <Button type="submit" className="bg-blue-500 text-white">
                Salvar
              </Button>
              <Button type="button" className="bg-gray-500 text-white" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default UserProfile;
