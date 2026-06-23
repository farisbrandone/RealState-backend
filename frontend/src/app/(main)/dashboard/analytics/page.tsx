'use client';

import { Card } from '@/shared/ui/components/Card/Card';

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Statistiques</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p>Vues totales</p>
          <span className="text-3xl font-heading text-accent">1240</span>
        </Card>
        <Card>
          <p>Contacts cette semaine</p>
          <span className="text-3xl font-heading text-accent">8</span>
        </Card>
        <Card>
          <p>Propriétés favorites</p>
          <span className="text-3xl font-heading text-accent">3</span>
        </Card>
      </div>
    </div>
  );
}
