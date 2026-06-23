import { z } from "zod";

export const registerStep1Schema = z
  .object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Minimum 8 caractères")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[a-z]/, "Au moins une minuscule")
      .regex(/[0-9]/, "Au moins un chiffre")
      .regex(/[!@#$%^&*]/, "Au moins un caractère spécial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

const ROLES = ["user", "agent", "owner"] as const;

export const registerStep2Schema = z.object({
  firstName: z.string().min(2, "Minimum 2 caractères"),
  lastName: z.string().min(2, "Minimum 2 caractères"),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Numéro invalide"),
  role: z
    .string({ error: "Veuillez choisir un type de compte" })
    .refine((val) => ROLES.includes(val as any), {
      message: "Veuillez choisir un type de compte valide",
    }),
});

export type RegisterStep1Values = z.infer<typeof registerStep1Schema>;
export type RegisterStep2Values = z.infer<typeof registerStep2Schema>;
