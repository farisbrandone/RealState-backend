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
  BuildingOfficeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import httpClient from "@/shared/api/clients/http.client";

export default function AgenciesPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["agencies", search],
    queryFn: async () => {
      const { data } = await httpClient.get("/agencies", {
        params: { q: search },
      });
      return data;
    },
  });

  const agencies = Array.isArray(data) ? data : data?.data || [];

  return (
    <div className="min-h-screen">
      <section className="bg-primary-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            Agences partenaires
          </h1>
          <p className="text-primary-200 mb-8">
            Découvrez notre réseau d'agences immobilières en Afrique francophone
          </p>
          <div className="max-w-xl mx-auto">
            <Input
              placeholder="Rechercher une agence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              className="bg-white"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : agencies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary-500 text-lg mb-4">
              Aucune agence trouvée.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency: any) => (
              <Link
                key={agency.id}
                href={`/agencies/${agency.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-soft transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <BuildingOfficeIcon className="h-8 w-8 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg group-hover:text-accent transition-colors">
                        {agency.name}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-primary-600">
                    {agency.city && (
                      <p className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        {agency.city}, {agency.country}
                      </p>
                    )}
                    {agency.phone && (
                      <p className="flex items-center gap-1">
                        <PhoneIcon className="h-4 w-4" />
                        {agency.phone}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
