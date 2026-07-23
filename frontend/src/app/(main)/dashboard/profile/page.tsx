"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/shared/api/endpoints/user.endpoints";
import { Input } from "@/shared/ui/components/Input/Input";
import { Button } from "@/shared/ui/components/Button/Button";
import { Card } from "@/shared/ui/components/Card/Card";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  ExclamationTriangleIcon,
  PhotoIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { getMediaUrl } from "@/shared/lib/media/media-url";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  console.log({ user });
  const upgradeMode = searchParams.get("upgrade") === "agent";
  const redirectTo =
    searchParams.get("redirect") || "/dashboard/properties/new";

  useEffect(() => {
    if (upgradeMode) {
      toast(
        "Pour poster une annonce, vous devez devenir agent ou propriétaire.",
        {
          icon: "ℹ️",
          duration: 5000,
        },
      );
    }
  }, [upgradeMode]);

  const { register, handleSubmit } = useForm({
    // 🌟 Remplacer defaultValues par values pour synchroniser les inputs dès que 'user' change
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      email: user?.email || "",
    },
  });

  // Mutation pour mettre à jour le profil (nom, prénom, téléphone)
  const updateMutation = useMutation({
    mutationFn: (data: any) => userApi.updateProfile(user?.id!, data),
    onSuccess: (res) => {
      setUser({ ...user!, ...res.data });
      toast.success("Profil mis à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const upgradeMutation = useMutation({
    mutationFn: () => userApi.upgradeToAgent(user?.id!),
    onSuccess: (res) => {
      setUser({ ...user!, roles: res.data.roles });
      toast.success("Vous êtes maintenant agent !");
      router.push(redirectTo);
    },
    onError: () => toast.error("Erreur lors de la mise à jour du rôle"),
  });

  // Upload de l'avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aperçu local
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload vers le backend
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Endpoint à créer côté backend : POST /users/:id/avatar
      const response = await userApi.uploadAvatar(user?.id!, formData);
      console.log(response.status);
      setUser({ ...user!, avatar: response.data.avatarUrl });
      toast.success("Photo de profil mise à jour");
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  // avatarPreview est déjà une data: URL (FileReader) — ne jamais la préfixer.
  const avatarUrl =
    avatarPreview ||
    getMediaUrl(user?.avatar) ||
    "/images/avatar-placeholder.png";
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-6">Mon profil</h1>

      {/* Bandeau upgrade */}
      {upgradeMode && (
        <Card className="mb-6 border-2 border-accent bg-accent/5">
          <div className="flex items-start gap-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-heading text-lg mb-2">
                Devenez agent ou propriétaire
              </h3>
              <p className="text-sm text-primary-600 mb-4">
                Pour publier des annonces, vous devez disposer d'un compte Agent
                ou Propriétaire. Mettez à jour votre profil professionnel
                ci-dessous puis cliquez sur "Devenir agent".
              </p>
              <Button
                variant="primary"
                onClick={() => upgradeMutation.mutate()}
                disabled={upgradeMutation.isPending}
              >
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                {upgradeMutation.isPending ? "Mise à jour..." : "Devenir agent"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Avatar */}
      <Card className="mb-6">
        <h2 className="text-lg font-heading mb-4">Photo de profil</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-accent/20"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-accent text-ink p-1.5 rounded-full hover:bg-accent-dark transition-colors"
              title="Changer la photo"
            >
              <PhotoIcon className="h-4 w-4" />
            </button>
          </div>
          <input
            title="file"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <div>
            <p className="text-sm text-primary-600">
              Cliquez sur l'icône pour changer votre photo.
            </p>
            <p className="text-xs text-primary-400 mt-1">
              Formats acceptés : JPG, PNG. Max 5 Mo.
            </p>
            {isUploading && (
              <p className="text-xs text-accent mt-1">Upload en cours...</p>
            )}
          </div>
        </div>
      </Card>

      {/* Formulaire infos */}
      <Card>
        <h2 className="text-lg font-heading mb-4">Informations personnelles</h2>
        <form
          onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Prénom" {...register("firstName")} />
            <Input label="Nom" {...register("lastName")} />
          </div>
          <Input label="Téléphone" {...register("phone")} />
          <Input label="Email" disabled {...register("email")} />
          <Button
            type="submit"
            variant="primary"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
