'use client';

import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api/endpoints/auth.endpoints';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export const useVerifyEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email vérifié avec succès.');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Vérification échouée');
    },
  });
};
