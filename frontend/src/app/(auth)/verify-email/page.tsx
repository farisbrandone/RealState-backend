"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import { Spinner } from "@/shared/ui/components/Spinner/Spinner";
import { Button } from "@/shared/ui/components/Button/Button";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verifyMutation = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    }
  }, [token]);

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="mb-2 font-heading text-2xl text-white sm:text-3xl">
          Vérification de l'email
        </h1>
      </div>

      <div className="rounded-2xl bg-surface p-6 text-center shadow-card sm:p-8">
        {!token && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <XCircleIcon className="h-7 w-7 text-red-500" />
            </div>
            <p className="font-medium text-primary-900">Token manquant.</p>
            <p className="mt-1 text-sm text-primary-500">
              Le lien de vérification semble incomplet ou invalide.
            </p>
          </>
        )}

        {verifyMutation.isPending && (
          <div className="flex items-center justify-center gap-3 py-4">
            <Spinner />
            <span className="text-primary-600">Vérification en cours...</span>
          </div>
        )}

        {verifyMutation.isSuccess && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-7 w-7 text-green-600" />
            </div>
            <p className="mb-4 font-medium text-green-600">
              Email vérifié avec succès !
            </p>
            <Link href="/login" className="block">
              <Button variant="primary" size="md" className="w-full">
                Se connecter
              </Button>
            </Link>
          </>
        )}

        {verifyMutation.isError && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <XCircleIcon className="h-7 w-7 text-red-500" />
            </div>
            <p className="mb-3 text-red-500">Échec de la vérification.</p>
            <Link
              href="/login"
              className="text-sm text-accent hover:text-accent-dark"
            >
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

/* 'use client';

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
 */
