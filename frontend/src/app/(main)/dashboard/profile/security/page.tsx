'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/components/Button/Button';
import { Input } from '@/shared/ui/components/Input/Input';
import { Card } from '@/shared/ui/components/Card/Card';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api/endpoints/auth.endpoints';
import { toast } from 'react-hot-toast';

export default function SecurityPage() {
  const [showSessions, setShowSessions] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => authApi.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      toast.success('Mot de passe modifié');
      reset();
    },
    onError: () => toast.error('Erreur'),
  });

  // Sessions
  const { data: sessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => authApi.getSessions(),
    enabled: showSessions,
  });

  return (
    <div className="max-w-2xl space-y-8">
      <Card>
        <h2 className="text-xl font-heading mb-4">Changer le mot de passe</h2>
        <form
          onSubmit={handleSubmit(data => changePasswordMutation.mutate(data))}
          className="space-y-4"
        >
          <Input label="Mot de passe actuel" type="password" {...register('currentPassword')} />
          <Input label="Nouveau mot de passe" type="password" {...register('newPassword')} />
          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            {...register('confirmPassword')}
          />
          <Button type="submit" variant="primary" disabled={changePasswordMutation.isPending}>
            Modifier le mot de passe
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading">Sessions actives</h2>
          <Button variant="outline" size="sm" onClick={() => setShowSessions(!showSessions)}>
            {showSessions ? 'Masquer' : 'Afficher'}
          </Button>
        </div>
        {showSessions &&
          sessions?.data?.map((s: any) => (
            <div key={s.id} className="flex justify-between py-2 border-b">
              <span>
                {s.ipAddress} - {s.userAgent}
              </span>
              <Button variant="outline" size="sm" onClick={() => authApi.revokeSession(s.id)}>
                Révoquer
              </Button>
            </div>
          ))}
      </Card>
    </div>
  );
}
