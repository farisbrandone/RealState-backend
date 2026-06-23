"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/shared/api/endpoints/auth.endpoints";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "react-hot-toast";
import { setAccessTokenCookie } from "@/shared/lib/storage/token.storage";

export const useRegister = () => {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone: string;
      role: string; // ajout
    }) => authApi.register(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
      setAccessTokenCookie(accessToken);
      toast.success("Compte créé avec succès");
      router.push("/");
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Erreur lors de l'inscription",
      );
    },
  });
};
