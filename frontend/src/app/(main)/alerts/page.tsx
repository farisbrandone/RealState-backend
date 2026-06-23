"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/shared/ui/components/Button/Button";
import { Card } from "@/shared/ui/components/Card/Card";
import { Input } from "@/shared/ui/components/Input/Input";
import { toast } from "react-hot-toast";
import {
  BellAlertIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Alert {
  id: string;
  name: string;
  transactionType: string;
  city: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  frequency: "daily" | "weekly";
}

export default function AlertsPage() {
  const user = useAuthStore((s) => s.user);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [transactionType, setTransactionType] = useState("sale");
  const [city, setCity] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("weekly");

  useEffect(() => {
    const stored = localStorage.getItem("luxhorizon_alerts");
    if (stored) setAlerts(JSON.parse(stored));
  }, []);

  const saveAlert = () => {
    if (!city) {
      toast.error("La ville est obligatoire");
      return;
    }
    const newAlert: Alert = {
      id: Date.now().toString(),
      name: name || `Alerte ${city}`,
      transactionType,
      city,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      frequency,
    };
    const updated = [...alerts, newAlert];
    setAlerts(updated);
    localStorage.setItem("luxhorizon_alerts", JSON.stringify(updated));
    toast.success("Alerte créée !");
    setShowForm(false);
    setName("");
    setCity("");
    setPriceMin("");
    setPriceMax("");
    setBedrooms("");
  };

  const deleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    localStorage.setItem("luxhorizon_alerts", JSON.stringify(updated));
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
              <label className="block text-sm font-medium mb-1">
                Type de transaction
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full p-3 rounded-lg border border-primary-200"
              >
                <option value="sale">Acheter</option>
                <option value="rent">Louer</option>
              </select>
            </div>
            <Input
              label="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Fréquence
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full p-3 rounded-lg border border-primary-200"
              >
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
              </select>
            </div>
            <Input
              label="Prix min"
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <Input
              label="Prix max"
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
            <Input
              label="Chambres min"
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            />
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="primary" onClick={saveAlert}>
              Enregistrer
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
          </div>
        </Card>
      )}

      {alerts.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <BellAlertIcon className="h-16 w-16 text-primary-200 mx-auto mb-4" />
          <h3 className="text-xl font-heading mb-2">Aucune alerte</h3>
          <p className="text-primary-500">
            Créez des alertes pour être notifié des nouveaux biens correspondant
            à vos critères.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              padding="md"
              className="flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{alert.name}</h3>
                <p className="text-sm text-primary-500">
                  {alert.transactionType === "sale" ? "Achat" : "Location"} •{" "}
                  {alert.city}
                  {alert.priceMin && ` • ≥ ${alert.priceMin} €`}
                  {alert.priceMax && ` • ≤ ${alert.priceMax} €`}
                  {alert.bedrooms && ` • ${alert.bedrooms} ch.`}
                </p>
                <p className="text-xs text-primary-400 mt-1">
                  Fréquence :{" "}
                  {alert.frequency === "daily" ? "Quotidienne" : "Hebdomadaire"}
                </p>
              </div>
              <button
                onClick={() => deleteAlert(alert.id)}
                className="text-primary-400 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
