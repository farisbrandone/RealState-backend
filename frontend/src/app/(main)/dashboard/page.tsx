"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useMyProperties } from "@/features/property-management/hooks/useMyProperties";
import { Card } from "@/shared/ui/components/Card/Card";
import {
  BuildingOfficeIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

export default function DashboardOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: propertiesData } = useMyProperties(user?.id || "", 1, 5);
  const propertyCount = propertiesData?.total || 0;

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Bonjour, {user?.firstName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-3 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-primary-500">Propriétés</p>
              <p className="text-2xl font-bold text-primary-900">
                {propertyCount}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-3 rounded-lg">
              <EyeIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-primary-500">Vues cette semaine</p>
              <p className="text-2xl font-bold text-primary-900">--</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-3 rounded-lg">
              <ChatBubbleLeftIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-primary-500">Messages non lus</p>
              <p className="text-2xl font-bold text-primary-900">--</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-3 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-primary-500">Abonnement</p>
              <p className="text-lg font-bold text-primary-900">
                {user?.subscription?.planName || "Essai"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
