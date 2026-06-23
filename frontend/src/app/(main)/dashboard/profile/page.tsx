"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userApi } from "@/shared/api/endpoints/user.endpoints";
import { Input } from "@/shared/ui/components/Input/Input";
import { Button } from "@/shared/ui/components/Button/Button";
import { Card } from "@/shared/ui/components/Card/Card";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      email: user?.email || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => userApi.updateProfile(user?.id!, data),
    onSuccess: (res) => {
      setUser({ ...user, ...res.data });
      toast.success("Profil mis à jour");
    },
    onError: () => toast.error("Erreur"),
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading mb-6">Mon profil</h1>
      <Card>
        <form
          onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
          className="space-y-4"
        >
          <Input label="Prénom" {...register("firstName")} />
          <Input label="Nom" {...register("lastName")} />
          <Input label="Téléphone" {...register("phone")} />
          <Input label="Email" disabled {...register("email")} />
          <Button
            type="submit"
            variant="primary"
            disabled={updateMutation.isPending}
          >
            Enregistrer
          </Button>
        </form>
      </Card>
    </div>
  );
}
