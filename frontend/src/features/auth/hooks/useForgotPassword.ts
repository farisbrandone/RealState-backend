'use client';

import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api/endpoints/auth.endpoints';
import { toast } from 'react-hot-toast';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordReset(email),
    onSuccess: () => {
      toast.success('Un lien de réinitialisation a été envoyé à votre adresse email.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi");
    },
  });
};
