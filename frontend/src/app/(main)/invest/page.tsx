"use client";

import { useState } from "react";
import { Card } from "@/shared/ui/components/Card/Card";
import { Input } from "@/shared/ui/components/Input/Input";
import { Button } from "@/shared/ui/components/Button/Button";
import {
  CalculatorIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  HomeIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function InvestPage() {
  // État pour le calculateur de crédit
  const [loanAmount, setLoanAmount] = useState(20000000);
  const [loanRate, setLoanRate] = useState(5.5);
  const [loanDuration, setLoanDuration] = useState(15);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  // État pour le calculateur de rendement locatif
  const [purchasePrice, setPurchasePrice] = useState(25000000);
  const [monthlyRent, setMonthlyRent] = useState(150000);
  const [annualCharges, setAnnualCharges] = useState(200000);
  const [rentability, setRentability] = useState<number | null>(null);

  // État pour la capacité d'emprunt
  const [monthlyIncome, setMonthlyIncome] = useState(500000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(100000);
  const [maxLoan, setMaxLoan] = useState<number | null>(null);

  const calculateLoan = () => {
    const monthlyRate = loanRate / 100 / 12;
    const months = loanDuration * 12;
    const payment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    setMonthlyPayment(Math.round(payment));
  };

  const calculateRentability = () => {
    const annualRent = monthlyRent * 12;
    const netIncome = annualRent - annualCharges;
    const rate = (netIncome / purchasePrice) * 100;
    setRentability(Math.round(rate * 100) / 100);
  };

  const calculateMaxLoan = () => {
    const availableIncome = monthlyIncome - monthlyExpenses;
    const maxMonthlyPayment = availableIncome * 0.35; // 35% taux d'endettement
    const rate = loanRate / 100 / 12;
    const months = loanDuration * 12;
    const max =
      (maxMonthlyPayment * (Math.pow(1 + rate, months) - 1)) /
      (rate * Math.pow(1 + rate, months));
    setMaxLoan(Math.round(max));
  };

  const formatFCFA = (value: number) => {
    return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-ink py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
          Simulation financière
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
          Calculez votre budget, simulez vos mensualités et évaluez la
          rentabilité de vos projets immobiliers.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Calculateur de crédit */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accent/10 p-3 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-heading">
                Simulateur de crédit immobilier
              </h2>
              <p className="text-sm text-primary-500">
                Calculez vos mensualités en fonction du montant emprunté.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Montant du prêt
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-primary-200 focus:ring-2 focus:ring-accent"
                />
                <span className="absolute right-3 top-3 text-primary-400 text-sm">
                  FCFA
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Taux d'intérêt annuel (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={loanRate}
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-primary-200 focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Durée (années)
              </label>
              <select
                value={loanDuration}
                onChange={(e) => setLoanDuration(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-primary-200 focus:ring-2 focus:ring-accent"
              >
                <option value={5}>5 ans</option>
                <option value={10}>10 ans</option>
                <option value={15}>15 ans</option>
                <option value={20}>20 ans</option>
                <option value={25}>25 ans</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={calculateLoan}
              >
                <CalculatorIcon className="h-5 w-5 mr-2" />
                Calculer
              </Button>
            </div>
          </div>

          {monthlyPayment !== null && (
            <div className="bg-accent/5 border border-accent/10 rounded-xl p-6 text-center">
              <p className="text-sm text-primary-500 mb-1">
                Mensualité estimée
              </p>
              <p className="text-3xl font-bold text-accent">
                {formatFCFA(monthlyPayment)}
              </p>
              <p className="text-sm text-primary-500 mt-2">
                Coût total du crédit :{" "}
                {formatFCFA(monthlyPayment * loanDuration * 12 - loanAmount)}
              </p>
            </div>
          )}
        </Card>

        {/* Calculateur de rendement locatif */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accent/10 p-3 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-heading">Rendement locatif</h2>
              <p className="text-sm text-primary-500">
                Évaluez la rentabilité d'un investissement locatif.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Prix d'achat
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-primary-200 focus:ring-2 focus:ring-accent"
                />
                <span className="absolute right-3 top-3 text-primary-400 text-sm">
                  FCFA
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Loyer mensuel estimé
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-primary-200 focus:ring-2 focus:ring-accent"
                />
                <span className="absolute right-3 top-3 text-primary-400 text-sm">
                  FCFA
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Charges annuelles
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={annualCharges}
                  onChange={(e) => setAnnualCharges(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-primary-200 focus:ring-2 focus:ring-accent"
                />
                <span className="absolute right-3 top-3 text-primary-400 text-sm">
                  FCFA
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <Button variant="primary" size="md" onClick={calculateRentability}>
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              Calculer le rendement
            </Button>
          </div>

          {rentability !== null && (
            <div className="bg-accent/5 border border-accent/10 rounded-xl p-6 text-center">
              <p className="text-sm text-primary-500 mb-1">
                Rendement locatif net
              </p>
              <p className="text-3xl font-bold text-accent">{rentability} %</p>
              <p className="text-sm text-primary-500 mt-2">
                Revenu net annuel :{" "}
                {formatFCFA(monthlyRent * 12 - annualCharges)}
              </p>
              {/* Jauge visuelle */}
              <div className="w-full bg-primary-100 rounded-full h-3 mt-4">
                <div
                  className="bg-accent h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(rentability * 10, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-primary-400 mt-1">
                <span>0%</span>
                <span>5%</span>
                <span>10%+</span>
              </div>
            </div>
          )}
        </Card>

        {/* Capacité d'emprunt */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accent/10 p-3 rounded-lg">
              <HomeIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-heading">Capacité d'emprunt</h2>
              <p className="text-sm text-primary-500">
                Découvrez combien vous pouvez emprunter selon vos revenus.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Revenu mensuel
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-primary-200 focus:ring-2 focus:ring-accent"
                />
                <span className="absolute right-3 top-3 text-primary-400 text-sm">
                  FCFA
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Charges mensuelles
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-primary-200 focus:ring-2 focus:ring-accent"
                />
                <span className="absolute right-3 top-3 text-primary-400 text-sm">
                  FCFA
                </span>
              </div>
            </div>
            <div className="flex items-end">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={calculateMaxLoan}
              >
                <CalculatorIcon className="h-5 w-5 mr-2" />
                Estimer
              </Button>
            </div>
          </div>

          {maxLoan !== null && (
            <div className="bg-accent/5 border border-accent/10 rounded-xl p-6 text-center">
              <p className="text-sm text-primary-500 mb-1">
                Montant maximum empruntable
              </p>
              <p className="text-3xl font-bold text-accent">
                {formatFCFA(maxLoan)}
              </p>
              <p className="text-sm text-primary-500 mt-2">
                Basé sur un taux d'endettement de 35% sur {loanDuration} ans à{" "}
                {loanRate}%.
              </p>
            </div>
          )}
        </Card>

        {/* Section informative */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CurrencyDollarIcon className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-heading text-lg mb-2">Taux compétitifs</h3>
            <p className="text-sm text-primary-600">
              Les banques locales proposent des taux à partir de 5% pour les
              crédits immobiliers.
            </p>
          </Card>
          <Card className="text-center">
            <BuildingOfficeIcon className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-heading text-lg mb-2">Rendements attractifs</h3>
            <p className="text-sm text-primary-600">
              Le rendement locatif moyen en Afrique francophone se situe entre
              5% et 9%.
            </p>
          </Card>
          <Card className="text-center">
            <ArrowTrendingUpIcon className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-heading text-lg mb-2">
              Plus-value potentielle
            </h3>
            <p className="text-sm text-primary-600">
              La valeur des biens dans les grandes villes augmente de 5 à 10%
              par an.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
