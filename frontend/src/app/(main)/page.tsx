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
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import { CalendarIcon } from "lucide-react";
import { blogPosts } from "@/shared/data/blog-posts";

const DynamicMapContainer = dynamic(
  () =>
    import("@/features/map/components/MapContainer/MapContainer").then(
      (mod) => mod.MapContainer,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full absolute inset-0" />,
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
    { label: "Biens disponibles", value: "12 450", icon: HomeModernIcon },
    { label: "Agences partenaires", value: "342", icon: BuildingOfficeIcon },
    { label: "Agents experts", value: "1 580", icon: StarIcon },
    { label: "Prix moyen/m²", value: "85 000 FCFA", icon: ArrowTrendingUpIcon },
  ];

  const heroCtas = [
    { href: "/buy", label: "Acheter", icon: MagnifyingGlassIcon },
    { href: "/rent", label: "Louer", icon: MagnifyingGlassIcon },
    { href: "/estimate", label: "Estimer mon bien", icon: null },
  ];

  return (
    <div className="min-h-screen">
      {/* ============ SECTION HERO ============ */}
      {/*
        Fix clé : plus de hauteur figée (h-[85vh]) combinée à overflow-hidden
        sur toute la section. Le fond carte est cadré indépendamment (inset-0
        + overflow-hidden UNIQUEMENT sur ce calque), tandis que la section
        elle-même utilise min-h-* et grandit avec son contenu. Ainsi, quel que
        soit le texte affiché sur mobile, rien n'est jamais rogné.
      */}
      <section className="relative min-h-[620px] sm:min-h-[700px] lg:min-h-[760px] bg-ink">
        {/* Fond carte, cadré */}
        <div className="absolute inset-0 overflow-hidden">
          <DynamicMapContainer className="h-full w-full">
            <DynamicMapMarkers properties={properties.slice(0, 20)} />
          </DynamicMapContainer>
        </div>

        {/* Overlays de lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25 pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 lg:hidden pointer-events-none" />

        {/* Contenu — flux naturel, jamais tronqué. Centré verticalement
            (plutôt que justify-end) : avec justify-end, le pt-24 ne servait
            à rien puisque le contenu était de toute façon plaqué en bas,
            créant un grand vide entre le header et le titre. */}
        <div className="relative z-10 flex min-h-[620px] sm:min-h-[700px] lg:min-h-[760px] flex-col justify-center px-4 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-4xl text-center">
            <h1 className="mb-3 font-heading font-bold leading-[1.08] text-white text-[clamp(2rem,7vw,4.5rem)] sm:mb-4">
              Trouvez le bien
              <span className="block text-accent">qui vous correspond</span>
            </h1>
            <p className="mx-auto mb-6 max-w-2xl px-2 text-sm text-white/80 sm:mb-8 sm:text-base md:text-lg lg:text-xl">
              Appartements, studios, chambres, boutiques, terrains… Explorez
              notre sélection diversifiée de biens immobiliers partout en
              Afrique francophone.
            </p>

            <div className="mx-auto max-w-4xl">
              <SearchBar />
            </div>

            <div className="mx-auto mt-5 grid max-w-lg grid-cols-2 gap-2 sm:mt-6 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-4">
              {heroCtas.map((cta, i) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className={i === 2 ? "col-span-2 sm:col-span-1" : ""}
                >
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full border border-white/20 bg-white/10 px-3 py-2.5 text-xs text-white backdrop-blur-md hover:bg-white/20 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                  >
                    {cta.icon && (
                      <cta.icon className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                    )}
                    {cta.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce sm:flex">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 pt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* ============ SECTION STATISTIQUES ============ */}
      <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-4 sm:-mt-12">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-card transition-shadow hover:shadow-soft sm:gap-4 sm:p-6"
            >
              <div className="shrink-0 rounded-lg bg-accent/10 p-2.5 sm:p-3">
                <stat.icon className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-primary-900 sm:text-2xl">
                  {stat.value}
                </p>
                <p className="truncate text-[11px] leading-snug text-primary-500 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SECTION BIOGRAPHIE LUXHORIZON ============ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="mb-4 font-heading text-2xl sm:text-3xl md:text-4xl sm:mb-6">
              LuxHorizon, votre partenaire
              <span className="text-accent"> immobilier en Afrique</span>
            </h2>
            <p className="mb-4 leading-relaxed text-primary-600">
              LuxHorizon connecte acheteurs, locataires et propriétaires à
              travers une plateforme moderne et accessible. Notre présence
              couvre plusieurs pays d'Afrique francophone pour vous offrir un
              large choix de biens adaptés à tous les besoins.
            </p>
            <p className="mb-6 leading-relaxed text-primary-600">
              Avec des milliers de biens référencés, des agences partenaires
              locales et des agents experts de votre région, nous simplifions
              votre recherche immobilière.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
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
          <div className="relative px-2 sm:px-0">
            <div className="aspect-[4/3] overflow-hidden rounded-xl shadow-soft">
              <img
                src="/images/property-africa.png"
                alt="Propriété en Afrique"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -left-2 rounded-xl bg-surface p-3 shadow-card sm:-bottom-6 sm:-left-6 sm:p-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 sm:h-12 sm:w-12">
                  <StarIcon className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-base font-bold sm:text-lg">4.8/5</p>
                  <p className="text-xs text-primary-500 sm:text-sm">
                    Satisfaction client
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION BIENS VEDETTES ============ */}
      <section className="bg-primary-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mb-1.5 font-heading text-2xl sm:mb-2 sm:text-3xl">
                Biens à la une
              </h2>
              <p className="text-sm text-primary-500 sm:text-base">
                Notre sélection de biens populaires
              </p>
            </div>
            <Link href="/search" className="self-start sm:self-auto">
              <Button variant="outline" size="md">
                Voir tous les biens
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[380px] rounded-xl sm:h-[400px]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {properties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ SECTION SERVICES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <h2 className="mb-10 text-center font-heading text-2xl sm:mb-12 sm:text-3xl">
          Nos <span className="text-accent">services</span>
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
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
              <div className="transform rounded-xl bg-surface p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-soft sm:p-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20 sm:h-16 sm:w-16">
                  <service.icon className="h-7 w-7 text-accent sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-2 font-heading text-lg sm:text-xl">
                  {service.title}
                </h3>
                <p className="text-sm text-primary-500 sm:text-base">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ SECTION BLOG (aperçu) ============ */}
      <section className="bg-primary-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-2xl sm:text-3xl">
              Actualités immobilières
            </h2>
            <Link href="/blog">
              <Button variant="outline" size="md">
                Lire le blog
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-card transition-all hover:shadow-soft">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={
                        post.coverImage ||
                        `https://picsum.photos/seed/${post.slug}/600/400`
                      }
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-accent px-2 py-1 text-xs text-ink">
                      {post.category}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-primary-400">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 flex-1 font-heading text-base transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    <span className="mt-2 flex items-center gap-1 text-sm font-medium text-accent">
                      Lire <ArrowRightIcon className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION CONTACT / CTA ============ */}
      <section className="bg-ink py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 font-heading text-2xl text-white sm:text-3xl md:text-4xl">
            Prêt à trouver votre bien ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-sm text-white/70 sm:text-base">
            Nos experts locaux sont à votre disposition pour vous accompagner
            dans votre projet immobilier.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Nous contacter
              </Button>
            </Link>
            <Link href="/estimate">
              <Button
                variant="secondary"
                size="lg"
                className="w-full border border-white/20 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
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
