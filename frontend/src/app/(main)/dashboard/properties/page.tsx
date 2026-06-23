'use client';

import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useMyProperties } from '@/features/property-management/hooks/useMyProperties';
import { useDeleteProperty } from '@/features/property-management/hooks/useDeleteProperty';
import { usePublishProperty } from '@/features/property-management/hooks/usePublishProperty';
import { Button } from '@/shared/ui/components/Button/Button';
import { Card } from '@/shared/ui/components/Card/Card';
import Link from 'next/link';
import { formatPrice } from '@/shared/lib/formatters/currency.formatter';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function MyPropertiesPage() {
  const user = useAuthStore(s => s.user);
  const { data, isLoading } = useMyProperties(user?.id || '');
  const deleteMutation = useDeleteProperty();
  const { publish, unpublish } = usePublishProperty();

  const properties = data?.data?.items || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading">Mes propriétés</h1>
        <Link href="/dashboard/properties/new">
          <Button variant="primary">Ajouter une propriété</Button>
        </Link>
      </div>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="space-y-4">
          {properties.map((property: any) => (
            <Card key={property.id} padding="md" className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={property.media?.[0]?.url || '/images/property-placeholder.jpg'}
                  alt=""
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium">{property.title}</h3>
                  <p className="text-sm text-primary-500">
                    {formatPrice(
                      property.listing?.price?.amount,
                      property.listing?.price?.currency,
                    )}{' '}
                    - {property.status === 'published' ? 'Publiée' : 'Brouillon'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/properties/${property.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </Link>
                {property.status === 'published' ? (
                  <Button variant="outline" size="sm" onClick={() => unpublish.mutate(property.id)}>
                    Dépublier
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => publish.mutate(property.id)}>
                    Publier
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMutation.mutate(property.id)}
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
