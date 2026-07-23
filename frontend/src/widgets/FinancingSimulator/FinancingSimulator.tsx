"use client";

import { useMemo, useState } from "react";
import { CalculatorIcon } from "@heroicons/react/24/outline";
import { calculateMortgage } from "@/shared/lib/finance/mortgage";
import { formatPrice } from "@/shared/lib/formatters/currency.formatter";

interface FinancingSimulatorProps {
  price: number;
  currency: string;
}

const DEFAULT_RATE = 6.5; // taux indicatif moyen constaté en zone CEMAC/UEMOA
const DEFAULT_TERM_YEARS = 20;
const DEFAULT_DOWN_PAYMENT_PERCENT = 20;

export const FinancingSimulator: React.FC<FinancingSimulatorProps> = ({
  price,
  currency,
}) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState(DEFAULT_DOWN_PAYMENT_PERCENT);
  const [ratePercent, setRatePercent] = useState(DEFAULT_RATE);
  const [termYears, setTermYears] = useState(DEFAULT_TERM_YEARS);

  const downPaymentAmount = Math.round((price * downPaymentPercent) / 100);

  const result = useMemo(
    () =>
      calculateMortgage({
        price,
        downPaymentAmount,
        annualRatePercent: ratePercent,
        termYears,
      }),
    [price, downPaymentAmount, ratePercent, termYears],
  );

  return (
    <div className="rounded-xl bg-surface p-5 shadow-card">
      <h3 className="mb-4 flex items-center gap-2 font-heading text-lg text-primary-900">
        <CalculatorIcon className="h-5 w-5 text-accent" />
        Simulateur de financement
      </h3>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 flex justify-between text-sm text-primary-600">
            <span>Apport personnel</span>
            <span className="font-medium text-primary-900">
              {downPaymentPercent}% · {formatPrice(downPaymentAmount, currency)}
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={80}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full accent-accent"
            aria-label="Apport personnel en pourcentage du prix"
          />
        </label>

        <label className="block">
          <span className="mb-1 flex justify-between text-sm text-primary-600">
            <span>Taux d'intérêt annuel</span>
            <span className="font-medium text-primary-900">{ratePercent.toFixed(1)}%</span>
          </span>
          <input
            type="range"
            min={1}
            max={15}
            step={0.1}
            value={ratePercent}
            onChange={(e) => setRatePercent(Number(e.target.value))}
            className="w-full accent-accent"
            aria-label="Taux d'intérêt annuel"
          />
        </label>

        <label className="block">
          <span className="mb-1 flex justify-between text-sm text-primary-600">
            <span>Durée du prêt</span>
            <span className="font-medium text-primary-900">{termYears} ans</span>
          </span>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            className="w-full accent-accent"
            aria-label="Durée du prêt en années"
          />
        </label>
      </div>

      <div className="mt-5 rounded-lg bg-accent/10 p-4 text-center">
        <p className="text-xs uppercase tracking-wide text-primary-500">
          Mensualité estimée
        </p>
        <p className="font-heading text-2xl text-accent-dark">
          {formatPrice(Math.round(result.monthlyPayment), currency)}
          <span className="text-sm font-normal text-primary-500"> / mois</span>
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-primary-500">Montant emprunté</dt>
          <dd className="font-medium text-primary-900">
            {formatPrice(result.loanAmount, currency)}
          </dd>
        </div>
        <div>
          <dt className="text-primary-500">Coût total des intérêts</dt>
          <dd className="font-medium text-primary-900">
            {formatPrice(Math.round(result.totalInterest), currency)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-primary-400">
        Estimation indicative à titre informatif, hors assurance et frais de dossier.
        Rapprochez-vous d'un établissement financier pour une offre précise.
      </p>
    </div>
  );
};
