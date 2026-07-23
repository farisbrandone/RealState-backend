import Link from "next/link";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-br from-ink to-ink-elevated">
      {/* Ambiance discrète, cohérente avec le Hero de la home — purement décorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/*
        Fix clé : plus de max-w-md imposé ici. Chaque page auth définit déjà
        sa propre largeur (max-w-md pour login, max-w-lg pour register...) ;
        le forcer à max-w-md au niveau du layout écrasait inutilement le
        formulaire d'inscription.
      */}
      <div
        className="relative z-10 flex w-full flex-1 flex-col items-center px-4 py-10 sm:py-14"
        style={{ paddingTop: "max(2.5rem, env(safe-area-inset-top, 0px))" }}
      >
        {/* Logo — identique à celui du Header, ramène à l'accueil */}
        <Link
          href="/"
          className="mb-8 inline-flex shrink-0 items-center gap-2.5 sm:mb-10"
          aria-label="LuxHorizon — Retour à l'accueil"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
            <BuildingStorefrontIcon className="h-5 w-5 text-ink" />
          </div>
          <span className="whitespace-nowrap font-heading text-xl font-bold tracking-tight text-white">
            LuxHorizon
          </span>
        </Link>

        <div className="flex w-full flex-1 flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
