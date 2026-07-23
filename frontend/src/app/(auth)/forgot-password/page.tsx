"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "@/features/auth/schemas/forgot-password.schema";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import { Button } from "@/shared/ui/components/Button/Button";
import { Input } from "@/shared/ui/components/Input/Input";
import { EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

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
    <div className="w-full max-w-md">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="mb-2 font-heading text-2xl text-white sm:text-3xl">
          Mot de passe oublié
        </h1>
        <p className="text-sm text-white/70 sm:text-base">
          Recevez un lien de réinitialisation par email
        </p>
      </div>

      <div className="rounded-2xl bg-surface p-6 shadow-card sm:p-8">
        {forgotMutation.isSuccess ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-7 w-7 text-green-600" />
            </div>
            <h2 className="mb-2 font-heading text-lg text-primary-900">
              Email envoyé
            </h2>
            <p className="text-sm text-primary-500">
              Si un compte existe pour cette adresse, vous allez recevoir un
              lien de réinitialisation dans quelques instants.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="vous@exemple.com"
              icon={<EnvelopeIcon className="h-5 w-5" />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting || forgotMutation.isPending}
            >
              {isSubmitting || forgotMutation.isPending
                ? "Envoi..."
                : "Envoyer le lien"}
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

/* 'use client';

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
 */
