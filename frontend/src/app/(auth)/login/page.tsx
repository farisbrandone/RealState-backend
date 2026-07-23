"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginFormValues,
} from "@/features/auth/schemas/login.schema";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { Button } from "@/shared/ui/components/Button/Button";
import { Input } from "@/shared/ui/components/Input/Input";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="mb-2 font-heading text-2xl text-white sm:text-3xl">
          Connexion
        </h1>
        <p className="text-sm text-white/70 sm:text-base">
          Accédez à votre compte LuxHorizon
        </p>
      </div>

      <div className="rounded-2xl bg-surface p-6 shadow-card sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="vous@exemple.com"
            icon={<EnvelopeIcon className="h-5 w-5" />}
            error={errors.email?.message}
            {...register("email")}
          />
          <div className="relative">
            <Input
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<LockClosedIcon className="h-5 w-5" />}
              error={errors.password?.message}
              {...register("password")}
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

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-accent hover:text-accent-dark"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <div className="mt-6 border-t border-primary-100 pt-6">
          <p className="text-center text-sm text-primary-500">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-medium text-accent hover:text-accent-dark"
            >
              Créer un compte
            </Link>
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <Link href="/register?role=AGENT" className="block w-full">
            <Button variant="outline" size="md" className="w-full text-sm">
              🏢 Vous êtes agent immobilier ? Créez un compte professionnel
            </Button>
          </Link>
          <Link href="/register?role=OWNER" className="block w-full">
            <Button variant="outline" size="md" className="w-full text-sm">
              🏠 Vous êtes propriétaire ? Publiez votre bien
            </Button>
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-white/70">
        <Link href="/" className="hover:text-white">
          ← Retour à l'accueil
        </Link>
      </p>
    </div>
  );
}
