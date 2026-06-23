"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/shared/ui/components/Card/Card";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import { PropertyCard } from "@/widgets/PropertyCard/PropertyCard";
import { Button } from "@/shared/ui/components/Button/Button";
import {
  MapPinIcon,
  BuildingOfficeIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import httpClient from "@/shared/api/clients/http.client";

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;

  const { data: agent, isLoading } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: async () => {
      const { data } = await httpClient.get(`/users/${agentId}/profile`);
      return data;
    },
  });

  const { data: propertiesData } = useQuery({
    queryKey: ["agentProperties", agentId],
    queryFn: async () => {
      const { data } = await httpClient.get("/properties", {
        params: { ownerId: agentId, limit: 6 },
      });
      return data;
    },
    enabled: !!agentId,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-heading mb-4">Agent introuvable</h2>
        <Link href="/agents">
          <Button variant="outline">Voir tous les agents</Button>
        </Link>
      </div>
    );
  }

  const properties = propertiesData?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête agent */}
      <div className="bg-surface rounded-2xl shadow-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <img
            src={agent.avatar || "/images/avatar-placeholder.png"}
            alt={`${agent.firstName} ${agent.lastName}`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-heading">
                {agent.firstName} {agent.lastName}
              </h1>
              {agent.reputationScore > 80 && (
                <CheckBadgeIcon
                  className="h-6 w-6 text-accent"
                  title="Agent vérifié"
                />
              )}
            </div>
            <p className="text-primary-500 mb-2">
              {agent.position || "Agent immobilier"}
            </p>
            <p className="text-sm text-primary-500 mb-4">{agent.company}</p>

            <div className="flex flex-wrap gap-4 text-sm text-primary-600 mb-4">
              {agent.city && (
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  {agent.city}, {agent.country}
                </span>
              )}
              <span className="flex items-center gap-1">
                <StarIcon className="h-4 w-4 text-accent" />
                {agent.averageRating?.toFixed(1) || "N/A"} (
                {agent.propertiesListed || 0} biens)
              </span>
              <span className="flex items-center gap-1">
                <BuildingOfficeIcon className="h-4 w-4" />
                {agent.yearsOfExperience || 0} ans d'expérience
              </span>
            </div>

            {agent.specialties && agent.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {agent.specialties.map((s: string) => (
                  <span
                    key={s}
                    className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              {agent.phone && (
                <a href={`tel:${agent.phone}`}>
                  <Button variant="primary" size="sm">
                    <PhoneIcon className="h-4 w-4 mr-1" /> Appeler
                  </Button>
                </a>
              )}
              {agent.email && (
                <a href={`mailto:${agent.email}`}>
                  <Button variant="outline" size="sm">
                    <EnvelopeIcon className="h-4 w-4 mr-1" /> Email
                  </Button>
                </a>
              )}
              <Link href={`/messages?agentId=${agent.id}`}>
                <Button variant="outline" size="sm">
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-1" /> Message
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Biographie */}
      {agent.biography && (
        <Card className="mb-8">
          <h2 className="text-xl font-heading mb-4">À propos</h2>
          <p className="text-primary-700 whitespace-pre-wrap">
            {agent.biography}
          </p>
        </Card>
      )}

      {/* Ses biens */}
      {properties.length > 0 && (
        <div>
          <h2 className="text-2xl font-heading mb-6">Ses biens immobiliers</h2>
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
