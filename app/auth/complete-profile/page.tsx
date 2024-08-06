import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler, FieldErrors, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { studentProfileSchema, instructorProfileSchema, adminProfileSchema } from '@/schemas/index';
import { Role } from '@/enums/role';
import { startTransition } from 'react';
import { completeProfileAction } from '@/actions/complete-profile';

type StudentProfileFormData = {
  cpf: string;
  height: number;
  weight: number;
  bodyFat: number;
  comorbidity?: string;
};

type InstructorProfileFormData = {
  cpf: string;
  cref: string;
};

type AdminProfileFormData = {
  cpf: string;
};

const StudentProfileForm = ({
  register,
  errors,
}: {
  register: UseFormRegister<StudentProfileFormData>;
  errors: FieldErrors<StudentProfileFormData>;
}) => (
  <>
    <label>
      Altura:
      <input type="number" {...register('height')} required />
      {errors.height && <span>{errors.height.message}</span>}
    </label>
    <label>
      Peso:
      <input type="number" {...register('weight')} required />
      {errors.weight && <span>{errors.weight.message}</span>}
    </label>
    <label>
      Percentual de Gordura Corporal:
      <input type="number" {...register('bodyFat')} required />
      {errors.bodyFat && <span>{errors.bodyFat.message}</span>}
    </label>
    <label>
      Comorbidade:
      <input type="text" {...register('comorbidity')} />
      {errors.comorbidity && <span>{errors.comorbidity.message}</span>}
    </label>
  </>
);

const InstructorProfileForm = ({
  register,
  errors,
}: {
  register: UseFormRegister<InstructorProfileFormData>;
  errors: FieldErrors<InstructorProfileFormData>;
}) => (
  <label>
    CREF:
    <input type="text" {...register('cref')} required />
    {errors.cref && <span>{errors.cref.message}</span>}
  </label>
);

const CompleteProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const schema = session?.user?.role === Role.STUDENT
    ? studentProfileSchema
    : session?.user?.role === Role.INSTRUCTOR
    ? instructorProfileSchema
    : adminProfileSchema;

  const { register, handleSubmit, formState: { errors } } = useForm<
    StudentProfileFormData | InstructorProfileFormData | AdminProfileFormData
  >({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<
    StudentProfileFormData | InstructorProfileFormData | AdminProfileFormData
  > = (data) => {
    const userId = session?.user?.id;
    const { role } = session?.user;
    let additionalData = {};

    if (role === Role.STUDENT) {
      const studentData = data as StudentProfileFormData;
      additionalData = {
        height: parseFloat(studentData.height.toString()),
        weight: parseFloat(studentData.weight.toString()),
        bodyFat: parseFloat(studentData.bodyFat.toString()),
        comorbidity: studentData.comorbidity,
      };
    } else if (role === Role.INSTRUCTOR) {
      const instructorData = data as InstructorProfileFormData;
      additionalData = {
        cref: instructorData.cref,
      };
    }

    startTransition(() => {
      completeProfileAction({
        userId,
        role,
        cpf: data.cpf,
        additionalData,
      });
      router.push('/');
    });
  };

  return (
    <div className="complete-profile-container">
      <h1>Complete seu Cadastro</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          CPF:
          <input type="text" {...register('cpf')} required />
          {errors.cpf && <span>{errors.cpf.message}</span>}
        </label>
        {session?.user?.role === Role.STUDENT && (
          <StudentProfileForm register={register as UseFormRegister<StudentProfileFormData>} errors={errors as FieldErrors<StudentProfileFormData>} />
        )}
        {session?.user?.role === Role.INSTRUCTOR && (
          <InstructorProfileForm register={register as UseFormRegister<InstructorProfileFormData>} errors={errors as FieldErrors<InstructorProfileFormData>} />
        )}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default CompleteProfile;
