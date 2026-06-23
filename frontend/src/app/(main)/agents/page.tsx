"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Input } from "@/shared/ui/components/Input/Input";
import { Card } from "@/shared/ui/components/Card/Card";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import { Button } from "@/shared/ui/components/Button/Button";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import httpClient from "@/shared/api/clients/http.client";

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["agents", search, specialty],
    queryFn: async () => {
      const params: any = { limit: 20 };
      if (search) params.q = search;
      if (specialty) params.specialty = specialty;
      const { data } = await httpClient.get("/users/search", { params });
      return data;
    },
  });

  const agents = data || [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            Nos agents experts
          </h1>
          <p className="text-primary-200 mb-8">
            Des professionnels de l'immobilier à votre service dans toute
            l'Afrique francophone
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un agent..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                className="bg-white"
              />
            </div>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="p-3 rounded-xl bg-white text-primary-900 border-0 focus:ring-2 focus:ring-accent"
            >
              <option value="">Toutes les spécialités</option>
              <option value="résidentiel">Résidentiel</option>
              <option value="location">Location</option>
              <option value="gestion de patrimoine">
                Gestion de patrimoine
              </option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>
      </section>

      {/* Liste des agents */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary-500 text-lg mb-4">Aucun agent trouvé.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setSpecialty("");
              }}
            >
              Voir tous les agents
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent: any) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-soft transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={agent.avatar || "/images/avatar-placeholder.png"}
                        alt={`${agent.firstName} ${agent.lastName}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-heading text-lg group-hover:text-accent transition-colors">
                          {agent.firstName} {agent.lastName}
                        </h3>
                        {agent.company && (
                          <p className="text-sm text-primary-500">
                            {agent.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-primary-600">
                      {agent.city && (
                        <p className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {agent.city}, {agent.country}
                        </p>
                      )}
                      {agent.specialties && agent.specialties.length > 0 && (
                        <p className="flex items-center gap-1">
                          <BuildingOfficeIcon className="h-4 w-4" />
                          {agent.specialties.join(", ")}
                        </p>
                      )}
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-accent" />
                        <span>{agent.averageRating?.toFixed(1) || "N/A"}</span>
                        <span className="text-primary-400">
                          ({agent.propertiesListed || 0} biens)
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-primary-100 flex gap-2">
                      {agent.phone && (
                        <a
                          href={`tel:${agent.phone}`}
                          className="flex items-center gap-1 text-sm text-accent hover:text-accent-dark"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <PhoneIcon className="h-4 w-4" />
                          Appeler
                        </a>
                      )}
                      {agent.email && (
                        <a
                          href={`mailto:${agent.email}`}
                          className="flex items-center gap-1 text-sm text-accent hover:text-accent-dark"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <EnvelopeIcon className="h-4 w-4" />
                          Email
                        </a>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
