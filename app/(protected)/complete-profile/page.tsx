"use client"

import { useForm, SubmitHandler, FieldErrors, UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from "react"
import { completeProfileAction } from "../../../actions/complete-profile"
import { Role } from "../../../enums/role"
import { studentProfileSchema, instructorProfileSchema, adminProfileSchema } from "../../../schemas"
import useAuthCheck from "../../../hooks/use-auth-check"
import Spinner from "../../../components/spinner"

type StudentProfileFormData = {
  cpf: string
  gender: string
  phone: string
  birthDate: string
  height: string  
  weight: string  
  bodyFat: string 
  comorbidity?: string
}

type InstructorProfileFormData = {
  cpf: string
  phone: string
  cref: string
}

type AdminProfileFormData = {
  cpf: string
}

const StudentProfileForm = ({
  register,
  errors,
}: {
  register: UseFormRegister<StudentProfileFormData>
  errors: FieldErrors<StudentProfileFormData>
}) => (
  <>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Gênero:</label>
      <select {...register('gender')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white">
        <option value="">Selecione</option>
        <option value="male">Masculino</option>
        <option value="female">Feminino</option>
        <option value="other">Outro</option>
      </select>
      {errors.gender && <span className="text-red-600 text-sm">{errors.gender.message}</span>}
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Telefone:</label>
      <input type="text" {...register('phone')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white" />
      {errors.phone && <span className="text-red-600 text-sm">{errors.phone.message}</span>}
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Data de Nascimento:</label>
      <input type="date" {...register('birthDate')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white" />
      {errors.birthDate && <span className="text-red-600 text-sm">{errors.birthDate.message}</span>}
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Altura:</label>
      <input type="text" step="any" {...register('height')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white" />
      {errors.height && <span className="text-red-600 text-sm">{errors.height.message}</span>}
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Peso:</label>
      <input type="text" step="any" {...register('weight')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white" />
      {errors.weight && <span className="text-red-600 text-sm">{errors.weight.message}</span>}
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Percentual de Gordura Corporal:</label>
      <input type="text" step="any" {...register('bodyFat')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white" />
      {errors.bodyFat && <span className="text-red-600 text-sm">{errors.bodyFat.message}</span>}
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Comorbidade:</label>
      <input type="text" {...register('comorbidity')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white" />
      {errors.comorbidity && <span className="text-red-600 text-sm">{errors.comorbidity.message}</span>}
    </div>
  </>
)

const InstructorProfileForm = ({
  register,
  errors,
}: {
  register: UseFormRegister<InstructorProfileFormData>
  errors: FieldErrors<InstructorProfileFormData>
}) => (
  <>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Telefone:</label>
      <input type="text" {...register('phone')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white" />
      {errors.phone && <span className="text-red-600 text-sm">{errors.phone.message}</span>}
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">CREF:</label>
      <input type="text" {...register('cref')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white" />
      {errors.cref && <span className="text-red-600 text-sm">{errors.cref.message}</span>}
    </div>
  </>
)

const CompleteProfile = () => {
  const { session } = useAuthCheck()
  const router = useRouter()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const schema = session?.user?.role === Role.STUDENT
    ? studentProfileSchema
    : session?.user?.role === Role.INSTRUCTOR
      ? instructorProfileSchema
      : adminProfileSchema

  const { register, handleSubmit, formState: { errors } } = useForm<
    StudentProfileFormData | InstructorProfileFormData | AdminProfileFormData
  >({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<
  StudentProfileFormData | InstructorProfileFormData | AdminProfileFormData
> = (data) => {
  const userId = session?.user?.id
  const { role } = session?.user
  let additionalData = {}

  if (role === Role.STUDENT) {
    const studentData = data as StudentProfileFormData
    additionalData = {
      height: (studentData.height),
      weight: (studentData.weight),
      bodyFat: (studentData.bodyFat),
      comorbidity: studentData.comorbidity,
      gender: studentData.gender,
      phone: studentData.phone,
      birthDate: new Date(studentData.birthDate).toISOString(),
    }
  } else if (role === Role.INSTRUCTOR) {
    const instructorData = data as InstructorProfileFormData
    additionalData = {
      cref: instructorData.cref,
      phone: instructorData.phone,
    }
  }

  const submitData = async () => {
    try {
      const res = await completeProfileAction({
        userId,
        role,
        cpf: data.cpf,
        additionalData,
      })

      if (res.error) {
        setError(res.error)
      }

      if (res.success) {
        setSuccess(res.success)
      router.push('/')
      }
    } catch (e) {
      console.log(e)
      setError("Something went wrong!")
    }
  }

  submitData()
}

  if (!session?.user) {
    return <Spinner />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-white mb-6">Complete seu Cadastro</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">CPF:</label>
            <input type="text" {...register('cpf')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white" />
            {errors.cpf && <span className="text-red-600 text-sm">{errors.cpf.message}</span>}
          </div>
          {session.user.role === Role.STUDENT && (
            <StudentProfileForm register={register as UseFormRegister<StudentProfileFormData>} errors={errors as FieldErrors<StudentProfileFormData>} />
          )}
          {session.user.role === Role.INSTRUCTOR && (
            <InstructorProfileForm register={register as UseFormRegister<InstructorProfileFormData>} errors={errors as FieldErrors<InstructorProfileFormData>} />
          )}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Enviar</button>
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          {success && <p className="text-green-600 text-center mt-4">{success}</p>}
        </form>
      </div>
    </div>
  )
}

export default CompleteProfile
