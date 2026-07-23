"use client";

import { useEffect, useState } from "react";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

const DISMISSED_KEY = "luxhorizon_install_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIos(): boolean {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

// Bannière discrète invitant à installer l'app (PWA) — Chrome/Edge/Android via
// l'événement natif beforeinstallprompt, avec des instructions dédiées pour
// iOS Safari qui n'expose aucune API d'installation programmatique.
export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY) === "true") return;
    if (isStandalone()) return;

    setDismissed(false);

    if (isIos()) {
      setShowIosHint(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  };

  if (dismissed || (!deferredPrompt && !showIosHint)) return null;

  return (
    <div
      role="complementary"
      aria-label="Installer l'application LuxHorizon"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl bg-ink p-4 text-white shadow-soft sm:inset-x-auto sm:right-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
        <ArrowDownTrayIcon className="h-5 w-5 text-accent" />
      </div>
      <div className="min-w-0 flex-1 text-sm">
        {showIosHint ? (
          <p>
            Installez LuxHorizon : appuyez sur <strong>Partager</strong> puis{" "}
            <strong>Sur l’écran d’accueil</strong>.
          </p>
        ) : (
          <p>Installez LuxHorizon pour un accès rapide, même hors ligne.</p>
        )}
      </div>
      {!showIosHint && (
        <button
          type="button"
          onClick={install}
          className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-ink hover:bg-accent-light"
        >
          Installer
        </button>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fermer"
        className="shrink-0 rounded-full p-1 hover:bg-white/10"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
