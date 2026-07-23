"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Input } from "@/shared/ui/components/Input/Input";
import { Card } from "@/shared/ui/components/Card/Card";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import { Button } from "@/shared/ui/components/Button/Button";
import { getMediaUrl } from "@/shared/lib/media/media-url";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import httpClient from "@/shared/api/clients/http.client";

interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  company?: string | null;
  city?: string | null;
  country?: string | null;
  specialties?: string[];
  averageRating?: number | null;
  propertiesListed?: number;
  phone?: string | null;
  email?: string;
}

interface AgentsSearchResponse {
  items: Agent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const PAGE_SIZE = 12;

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [page, setPage] = useState(1);

  // Debounce de la recherche pour éviter une requête à chaque frappe
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, specialty]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["agents", debouncedSearch, specialty, page],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        limit: PAGE_SIZE,
        page,
        userType: "AGENT", // ⬅️ ne récupère QUE les agents
      };
      if (debouncedSearch) params.q = debouncedSearch;
      if (specialty) params.specialty = specialty;

      const { data } = await httpClient.get<AgentsSearchResponse>(
        "/users/search",
        { params },
      );
      return data;
    },
    placeholderData: (prev) => prev,
  });

  const agents = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const hasFilters = useMemo(
    () => Boolean(search || specialty),
    [search, specialty],
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-ink py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            Nos agents experts
          </h1>
          <p className="text-white/70 mb-8">
            Des professionnels de l'immobilier à votre service dans toute
            l'Afrique francophone
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un agent, une agence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                className="bg-surface"
              />
            </div>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="p-3 rounded-xl bg-surface text-primary-900 border-0 focus:ring-2 focus:ring-accent"
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
        {!isLoading && !isError && (
          <p className="mb-6 text-sm text-primary-500">
            {total} agent{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-primary-600 mb-4">
              Une erreur est survenue lors du chargement des agents.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Réessayer
            </Button>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary-500 text-lg mb-4">
              Aucun agent trouvé{hasFilters ? " pour ces critères" : ""}.
            </p>
            {hasFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSpecialty("");
                }}
              >
                Voir tous les agents
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={
                          getMediaUrl(agent.avatar) ||
                          "/images/avatar-placeholder.png"
                        }
                        alt={`${agent.firstName} ${agent.lastName}`}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-100"
                      />
                      <div className="min-w-0">
                        <h3 className="font-heading text-lg truncate group-hover:text-accent transition-colors">
                          {agent.firstName} {agent.lastName}
                        </h3>
                        {agent.company && (
                          <p className="text-sm text-primary-500 truncate">
                            {agent.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-primary-600">
                      {agent.city && (
                        <p className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4 shrink-0" />
                          {agent.city}
                          {agent.country ? `, ${agent.country}` : ""}
                        </p>
                      )}
                      {agent.specialties && agent.specialties.length > 0 && (
                        <p className="flex items-center gap-1">
                          <BuildingOfficeIcon className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {agent.specialties.join(", ")}
                          </span>
                        </p>
                      )}
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-accent" />
                        <span>{agent.averageRating?.toFixed(1) ?? "N/A"}</span>
                        <span className="text-primary-400">
                          ({agent.propertiesListed ?? 0} biens)
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-primary-100 flex gap-4">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Précédent
                </Button>
                <span className="text-sm text-primary-500">
                  Page {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
