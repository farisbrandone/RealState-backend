'use client';

import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Button } from '@/shared/ui/components/Button/Button';
import { Card } from '@/shared/ui/components/Card/Card';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatPrice } from '@/shared/lib/formatters/currency.formatter';
import { SUBSCRIPTION_PLANS as plans } from '@/shared/constants/subscription-plans.constants';

export default function PricingPage() {
  const user = useAuthStore(s => s.user);
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }
    setSelectedPlan(planId);
    router.push(`/checkout?planId=${planId}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading mb-4">Choisissez votre abonnement</h1>
        <p className="text-primary-500 max-w-2xl mx-auto">
          Profitez de toutes les fonctionnalités de LuxHorizon. Sans engagement, annulez à tout
          moment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <Card
            key={plan.id}
            padding="lg"
            className={`relative flex flex-col ${
              plan.popular ? 'border-2 border-accent shadow-lg scale-105' : ''
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-ink px-3 py-1 rounded-full text-xs font-medium">
                Populaire
              </span>
            )}
            <div className="mb-6">
              <h3 className="text-xl font-heading">{plan.name}</h3>
              <div className="mt-3">
                <span className="text-3xl font-heading text-accent">
                  {formatPrice(plan.price, plan.currency)}
                </span>
                <span className="text-primary-400">
                  /
                  {plan.interval === 'week' ? 'semaine' : plan.interval === 'month' ? 'mois' : 'an'}
                </span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  {feat}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.popular ? 'primary' : 'outline'}
              size="lg"
              className="w-full"
              onClick={() => handleSelectPlan(plan.id)}
            >
              {user ? 'Choisir ce plan' : 'Se connecter'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
