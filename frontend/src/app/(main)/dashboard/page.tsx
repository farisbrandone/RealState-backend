'use client';

import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useMyProperties } from '@/features/property-management/hooks/useMyProperties';
import { Card } from '@/shared/ui/components/Card/Card';

export default function DashboardPage() {
  const user = useAuthStore(s => s.user);
  const { data: propertiesData } = useMyProperties(user?.id || '', 1, 5);

  const propertyCount = propertiesData?.data?.total || 0;

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Bonjour, {user?.firstName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-primary-500 text-sm mb-2">Propriétés</h3>
          <p className="text-3xl font-heading text-accent">{propertyCount}</p>
        </Card>
        <Card>
          <h3 className="text-primary-500 text-sm mb-2">Messages non lus</h3>
          <p className="text-3xl font-heading text-accent">{/* total unread from chat store */}</p>
        </Card>
        <Card>
          <h3 className="text-primary-500 text-sm mb-2">Vues cette semaine</h3>
          <p className="text-3xl font-heading text-accent">--</p>
        </Card>
      </div>
    </div>
  );
}
