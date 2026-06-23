"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerStep1Schema,
  registerStep2Schema,
  RegisterStep1Values,
  RegisterStep2Values,
} from "@/features/auth/schemas/register.schema";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { Button } from "@/shared/ui/components/Button/Button";
import { Input } from "@/shared/ui/components/Input/Input";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  BriefcaseIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ROLES = [
  {
    value: "USER",
    title: "Utilisateur",
    description: "Recherchez des biens immobiliers",
    icon: "🔍",
    trial: "2 jours d'essai gratuit",
  },
  {
    value: "AGENT",
    title: "Agent immobilier",
    description: "Publiez et gérez vos annonces",
    icon: "🏢",
    trial: "1 mois de publication gratuite",
  },
  {
    value: "OWNER",
    title: "Propriétaire",
    description: "Publiez vos propres biens",
    icon: "🏠",
    trial: "1 mois de publication gratuite",
  },
];

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const preselectedRole = searchParams.get("role") || "USER";

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(preselectedRole);
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const step1Form = useForm<RegisterStep1Values>({
    resolver: zodResolver(registerStep1Schema),
  });

  const step2Form = useForm<RegisterStep2Values>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: { role: preselectedRole },
  });

  const onStep1 = (data: RegisterStep1Values) => {
    setStep(2);
  };

  const onStep2 = (data: RegisterStep2Values) => {
    const { email, password } = step1Form.getValues();
    registerMutation.mutate({
      email,
      password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading text-primary-900 mb-2">
            Créer un compte
          </h1>
          <p className="text-primary-500">Rejoignez LuxHorizon</p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 1 ? "bg-accent text-white" : "bg-green-500 text-white"
            }`}
          >
            {step > 1 ? <CheckCircleIcon className="h-5 w-5" /> : "1"}
          </div>
          <div className="w-16 h-0.5 bg-primary-200">
            <div
              className={`h-full bg-accent transition-all ${step > 1 ? "w-full" : "w-0"}`}
            />
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 2
                ? "bg-accent text-white"
                : "bg-primary-200 text-primary-500"
            }`}
          >
            2
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-card p-8">
          {step === 1 && (
            <form
              onSubmit={step1Form.handleSubmit(onStep1)}
              className="space-y-5"
            >
              <h2 className="text-xl font-heading mb-4">
                Informations de connexion
              </h2>
              <Input
                label="Email"
                type="email"
                placeholder="vous@exemple.com"
                icon={<EnvelopeIcon className="h-5 w-5" />}
                error={step1Form.formState.errors.email?.message}
                {...step1Form.register("email")}
              />
              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 caractères"
                  icon={<LockClosedIcon className="h-5 w-5" />}
                  error={step1Form.formState.errors.password?.message}
                  {...step1Form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-primary-400 hover:text-primary-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  label="Confirmer le mot de passe"
                  type={showPassword ? "text" : "password"}
                  placeholder="Répétez le mot de passe"
                  icon={<LockClosedIcon className="h-5 w-5" />}
                  error={step1Form.formState.errors.confirmPassword?.message}
                  {...step1Form.register("confirmPassword")}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Continuer
              </Button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={step2Form.handleSubmit(onStep2)}
              className="space-y-5"
            >
              <h2 className="text-xl font-heading mb-4">Vos informations</h2>

              {/* Choix du rôle */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Type de compte
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {ROLES.map((role) => (
                    <label
                      key={role.value}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedRole === role.value
                          ? "border-accent bg-accent/5"
                          : "border-primary-200 hover:border-primary-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={role.value}
                        checked={selectedRole === role.value}
                        onChange={(e) => {
                          setSelectedRole(e.target.value);
                          step2Form.setValue("role", e.target.value);
                        }}
                        className="mt-1 text-accent focus:ring-accent"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{role.icon}</span>
                          <span className="font-medium text-primary-900">
                            {role.title}
                          </span>
                        </div>
                        <p className="text-sm text-primary-500 mt-0.5">
                          {role.description}
                        </p>
                        <p className="text-xs text-accent mt-1">{role.trial}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {step2Form.formState.errors.role?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {step2Form.formState.errors.role.message}
                  </p>
                )}
              </div>

              <Input
                label="Prénom"
                icon={<UserIcon className="h-5 w-5" />}
                error={step2Form.formState.errors.firstName?.message}
                {...step2Form.register("firstName")}
              />
              <Input
                label="Nom"
                icon={<UserIcon className="h-5 w-5" />}
                error={step2Form.formState.errors.lastName?.message}
                {...step2Form.register("lastName")}
              />
              <Input
                label="Téléphone"
                type="tel"
                icon={<PhoneIcon className="h-5 w-5" />}
                error={step2Form.formState.errors.phone?.message}
                {...step2Form.register("phone")}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Création..." : "Finaliser"}
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-primary-500">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-accent hover:text-accent-dark font-medium"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
