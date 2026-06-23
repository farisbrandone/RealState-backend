"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchStore } from "@/features/property-search/stores/search.store";
import { usePropertySearch } from "@/features/property-search/hooks/usePropertySearch";
import { SearchBar } from "@/widgets/SearchBar/SearchBar";
import { PropertyCard } from "@/widgets/PropertyCard/PropertyCard";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import { Button } from "@/shared/ui/components/Button/Button";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  HomeModernIcon,
  StarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";

const DynamicMapContainer = dynamic(
  () =>
    import("@/features/map/components/MapContainer/MapContainer").then(
      (mod) => mod.MapContainer,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[70vh] w-full absolute inset-0" />,
  },
);

const DynamicMapMarkers = dynamic(
  () =>
    import("@/features/map/components/MapMarkers/MapMarkers").then(
      (mod) => mod.MapMarkers,
    ),
  { ssr: false },
);

export default function HomePage() {
  const { data: searchData, isLoading } = usePropertySearch();
  const results = useSearchStore((s) => s.results);
  const properties = results?.items || [];
  const viewMode = useSearchStore((s) => s.viewMode);

  const stats = [
    { label: "Biens disponibles", value: 12450, icon: HomeModernIcon },
    { label: "Agences partenaires", value: 342, icon: BuildingOfficeIcon },
    { label: "Agents experts", value: 1580, icon: StarIcon },
    { label: "Prix moyen/m²", value: "85 000 FCFA", icon: ArrowTrendingUpIcon },
  ];

  return (
    <div className="min-h-screen">
      {/* SECTION HERO AVEC CARTE PLEIN ÉCRAN */}
      <section className="relative h-[85vh] min-h-[600px] bg-primary-900 overflow-hidden">
        <div className="absolute inset-0">
          <DynamicMapContainer className="h-full w-full">
            <DynamicMapMarkers properties={properties.slice(0, 20)} />
          </DynamicMapContainer>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-16 px-4">
          <div className="text-center max-w-4xl mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-4 leading-tight">
              Trouvez le bien
              <span className="block text-accent">qui vous correspond</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Appartements, studios, chambres, boutiques, terrains… Explorez
              notre sélection diversifiée de biens immobiliers partout en
              Afrique francophone.
            </p>

            <div className="max-w-4xl mx-auto">
              <SearchBar />
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link href="/buy">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Acheter
                </Button>
              </Link>
              <Link href="/rent">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Louer
                </Button>
              </Link>
              <Link href="/estimate">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                >
                  Estimer mon bien
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* SECTION STATISTIQUES */}
      <section className="relative -mt-12 z-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-surface rounded-xl shadow-card p-6 flex items-center gap-4 hover:shadow-soft transition-shadow"
            >
              <div className="bg-accent/10 p-3 rounded-lg">
                <stat.icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-900">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION BIOGRAPHIE LUXHORIZON */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading mb-6">
              LuxHorizon, votre partenaire
              <span className="text-accent"> immobilier en Afrique</span>
            </h2>
            <p className="text-primary-600 mb-4 leading-relaxed">
              LuxHorizon connecte acheteurs, locataires et propriétaires à
              travers une plateforme moderne et accessible. Notre présence
              couvre plusieurs pays d'Afrique francophone pour vous offrir un
              large choix de biens adaptés à tous les besoins.
            </p>
            <p className="text-primary-600 mb-6 leading-relaxed">
              Avec des milliers de biens référencés, des agences partenaires
              locales et des agents experts de votre région, nous simplifions
              votre recherche immobilière.
            </p>
            <div className="flex gap-4">
              <Link href="/agencies">
                <Button variant="outline" size="md">
                  Voir les agences
                </Button>
              </Link>
              <Link href="/agents">
                <Button variant="outline" size="md">
                  Nos agents
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-soft">
              <img
                src="/images/property-africa.jpg"
                alt="Propriété en Afrique"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-surface rounded-xl shadow-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <StarIcon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-lg">4.8/5</p>
                  <p className="text-sm text-primary-500">
                    Satisfaction client
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION BIENS VEDETTES */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-heading mb-2">Biens à la une</h2>
              <p className="text-primary-500">
                Notre sélection de biens populaires
              </p>
            </div>
            <Link href="/search">
              <Button variant="outline" size="md">
                Voir tous les biens
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION SERVICES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-heading text-center mb-12">
          Nos <span className="text-accent">services</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Estimation en ligne",
              description:
                "Obtenez une estimation de votre bien en quelques clics.",
              icon: ArrowTrendingUpIcon,
              href: "/estimate",
            },
            {
              title: "Visite guidée",
              description:
                "Découvrez les biens à distance grâce à nos visites commentées.",
              icon: MapPinIcon,
              href: "/search",
            },
            {
              title: "Simulation financière",
              description:
                "Calculez votre budget et vos mensualités adaptés au contexte local.",
              icon: BuildingOfficeIcon,
              href: "/invest",
            },
          ].map((service, index) => (
            <Link key={index} href={service.href} className="group">
              <div className="bg-surface rounded-xl shadow-card p-8 text-center hover:shadow-soft transition-all transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading mb-2">{service.title}</h3>
                <p className="text-primary-500">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION BLOG (aperçu) */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading">Actualités immobilières</h2>
            <Link href="/blog">
              <Button variant="outline" size="md">
                Lire le blog
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Les tendances du marché en 2025",
                excerpt:
                  "Découvrez les prévisions pour le marché immobilier en Afrique.",
                date: "15 Jan 2025",
                image: "/images/blog-1.jpg",
              },
              {
                title: "Investir dans l'immobilier locatif",
                excerpt: "Les clés pour réussir votre investissement locatif.",
                date: "10 Jan 2025",
                image: "/images/blog-2.jpg",
              },
              {
                title: "Guide : acheter à l'étranger",
                excerpt:
                  "Tout ce qu'il faut savoir avant d'acheter un bien à l'étranger.",
                date: "5 Jan 2025",
                image: "/images/blog-3.jpg",
              },
            ].map((article, index) => (
              <Link
                key={index}
                href={`/blog/${article.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="group"
              >
                <div className="bg-surface rounded-xl shadow-card overflow-hidden hover:shadow-soft transition-all">
                  <div className="aspect-[16/9] bg-primary-200">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-primary-400 mb-2">
                      {article.date}
                    </p>
                    <h3 className="font-heading text-lg mb-2 group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-primary-500 text-sm">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION CONTACT / CTA */}
      <section className="bg-primary-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading text-white mb-4">
            Prêt à trouver votre bien ?
          </h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Nos experts locaux sont à votre disposition pour vous accompagner
            dans votre projet immobilier.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Nous contacter
              </Button>
            </Link>
            <Link href="/estimate">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
              >
                Estimation gratuite
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
