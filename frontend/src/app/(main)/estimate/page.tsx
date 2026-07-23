"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/components/Button/Button";
import { Input } from "@/shared/ui/components/Input/Input";
import { Card } from "@/shared/ui/components/Card/Card";
import {
  MapPinIcon,
  ArrowsPointingOutIcon,
  HomeIcon,
  CalculatorIcon,
} from "@heroicons/react/24/outline";

export default function EstimatePage() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [surface, setSurface] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<{ min: number; max: number } | null>(
    null,
  );

  const handleEstimate = () => {
    // Simulation d'estimation
    const base = surface ? Number(surface) * 800 : 50000;
    const factor = bedrooms ? Number(bedrooms) * 10000 : 0;
    const min = Math.round(base + factor * 0.8);
    const max = Math.round(base + factor * 1.2);
    setResult({ min, max });
    setStep(3);
  };

  const formatFCFA = (value: number) => {
    return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-ink py-16 px-4 text-center">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">
          Estimez votre bien
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Obtenez une estimation gratuite de votre bien immobilier en quelques
          clics
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 -mt-8">
        <Card className="shadow-card">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-heading mb-4">
                Informations du bien
              </h2>
              <Input
                label="Adresse"
                placeholder="Rue, quartier..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                icon={<MapPinIcon className="h-5 w-5" />}
              />
              <Input
                label="Ville"
                placeholder="Ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                icon={<MapPinIcon className="h-5 w-5" />}
              />
              <div>
                <label className="block text-sm font-medium mb-1">
                  Type de bien
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 rounded-lg border border-primary-200"
                >
                  <option value="">Sélectionnez</option>
                  <option value="apartment">Appartement</option>
                  <option value="house">Maison</option>
                  <option value="studio">Studio</option>
                  <option value="land">Terrain</option>
                  <option value="commercial">Local commercial</option>
                </select>
              </div>
              <Input
                label="Surface (m²)"
                type="number"
                placeholder="Ex: 85"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                icon={<ArrowsPointingOutIcon className="h-5 w-5" />}
              />
              <Input
                label="Nombre de chambres"
                type="number"
                placeholder="Ex: 3"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                icon={<HomeIcon className="h-5 w-5" />}
              />
              <Input
                label="Année de construction"
                type="number"
                placeholder="Ex: 2015"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
              />
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setStep(2)}
              >
                Continuer
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-heading mb-4">Vos coordonnées</h2>
              <Input
                label="Email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Téléphone (optionnel)"
                type="tel"
                placeholder="+237..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-sm text-primary-500">
                Votre estimation sera envoyée à cette adresse email.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Retour
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleEstimate}
                >
                  <CalculatorIcon className="h-5 w-5 mr-2" />
                  Estimer
                </Button>
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CalculatorIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-heading">Estimation estimée</h2>
              <div className="text-4xl font-bold text-accent">
                {formatFCFA(result.min)} - {formatFCFA(result.max)}
              </div>
              <p className="text-primary-500">
                Cette estimation est basée sur les informations fournies et les
                données du marché local.
              </p>
              <Button
                variant="primary"
                onClick={() => setStep(1)}
                className="mt-4"
              >
                Nouvelle estimation
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
