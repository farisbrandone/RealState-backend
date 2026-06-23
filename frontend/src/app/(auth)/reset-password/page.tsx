// suppose un paramètre ?token=... dans l’URL
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from '@/features/auth/schemas/reset-password.schema';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import { Button } from '@/shared/ui/components/Button/Button';
import { Input } from '@/shared/ui/components/Input/Input';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const resetMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    resetMutation.mutate({ token: data.token, newPassword: data.newPassword });
  };

  return (
    <div className="bg-surface rounded-xl shadow-card p-8">
      <h2 className="text-2xl font-heading text-primary-900 mb-6 text-center">
        Nouveau mot de passe
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register('token')} />
        <Input
          label="Nouveau mot de passe"
          type="password"
          icon={<LockClosedIcon className="h-5 w-5" />}
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          icon={<LockClosedIcon className="h-5 w-5" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-primary-500">
        <Link href="/login" className="text-accent hover:text-accent-dark">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
