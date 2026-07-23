"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useMyProperties } from "@/features/property-management/hooks/useMyProperties";
import { useDeleteProperty } from "@/features/property-management/hooks/useDeleteProperty";
import { usePublishProperty } from "@/features/property-management/hooks/usePublishProperty";
import { Button } from "@/shared/ui/components/Button/Button";
import { Card } from "@/shared/ui/components/Card/Card";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { getMediaUrl } from "@/shared/lib/media/media-url";

export default function MyPropertiesPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useMyProperties(user?.id || "");
  const deleteMutation = useDeleteProperty();
  const { publish, unpublish } = usePublishProperty();

  const properties = data?.items || [];

  const handleDelete = (id: string) => {
    if (confirm("Supprimer définitivement ce bien ?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading">Mes propriétés</h1>
        <Link href="/dashboard/properties/new">
          <Button variant="primary">Ajouter un bien</Button>
        </Link>
      </div>
      {isLoading ? (
        <p className="text-primary-500">Chargement...</p>
      ) : properties.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-primary-500 mb-4">
            Vous n'avez pas encore de propriété.
          </p>
          <Link href="/dashboard/properties/new">
            <Button variant="primary">Ajouter votre premier bien</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {properties.map((property: any) => (
            <Card
              key={property.id}
              padding="md"
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    getMediaUrl(property.media?.[0]?.url) ||
                    "/images/property-placeholder.jpg"
                  }
                  alt={property.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium">{property.title}</h3>
                  <p className="text-sm text-primary-500">
                    {formatPrice(
                      property.listing?.price?.amount,
                      property.listing?.price?.currency,
                    )}{" "}
                    -{" "}
                    <span
                      className={
                        property.status === "published"
                          ? "text-green-600"
                          : "text-orange-500"
                      }
                    >
                      {property.status === "published"
                        ? "Publiée"
                        : "Brouillon"}
                    </span>
                  </p>
                  <p className="mt-1 flex items-center gap-3 text-xs text-primary-400">
                    <span className="flex items-center gap-1">
                      <EyeIcon className="h-3.5 w-3.5" />
                      {property.viewCount ?? 0} vue{(property.viewCount ?? 0) > 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <EnvelopeOpenIcon className="h-3.5 w-3.5" />
                      {property.inquiryCount ?? 0} contact
                      {(property.inquiryCount ?? 0) > 1 ? "s" : ""}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 self-end sm:self-center">
                <Link href={`/properties/${property.id}`} target="_blank">
                  <Button variant="outline" size="sm">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/dashboard/properties/${property.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </Link>
                {property.status === "published" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      unpublish.isPending && unpublish.variables === property.id
                    }
                    onClick={() => unpublish.mutate(property.id)}
                  >
                    {unpublish.isPending && unpublish.variables === property.id
                      ? "Dépublication..."
                      : "Dépublier"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={publish.isPending && publish.variables === property.id}
                    onClick={() => publish.mutate(property.id)}
                  >
                    {publish.isPending && publish.variables === property.id
                      ? "Publication..."
                      : "Publier"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    deleteMutation.isPending &&
                    deleteMutation.variables === property.id
                  }
                  onClick={() => handleDelete(property.id)}
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
