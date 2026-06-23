import { removeAccessTokenCookie } from "@/shared/lib/storage/token.storage";
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
      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),
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
