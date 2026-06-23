"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useProperty } from "@/features/property-details/hooks/useProperty";
import { useSimilarProperties } from "@/features/property-details/hooks/useSimilarProperties";
import { PropertyGallery } from "@/widgets/PropertyGallery/PropertyGallery";
import { PropertyAgentCard } from "@/widgets/PropertyAgentCard/PropertyAgentCard";
import { PropertyContactForm } from "@/widgets/PropertyContactForm/PropertyContactForm";
import { PropertyShare } from "@/widgets/PropertyShare/PropertyShare";
import { PropertyMap } from "@/widgets/PropertyMap/PropertyMap";
import { PropertyHighlights } from "@/widgets/PropertyHighlights/PropertyHighlights";
import { Card } from "@/shared/ui/components/Card/Card";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import { PropertyCard } from "@/widgets/PropertyCard/PropertyCard";
import { PROPERTY_TYPES } from "@/shared/constants/property.constants";
import {
  MapPinIcon,
  HomeIcon,
  ArrowsPointingOutIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { BedIcon, BathIcon } from "lucide-react";
export default function PropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const { data: property, isLoading, isError } = useProperty(propertyId);

  // Propriétés similaires
  const { data: similarData } = useSimilarProperties({
    city: property?.address?.city,
    type: property?.listing?.type,
    price: property?.listing?.price?.amount,
    excludeId: propertyId,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full mb-6 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !property) {
    notFound();
  }

  const features = property.features;
  const listing = property.listing;
  const typeLabel =
    PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label ||
    property.propertyType;

  // Construction des points forts
  const highlights = [];
  if (features.hasGarden) highlights.push({ label: "Jardin" });
  if (features.hasPool) highlights.push({ label: "Piscine" });
  if (features.hasGarage) highlights.push({ label: "Garage" });
  if (features.hasTerrace) highlights.push({ label: "Terrasse" });
  if (features.hasAirConditioning) highlights.push({ label: "Climatisation" });
  if (features.hasSecurity) highlights.push({ label: "Sécurité 24/7" });
  if (features.hasGenerator) highlights.push({ label: "Groupe électrogène" });
  if (features.hasSolarPanels) highlights.push({ label: "Panneaux solaires" });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-primary-500 mb-4 flex items-center gap-1 flex-wrap">
        <a href="/" className="hover:text-accent">
          Accueil
        </a>
        <span>/</span>
        <a href="/search" className="hover:text-accent">
          Propriétés
        </a>
        <span>/</span>
        <span className="text-primary-900">{property.title}</span>
      </nav>

      {/* Titre, prix et actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-heading text-primary-900">
              {property.title}
            </h1>
            <span className="text-sm bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
              {typeLabel}
            </span>
          </div>
          <p className="text-primary-500 flex items-center gap-1 mt-1">
            <MapPinIcon className="h-4 w-4" />
            {property.address.street}, {property.address.postalCode}{" "}
            {property.address.city}, {property.address.country}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-3xl font-heading text-accent">
              {formatPrice(listing.price.amount, listing.price.currency)}
            </span>
            <span className="ml-2 text-sm uppercase bg-primary-100 px-3 py-1 rounded-full">
              {listing.type === "sale" ? "À vendre" : "À louer"}
            </span>
          </div>
          <PropertyShare
            propertyId={propertyId}
            propertyTitle={property.title}
          />
        </div>
      </div>

      {/* Galerie */}
      <PropertyGallery images={property.media} />

      {/* Points forts */}
      {highlights.length > 0 && (
        <div className="mt-6">
          <PropertyHighlights highlights={highlights} />
        </div>
      )}

      {/* Contenu principal en 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Colonne de gauche : détails */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card>
            <h2 className="text-xl font-heading mb-3">Description</h2>
            <p className="text-primary-700 whitespace-pre-wrap leading-relaxed">
              {property.description}
            </p>
          </Card>

          {/* Caractéristiques principales */}
          <Card>
            <h2 className="text-xl font-heading mb-4">Caractéristiques</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FeatureItem
                icon={<HomeIcon className="h-5 w-5" />}
                label="Pièces"
                value={features.rooms}
              />
              <FeatureItem
                icon={<BedIcon className="h-5 w-5" />}
                label="Chambres"
                value={features.bedrooms}
              />
              <FeatureItem
                icon={<BathIcon className="h-5 w-5" />}
                label="Salles de bain"
                value={features.bathrooms}
              />
              <FeatureItem
                icon={<ArrowsPointingOutIcon className="h-5 w-5" />}
                label="Surface habitable"
                value={`${features.livingArea.value} ${features.livingArea.unit}`}
              />
              {features.landArea && (
                <FeatureItem
                  icon={<ArrowsPointingOutIcon className="h-5 w-5" />}
                  label="Terrain"
                  value={`${features.landArea.value} ${features.landArea.unit}`}
                />
              )}
              {features.yearBuilt && (
                <FeatureItem
                  icon={<BuildingOfficeIcon className="h-5 w-5" />}
                  label="Année de construction"
                  value={features.yearBuilt}
                />
              )}
              {features.energyClass && (
                <FeatureItem
                  icon={<SparklesIcon className="h-5 w-5" />}
                  label="Classe énergie"
                  value={`${features.energyClass.letter} (${features.energyClass.consumption} kWh/m²)`}
                />
              )}
            </div>
          </Card>

          {/* Équipements */}
          <Card>
            <h2 className="text-xl font-heading mb-4">Équipements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <BooleanFeature
                label="Salon"
                value={features.hasLivingRoom || false}
              />
              <BooleanFeature
                label="Cuisine équipée"
                value={features.hasKitchen || false}
              />
              <BooleanFeature
                label="Douche"
                value={features.hasShower || false}
              />
              <BooleanFeature
                label="Salle de bain"
                value={features.hasBathroom || false}
              />
              <BooleanFeature label="Meublé" value={features.isFurnished} />
              <BooleanFeature label="Ascenseur" value={features.hasElevator} />
              <BooleanFeature label="Balcon" value={features.hasBalcony} />
              <BooleanFeature label="Terrasse" value={features.hasTerrace} />
              <BooleanFeature label="Parking" value={features.hasParking} />
              <BooleanFeature
                label="Garage"
                value={features.hasGarage || false}
              />
              <BooleanFeature label="Jardin" value={features.hasGarden} />
              <BooleanFeature label="Piscine" value={features.hasPool} />
              <BooleanFeature label="Cave" value={features.hasCellar} />
              <BooleanFeature
                label="Climatisation"
                value={features.hasAirConditioning}
              />
              <BooleanFeature label="Alarme" value={features.hasAlarm} />
              <BooleanFeature label="Interphone" value={features.hasIntercom} />
              <BooleanFeature
                label="Véranda"
                value={features.hasVeranda || false}
              />
            </div>
          </Card>

          {/* Spécificités locales */}
          <Card>
            <h2 className="text-xl font-heading mb-4">Spécificités locales</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <BooleanFeature
                label="Réservoir d'eau"
                value={features.hasWaterTank || false}
              />
              <BooleanFeature
                label="Groupe électrogène"
                value={features.hasGenerator || false}
              />
              <BooleanFeature
                label="Panneaux solaires"
                value={features.hasSolarPanels || false}
              />
              <BooleanFeature
                label="Sécurité 24/7"
                value={features.hasSecurity || false}
              />
              <BooleanFeature
                label="Clôture"
                value={features.hasFence || false}
              />
              <BooleanFeature
                label="Forage"
                value={features.hasBorehole || false}
              />
            </div>
          </Card>

          {/* Carte */}
          {property.address.coordinates && (
            <Card>
              <h2 className="text-xl font-heading mb-4">Localisation</h2>
              <PropertyMap
                latitude={property.address.coordinates.latitude}
                longitude={property.address.coordinates.longitude}
                title={property.title}
              />
              <p className="text-sm text-primary-500 mt-2">
                {property.address.street}, {property.address.city},{" "}
                {property.address.country}
              </p>
            </Card>
          )}
        </div>

        {/* Colonne de droite : agent, contact, stats */}
        <div className="space-y-6">
          {/* Carte agent */}
          <PropertyAgentCard
            agent={property.agent || null}
            propertyId={propertyId}
          />

          {/* Formulaire de contact */}
          <Card>
            <PropertyContactForm
              propertyId={propertyId}
              agentEmail={property.agent?.email}
              propertyTitle={property.title}
            />
          </Card>

          {/* Stats rapides */}
          <Card>
            <h3 className="font-heading text-lg mb-3">
              À propos de cette annonce
            </h3>
            <div className="space-y-2 text-sm text-primary-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Publié le{" "}
                {new Date(property.createdAt).toLocaleDateString("fr-FR")}
              </div>
              <div className="flex items-center gap-2">
                <EyeIcon className="h-4 w-4" />
                Vu 245 fois
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Propriétés similaires */}
      {similarData?.items && similarData.items.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-heading mb-6">Propriétés similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarData.items.map((item) => (
              <PropertyCard key={item.id} property={item} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Sous-composants
const FeatureItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
}> = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <span className="text-accent">{icon}</span>
    <div>
      <p className="text-sm text-primary-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const BooleanFeature: React.FC<{ label: string; value: boolean }> = ({
  label,
  value,
}) => (
  <div className="flex items-center gap-2">
    {value ? (
      <CheckCircleIcon className="h-5 w-5 text-green-500" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-primary-300" />
    )}
    <span className="text-sm">{label}</span>
  </div>
);
