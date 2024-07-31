import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import parsePhoneNumberFromString from 'libphonenumber-js';
import * as z from "zod";

interface UserData {
  password?: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
}

const passwordRequired = (
  data: UserData,
  passwordField: keyof UserData,
  newPasswordField: keyof UserData,
  newPasswordConfirmationField: keyof UserData = "newPasswordConfirmation"
) => {
  const newPasswordEntered = data[newPasswordField] !== undefined;
  const confirmationEntered = data[newPasswordConfirmationField] !== undefined;

  if (newPasswordEntered && !confirmationEntered) {
    return false;
  }

  return !(
    (data[passwordField] && !data[newPasswordField]) ||
    (data[newPasswordField] && !data[passwordField])
  );
};

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
  });

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
  });

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido, obrigatório.",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido. E-mail é obrigatório.",
  }),
  password: z.string().min(1, {
    message: "Por favor, insira sua senha. Senha é obrigatória.",
  }),
  code: z.optional(z.string()),
});

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
  });