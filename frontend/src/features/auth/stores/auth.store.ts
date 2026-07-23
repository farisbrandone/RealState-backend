import {
  setAccessTokenCookie,
  removeAccessTokenCookie,
} from "@/shared/lib/storage/token.storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string; // ⬅️ ajout
  phone: string;
  roles: string[];
  permissions: string[];
  status: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    planId: string | null;
    planName: string | null;
    status: "trialing" | "active" | "past_due" | "canceled" | "expired";
    trialEndsAt: string | null; // date ISO
    currentPeriodEnd: string | null;
  };
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (access, refresh) => {
        // Centralisé ici (plutôt que dans chaque appelant) pour que le
        // rafraîchissement automatique du token (voir l'intercepteur 401
        // dans http.client.ts) garde lui aussi le cookie à jour — sans ça,
        // le cookie lu par le middleware restait figé sur le token initial
        // (15 min de durée de vie) bien après son expiration réelle.
        setAccessTokenCookie(access);
        set({ accessToken: access, refreshToken: refresh });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        removeAccessTokenCookie();
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
