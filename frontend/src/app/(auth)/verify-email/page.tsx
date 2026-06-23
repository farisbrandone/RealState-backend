'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVerifyEmail } from '@/features/auth/hooks/useVerifyEmail';
import { Spinner } from '@/shared/ui/components/Spinner/Spinner';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const verifyMutation = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    }
  }, [token]);

  return (
    <div className="bg-surface rounded-xl shadow-card p-8 text-center">
      {!token && <p className="text-red-500">Token manquant.</p>}
      {verifyMutation.isPending && (
        <div className="flex items-center justify-center gap-2">
          <Spinner />
          <span>Vérification en cours...</span>
        </div>
      )}
      {verifyMutation.isSuccess && <p className="text-green-600">Email vérifié avec succès !</p>}
      {verifyMutation.isError && <p className="text-red-500">Échec de la vérification.</p>}
    </div>
  );
}
