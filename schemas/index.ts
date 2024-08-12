import { Role } from "@/enums/role"
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes"
import parsePhoneNumberFromString from 'libphonenumber-js'
import * as z from "zod"

interface UserData {
  password?: string
  newPassword?: string
  newPasswordConfirmation?: string
}

const passwordRequired = (
  data: UserData,
  passwordField: keyof UserData,
  newPasswordField: keyof UserData,
  newPasswordConfirmationField: keyof UserData = "newPasswordConfirmation"
) => {
  const newPasswordEntered = data[newPasswordField] !== undefined
  const confirmationEntered = data[newPasswordConfirmationField] !== undefined

  if (newPasswordEntered && !confirmationEntered) {
    return false
  }

  return !(
    (data[passwordField] && !data[newPasswordField]) ||
    (data[newPasswordField] && !data[passwordField])
  )
}

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum(["ADMIN", "USER", "INSTRUCTOR"]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(1)),
    newPassword: z.optional(
      z.string().min(6, {
        message: "Por favor, insira uma nova senha com pelo menos 6 caracteres, obrigatório",
      })
    ),
    newPasswordConfirmation: z.optional(
      z.string().min(6, {
        message: "Por favor, confirme sua nova senha com pelo menos 6 caracteres, obrigatório",
      })
    ),
  })
  .refine((data) => passwordRequired(data, "password", "newPassword"), {
    message: "Por favor, insira uma nova senha com pelo menos 6 caracteres, obrigatório!",
    path: ["newPassword"],
  })
  .refine((data) => passwordRequired(data, "newPassword", "password"), {
    message: "Por favor, insira sua senha válida, obrigatório!",
    path: ["password"],
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["newPasswordConfirmation"],
  })

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Por favor, insira sua senha, obrigatório",
    }),
    passwordConfirmation: z.string().min(6, {
      message: "Por favor, confirme sua senha, obrigatório.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["passwordConfirmation"],
  })

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido, obrigatório.",
  }),
})

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido. E-mail é obrigatório.",
  }),
  password: z.string().min(1, {
    message: "Por favor, insira sua senha. Senha é obrigatória.",
  }),
  code: z.optional(z.string()),
})

export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "Por favor, insira seu nome, obrigatório.",
    }),
    email: z.string().email({
      message: "Por favor, insira um endereço de e-mail válido, obrigatório.",
    }),
    password: z.string().min(6, {
      message: "Por favor, insira uma senha com pelo menos 6 caracteres, obrigatório",
    }),
    passwordConfirmation: z.string().min(6, {
      message: "Por favor, confirme sua senha, obrigatório.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["passwordConfirmation"],
  })

  export const studentProfileSchema = z.object({
    cpf: z.string().min(11, "CPF deve ter no mínimo 11 caracteres").max(14, "CPF deve ter no máximo 14 caracteres"),
    gender: z.string().min(1, "Gênero é obrigatório"),
    phone: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres"),
    birthDate: z.string().min(10, "Data de Nascimento é obrigatória"),
    height: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Altura deve ser um valor positivo" }),
    weight: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Peso deve ser um valor positivo" }),
    bodyFat: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, { message: "Percentual de gordura deve estar entre 0 e 100" }),
    comorbidity: z.string().optional(),
  })
  
  export const instructorProfileSchema = z.object({
    cpf: z.string().min(11, "CPF deve ter no mínimo 11 caracteres").max(14, "CPF deve ter no máximo 14 caracteres"),
    phone: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres"),
    cref: z.string().min(5, "CREF deve ter no mínimo 5 caracteres"),
  })
  
  export const adminProfileSchema = z.object({
    cpf: z.string().min(11, "CPF deve ter no mínimo 11 caracteres").max(14, "CPF deve ter no máximo 14 caracteres"),
  })


  export const userUpdateSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    role: z.nativeEnum(Role, { errorMap: () => ({ message: "Role inválido" }) }),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Número de telefone inválido")
      .optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    birthDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Data de nascimento inválida",
      })
      .optional(),
  })

export const createMachineSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  acquisitionDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)) && new Date(date) <= new Date(), {
      message: "Data de aquisição inválida ou no futuro",
    }),
  status: z.string().min(1, "Status é obrigatório"),
});

export const updateMachineSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  serialNumber: z.string().min(1, "Número de série é obrigatório").optional(),
  acquisitionDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)) && new Date(date) <= new Date(), {
      message: "Data de aquisição inválida ou no futuro",
    })
    .optional(),
  status: z.string().min(1, "Status é obrigatório").optional(),
});