"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from "@/features/auth/schemas/reset-password.schema";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { Button } from "@/shared/ui/components/Button/Button";
import { Input } from "@/shared/ui/components/Input/Input";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// suppose un paramètre ?token=... dans l'URL
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const resetMutation = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="w-full max-w-md">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="mb-2 font-heading text-2xl text-white sm:text-3xl">
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-white/70 sm:text-base">
          Choisissez un mot de passe sécurisé
        </p>
      </div>

      <div className="rounded-2xl bg-surface p-6 shadow-card sm:p-8">
        {resetMutation.isSuccess ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-7 w-7 text-green-600" />
            </div>
            <h2 className="mb-2 font-heading text-lg text-primary-900">
              Mot de passe réinitialisé
            </h2>
            <p className="mb-4 text-sm text-primary-500">
              Vous pouvez maintenant vous connecter avec votre nouveau mot de
              passe.
            </p>
            <Link href="/login" className="block">
              <Button variant="primary" size="md" className="w-full">
                Se connecter
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register("token")} />
            {!token && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                Lien invalide ou expiré : le jeton de réinitialisation est
                manquant.
              </p>
            )}
            <div className="relative">
              <Input
                label="Nouveau mot de passe"
                type={showPassword ? "text" : "password"}
                icon={<LockClosedIcon className="h-5 w-5" />}
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                className="absolute right-3 top-[38px] text-primary-400 transition-colors hover:text-primary-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <Input
              label="Confirmer le mot de passe"
              type={showPassword ? "text" : "password"}
              icon={<LockClosedIcon className="h-5 w-5" />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Réinitialisation..." : "Réinitialiser"}
            </Button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-white/70">
        <Link href="/login" className="hover:text-white">
          ← Retour à la connexion
        </Link>
      </p>
    </div>
  );
}

/* // suppose un paramètre ?token=... dans l’URL
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
 */
