"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/shared/ui/components/Card/Card";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import { PropertyCard } from "@/widgets/PropertyCard/PropertyCard";
import { Button } from "@/shared/ui/components/Button/Button";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import httpClient from "@/shared/api/clients/http.client";
import { BuildingOfficeIcon } from "@heroicons/react/24/solid";

export default function AgencyDetailPageClient() {
  const params = useParams();
  const agencyId = params.id as string;

  const { data: agency, isLoading } = useQuery({
    queryKey: ["agency", agencyId],
    queryFn: async () => {
      const { data } = await httpClient.get(`/users/agencies/${agencyId}`);
      return data;
    },
  });

  const { data: agentsData } = useQuery({
    queryKey: ["agencyAgents", agencyId],
    queryFn: async () => {
      const { data } = await httpClient.get(`/users/agents/agency/${agencyId}`);
      return data;
    },
  });

  const { data: propertiesData } = useQuery({
    queryKey: ["agencyProperties", agencyId],
    queryFn: async () => {
      const { data } = await httpClient.get("/properties", {
        params: { agencyId, limit: 6 },
      });
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-heading mb-4">Agence introuvable</h2>
        <Link href="/agencies">
          <Button variant="outline">Voir toutes les agences</Button>
        </Link>
      </div>
    );
  }

  const agents = Array.isArray(agentsData) ? agentsData : [];
  const properties = propertiesData?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête agence */}
      <div className="bg-surface rounded-2xl shadow-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <BuildingOfficeIcon className="h-12 w-12 text-primary-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-heading mb-2">{agency.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-primary-600 mb-4">
              {agency.city && (
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  {agency.city}, {agency.country}
                </span>
              )}
              {agency.phone && (
                <span className="flex items-center gap-1">
                  <PhoneIcon className="h-4 w-4" />
                  {agency.phone}
                </span>
              )}
              {agency.email && (
                <span className="flex items-center gap-1">
                  <EnvelopeIcon className="h-4 w-4" />
                  {agency.email}
                </span>
              )}
              {agency.website && (
                <a
                  href={agency.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent"
                >
                  <GlobeAltIcon className="h-4 w-4" />
                  Site web
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Agents de l'agence */}
      {agents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-heading mb-6 flex items-center gap-2">
            <UserGroupIcon className="h-6 w-6" />
            Agents de l'agence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.slice(0, 6).map((agent: any) => (
              <Link key={agent.id} href={`/agents/${agent.id}`}>
                <Card className="hover:shadow-soft transition-all">
                  <div className="flex items-center gap-3">
                    <img
                      src={agent.avatar || "/images/avatar-placeholder.png"}
                      alt={agent.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {agent.firstName} {agent.lastName}
                      </p>
                      <p className="text-sm text-primary-500">
                        {agent.position}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Biens de l'agence */}
      {properties.length > 0 && (
        <div>
          <h2 className="text-2xl font-heading mb-6">
            Biens gérés par cette agence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
