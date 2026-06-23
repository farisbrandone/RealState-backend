import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
