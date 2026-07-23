"use client";

import { useState } from "react";
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
  COUNTRY_DIAL_CODES,
  DEFAULT_COUNTRY_CODE,
} from "@/shared/constants/countries.constants";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ROLES = [
  {
    value: "user",
    title: "Utilisateur",
    description: "Recherchez des biens immobiliers",
    icon: "🔍",
    trial: "2 jours d'essai gratuit",
  },
  {
    value: "agent",
    title: "Agent immobilier",
    description: "Publiez et gérez vos annonces",
    icon: "🏢",
    trial: "1 mois de publication gratuite",
  },
  {
    value: "owner",
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();

  const step1Form = useForm<RegisterStep1Values>({
    resolver: zodResolver(registerStep1Schema),
  });

  const step2Form = useForm<RegisterStep2Values>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: { role: preselectedRole, countryCode: DEFAULT_COUNTRY_CODE },
  });

  const selectedCountryCode =
    step2Form.watch("countryCode") || DEFAULT_COUNTRY_CODE;
  const selectedCountry =
    COUNTRY_DIAL_CODES.find((c) => c.code === selectedCountryCode) ??
    COUNTRY_DIAL_CODES[0];

  const onStep1 = (data: RegisterStep1Values) => {
    setStep(2);
  };

  const onStep2 = (data: RegisterStep2Values) => {
    const { email, password } = step1Form.getValues();
    const country = COUNTRY_DIAL_CODES.find((c) => c.code === data.countryCode);
    // Compose le numéro complet : indicatif + numéro local (espaces retirés)
    const localNumber = data.phone.replace(/\s+/g, "");
    const fullPhone = `${country?.dialCode ?? ""}${localNumber}`;

    registerMutation.mutate({
      email,
      password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: fullPhone,
      role: data.role,
    });
  };

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="mb-2 font-heading text-2xl text-white sm:text-3xl">
          Créer un compte
        </h1>
        <p className="text-sm text-white/70 sm:text-base">
          Rejoignez LuxHorizon
        </p>
      </div>

      {/* Indicateur d'étapes */}
      <div className="mb-6 flex items-center justify-center gap-2 sm:mb-8">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
            step === 1
              ? "bg-accent text-ink"
              : "bg-green-500 text-white"
          }`}
        >
          {step > 1 ? <CheckCircleIcon className="h-5 w-5" /> : "1"}
        </div>
        <div className="h-0.5 w-16 overflow-hidden rounded-full bg-white/20">
          <div
            className={`h-full bg-accent transition-all duration-500 ${step > 1 ? "w-full" : "w-0"}`}
          />
        </div>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
            step === 2
              ? "bg-accent text-ink"
              : "bg-white/20 text-white/70"
          }`}
        >
          2
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-6 shadow-card sm:p-8">
        {step === 1 && (
          <form
            onSubmit={step1Form.handleSubmit(onStep1)}
            className="space-y-5"
          >
            <h2 className="mb-4 font-heading text-xl">
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
            <div className="relative">
              <Input
                label="Confirmer le mot de passe"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Répétez le mot de passe"
                icon={<LockClosedIcon className="h-5 w-5" />}
                error={step1Form.formState.errors.confirmPassword?.message}
                {...step1Form.register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                className="absolute right-3 top-[38px] text-primary-400 transition-colors hover:text-primary-600"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
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
            <h2 className="mb-4 font-heading text-xl">Vos informations</h2>

            {/* Choix du rôle */}
            <div>
              <label className="mb-2 block text-sm font-medium text-primary-700">
                Type de compte
              </label>
              <div className="grid grid-cols-1 gap-3">
                {ROLES.map((role) => {
                  const selected = selectedRole === role.value;
                  return (
                    <label
                      key={role.value}
                      className={`relative flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-all ${
                        selected
                          ? "border-accent bg-accent/5"
                          : "border-primary-200 hover:border-primary-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={role.value}
                        checked={selected}
                        onChange={(e) => {
                          setSelectedRole(e.target.value);
                          step2Form.setValue("role", e.target.value);
                        }}
                        className="sr-only"
                      />
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg transition-colors ${
                          selected ? "bg-accent/15" : "bg-primary-100"
                        }`}
                      >
                        {role.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-medium text-primary-900">
                          {role.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-primary-500">
                          {role.description}
                        </span>
                        <span className="mt-1 block text-xs font-medium text-accent">
                          {role.trial}
                        </span>
                      </span>
                      {selected && (
                        <CheckCircleIcon className="h-5 w-5 shrink-0 text-accent" />
                      )}
                    </label>
                  );
                })}
              </div>
              {step2Form.formState.errors.role?.message && (
                <p className="mt-1 text-sm text-red-500">
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

            {/* Téléphone avec sélecteur de pays / indicatif */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-700">
                Téléphone
              </label>
              <div className="flex gap-2">
                <div className="relative shrink-0">
                  <select
                    aria-label="Indicatif téléphonique du pays"
                    value={selectedCountryCode}
                    onChange={(e) =>
                      step2Form.setValue("countryCode", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    className="h-full appearance-none rounded-xl border border-primary-200 bg-surface py-3 pl-3 pr-8 text-sm text-primary-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    {COUNTRY_DIAL_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.dialCode}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="tel"
                    placeholder="6 12 34 56 78"
                    {...step2Form.register("phone")}
                    className="w-full rounded-xl border border-primary-200 bg-surface py-3 pl-10 pr-3 text-sm text-primary-900 placeholder:text-primary-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>

              {/* Aperçu du numéro complet composé */}
              {step2Form.watch("phone") && (
                <p className="mt-1.5 text-xs text-primary-400">
                  Numéro complet : {selectedCountry.dialCode}
                  {step2Form.watch("phone").replace(/\s+/g, "")}
                </p>
              )}

              {(step2Form.formState.errors.phone?.message ||
                step2Form.formState.errors.countryCode?.message) && (
                <p className="mt-1 text-sm text-red-500">
                  {step2Form.formState.errors.phone?.message ||
                    step2Form.formState.errors.countryCode?.message}
                </p>
              )}
            </div>

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

      <p className="mt-6 text-center text-sm text-white/70">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-medium text-accent hover:text-accent-light"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
