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
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const registerMutation = useRegister();

  const step1Form = useForm<RegisterStep1Values>({
    resolver: zodResolver(registerStep1Schema),
  });
  const step2Form = useForm<RegisterStep2Values>({
    resolver: zodResolver(registerStep2Schema),
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
      role: data.role, // 🔥 ajout du rôle
    });
    /*  registerMutation.mutate({
      email,
      password,
      ...data,
    }); */
  };

  return (
    <div className="bg-surface rounded-xl shadow-card p-8">
      <h2 className="text-2xl font-heading text-primary-900 mb-6 text-center">
        {step === 1 ? "Créer un compte" : "Informations personnelles"}
      </h2>
      {step === 1 && (
        <form onSubmit={step1Form.handleSubmit(onStep1)} className="space-y-5">
          <Input
            label="Email"
            type="email"
            icon={<EnvelopeIcon className="h-5 w-5" />}
            error={step1Form.formState.errors.email?.message}
            {...step1Form.register("email")}
          />
          <Input
            label="Mot de passe"
            type="password"
            icon={<LockClosedIcon className="h-5 w-5" />}
            error={step1Form.formState.errors.password?.message}
            {...step1Form.register("password")}
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            icon={<LockClosedIcon className="h-5 w-5" />}
            error={step1Form.formState.errors.confirmPassword?.message}
            {...step1Form.register("confirmPassword")}
          />
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Continuer
          </Button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={step2Form.handleSubmit(onStep2)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Type de compte
            </label>
            <select
              {...step2Form.register("role")}
              className="w-full rounded-md border border-primary-200 p-2.5"
            >
              <option value="user">Utilisateur (recherche de biens)</option>
              <option value="agent">Agent immobilier</option>
              <option value="owner">Propriétaire</option>
            </select>
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
          <div className="flex gap-4">
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
  );
}
