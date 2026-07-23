"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/components/Button/Button";
import { Card } from "@/shared/ui/components/Card/Card";
import { Input } from "@/shared/ui/components/Input/Input";
import { EmptyState } from "@/shared/ui/components/EmptyState/EmptyState";
import { Skeleton } from "@/shared/ui/components/Skeleton/Skeleton";
import {
  useSavedSearches,
  useCreateSavedSearch,
  useToggleSavedSearch,
  useDeleteSavedSearch,
} from "@/features/alerts/hooks/useSavedSearches";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";
import { BellAlertIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function AlertsPage() {
  const { data: alerts, isLoading } = useSavedSearches();
  const createMutation = useCreateSavedSearch();
  const toggleMutation = useToggleSavedSearch();
  const deleteMutation = useDeleteSavedSearch();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [transactionType, setTransactionType] = useState<"sale" | "rent">("sale");
  const [city, setCity] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedroomsMin, setBedroomsMin] = useState("");

  const resetForm = () => {
    setName("");
    setCity("");
    setPriceMin("");
    setPriceMax("");
    setBedroomsMin("");
  };

  const saveAlert = async () => {
    await createMutation.mutateAsync({
      name: name || (transactionType === "sale" ? "Alerte achat" : "Alerte location"),
      transactionType,
      city: city || undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      bedroomsMin: bedroomsMin ? Number(bedroomsMin) : undefined,
    });
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading flex items-center gap-3">
          <BellAlertIcon className="h-8 w-8 text-accent" />
          Mes alertes
        </h1>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          <PlusIcon className="h-5 w-5 mr-1" />
          Nouvelle alerte
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <h2 className="font-heading text-lg mb-4">Créer une alerte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom de l'alerte"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Appartement Douala"
            />
            <div>
              <label htmlFor="alert-transaction-type" className="block text-sm font-medium mb-1">
                Type de transaction
              </label>
              <select
                id="alert-transaction-type"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as "sale" | "rent")}
                className="w-full p-3 rounded-lg border border-primary-200 bg-surface"
              >
                <option value="sale">Acheter</option>
                <option value="rent">Louer</option>
              </select>
            </div>
            <Input label="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input
              label="Chambres min"
              type="number"
              value={bedroomsMin}
              onChange={(e) => setBedroomsMin(e.target.value)}
            />
            <Input
              label="Prix min (XAF)"
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <Input
              label="Prix max (XAF)"
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
          <p className="mt-3 text-xs text-primary-400">
            Vous serez notifié dès qu'un bien correspondant à ces critères sera publié.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="primary"
              onClick={saveAlert}
              disabled={createMutation.isPending}
            >
              Enregistrer
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !alerts || alerts.length === 0 ? (
        !showForm && (
          <EmptyState
            icon={<BellAlertIcon className="h-9 w-9" />}
            title="Aucune alerte"
            description="Créez des alertes pour être notifié des nouveaux biens correspondant à vos critères."
          />
        )
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              padding="md"
              className="flex justify-between items-center gap-4"
            >
              <div className="min-w-0">
                <h3 className="font-medium text-primary-900">{alert.name}</h3>
                <p className="text-sm text-primary-500">
                  {alert.criteria.transactionType === "rent" ? "Location" : "Achat"}
                  {alert.criteria.city && ` • ${alert.criteria.city}`}
                  {alert.criteria.priceMin &&
                    ` • ≥ ${formatPrice(alert.criteria.priceMin)}`}
                  {alert.criteria.priceMax &&
                    ` • ≤ ${formatPrice(alert.criteria.priceMax)}`}
                  {alert.criteria.bedroomsMin && ` • ${alert.criteria.bedroomsMin}+ ch.`}
                </p>
                {alert.lastNotifiedAt && (
                  <p className="text-xs text-primary-400 mt-1">
                    Dernière notification le{" "}
                    {new Date(alert.lastNotifiedAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={alert.active}
                  aria-label={alert.active ? "Désactiver l'alerte" : "Activer l'alerte"}
                  onClick={() =>
                    toggleMutation.mutate({ id: alert.id, active: !alert.active })
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    alert.active ? "bg-accent" : "bg-primary-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      alert.active ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(alert.id)}
                  aria-label="Supprimer l'alerte"
                  className="text-primary-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
