'use client';

import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api/endpoints/auth.endpoints';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      authApi.resetPassword(data.token, data.newPassword),
    onSuccess: () => {
      toast.success('Mot de passe réinitialisé avec succès.');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
    },
  });
};
