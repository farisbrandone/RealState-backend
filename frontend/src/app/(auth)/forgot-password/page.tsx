'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from '@/features/auth/schemas/forgot-password.schema';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import { Button } from '@/shared/ui/components/Button/Button';
import { Input } from '@/shared/ui/components/Input/Input';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const forgotMutation = useForgotPassword();

  const onSubmit = (data: ForgotPasswordValues) => {
    forgotMutation.mutate(data.email);
  };

  return (
    <div className="bg-surface rounded-xl shadow-card p-8">
      <h2 className="text-2xl font-heading text-primary-900 mb-6 text-center">
        Mot de passe oublié
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          icon={<EnvelopeIcon className="h-5 w-5" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi...' : 'Envoyer le lien'}
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
