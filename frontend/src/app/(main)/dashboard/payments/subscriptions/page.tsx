"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/shared/api/endpoints/payment.endpoints";
import { Card } from "@/shared/ui/components/Card/Card";
import { Button } from "@/shared/ui/components/Button/Button";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function SubscriptionsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: paymentApi.getSubscriptions,
  });

  const subscriptions = data?.data || [];

  const cancelMutation = useMutation({
    mutationFn: (id: string) => paymentApi.cancelSubscription(id),
    onSuccess: () => {
      toast.success("Abonnement résilié");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: () => toast.error("Erreur"),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading">Mes abonnements</h1>
        <Link href="/pricing">
          <Button variant="primary">Choisir un plan</Button>
        </Link>
      </div>
      {isLoading ? (
        <p>Chargement...</p>
      ) : subscriptions.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-primary-500 mb-4">
            Vous n'avez pas encore d'abonnement actif.
          </p>
          <Link href="/pricing">
            <Button variant="primary">Voir les offres</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub: any) => (
            <Card key={sub.id} padding="md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-heading text-lg">
                    {sub.plan?.name || "Abonnement"}
                  </h3>
                  <p className="text-3xl font-bold text-accent">
                    {formatPrice(
                      sub.plan?.amount?.amount || 0,
                      sub.plan?.amount?.currency || "XAF",
                    )}
                  </p>
                  <p className="text-sm text-primary-500">
                    Statut : <span className="font-medium">{sub.status}</span>
                  </p>
                  {sub.currentPeriodEnd && (
                    <p className="text-sm text-primary-500">
                      Prochain renouvellement :{" "}
                      {new Date(sub.currentPeriodEnd).toLocaleDateString(
                        "fr-FR",
                      )}
                    </p>
                  )}
                </div>
                {sub.status === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelMutation.mutate(sub.id)}
                  >
                    Résilier
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
