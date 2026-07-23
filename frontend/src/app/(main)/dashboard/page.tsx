"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { propertyManagementApi } from "@/shared/api/endpoints/property-management.endpoints";
import { useUnreadMessages } from "@/features/chat/hooks/useUnreadMessages";
import { Card } from "@/shared/ui/components/Card/Card";
import {
  BuildingOfficeIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  CreditCardIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/outline";

export default function DashboardOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: unread } = useUnreadMessages();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["ownerStats"],
    queryFn: async () => (await propertyManagementApi.myStats()).data,
  });

  const statTile = (
    icon: React.ReactNode,
    label: string,
    value: React.ReactNode,
  ) => (
    <Card>
      <div className="flex items-center gap-3">
        <div className="bg-accent/10 p-3 rounded-lg">{icon}</div>
        <div>
          <p className="text-sm text-primary-500">{label}</p>
          <p className="text-2xl font-bold text-primary-900">
            {statsLoading ? "…" : value}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Bonjour, {user?.firstName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statTile(
          <BuildingOfficeIcon className="h-6 w-6 text-accent" />,
          "Propriétés publiées",
          `${stats?.publishedProperties ?? 0} / ${stats?.totalProperties ?? 0}`,
        )}
        {statTile(
          <EyeIcon className="h-6 w-6 text-accent" />,
          "Vues totales",
          stats?.totalViews ?? 0,
        )}
        {statTile(
          <EnvelopeOpenIcon className="h-6 w-6 text-accent" />,
          "Demandes de contact",
          stats?.totalInquiries ?? 0,
        )}
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-3 rounded-lg">
              <ChatBubbleLeftIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-primary-500">Messages non lus</p>
              <p className="text-2xl font-bold text-primary-900">
                {unread?.total ?? 0}
              </p>
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
