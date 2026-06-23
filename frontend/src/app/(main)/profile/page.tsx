'use client';

import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Card } from '@/shared/ui/components/Card/Card';
import { Button } from '@/shared/ui/components/Button/Button';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card padding="lg">
        <h1 className="text-2xl font-heading mb-6">Mon Profil</h1>
        <div className="space-y-3">
          <p>
            <strong>Nom :</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>Téléphone :</strong> {user.phone}
          </p>
          <p>
            <strong>Rôle :</strong> {user.roles.join(', ')}
          </p>
        </div>
        <div className="mt-8">
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </Card>
    </div>
  );
}
