'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '@/shared/api/endpoints/payment.endpoints';
import { Button } from '@/shared/ui/components/Button/Button';
import { Card } from '@/shared/ui/components/Card/Card';
import { Input } from '@/shared/ui/components/Input/Input';
import { useState } from 'react';
import { formatPrice } from '@/shared/lib/formatters/currency.formatter';
import { toast } from 'react-hot-toast';
import { getSubscriptionPlan } from '@/shared/constants/subscription-plans.constants';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId') || 'plan_monthly';
  const user = useAuthStore(s => s.user);
  const router = useRouter();

  const plan = getSubscriptionPlan(planId);

  const [paymentMethod, setPaymentMethod] = useState<
    'stripe' | 'orange_money' | 'mtn_money' | 'wave'
  >('stripe');
  const [phone, setPhone] = useState(user?.phone || '');

  const createSubscriptionMutation = useMutation({
    mutationFn: (data: any) => paymentApi.createSubscription(data),
    onSuccess: () => {
      toast.success('Paiement effectué avec succès !');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error('Erreur lors du paiement : ' + (error.response?.data?.message || 'Réessayez'));
    },
  });

  const handleSubmit = () => {
    if (!user) {
      router.push('/login?redirect=/checkout?planId=' + planId);
      return;
    }

    const payload = {
      userId: user.id,
      planId,
      paymentMethodType: paymentMethod === 'stripe' ? 'CREDIT_CARD' : 'MOBILE_MONEY',
      mobileDetails:
        paymentMethod !== 'stripe'
          ? {
              phoneNumber: phone,
              operator:
                paymentMethod === 'orange_money'
                  ? 'ORANGE'
                  : paymentMethod === 'mtn_money'
                    ? 'MTN'
                    : 'WAVE',
              countryCode: 'CM', // ou selon le pays
            }
          : undefined,
      billingAddress: {
        line1: user?.address || '',
        city: user?.city || '',
        country: user?.country || 'CM',
      },
      couponCode: undefined,
      trialPeriodDays: 0, // paiement immédiat
    };

    createSubscriptionMutation.mutate(payload);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p>Veuillez vous connecter pour continuer.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-heading mb-6">Finaliser l’abonnement</h1>
      <Card padding="lg">
        <div className="mb-6">
          <p className="text-lg">Plan {plan.name}</p>
          <p className="text-3xl font-heading text-accent">
            {formatPrice(plan.price, plan.currency)}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Mode de paiement</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-3 rounded-lg border ${paymentMethod === 'stripe' ? 'border-accent bg-primary-50' : 'border-primary-200'}`}
              >
                Carte bancaire
              </button>
              {/* Mobile money : intégrations opérateur pas encore branchées côté
                  serveur — désactivé plutôt que de laisser un paiement en
                  attente indéfiniment. */}
              {(
                [
                  { key: 'orange_money', label: 'Orange Money' },
                  { key: 'mtn_money', label: 'MTN Money' },
                  { key: 'wave', label: 'Wave' },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  disabled
                  title="Bientôt disponible"
                  className="relative p-3 rounded-lg border border-primary-100 text-primary-400 cursor-not-allowed"
                >
                  {label}
                  <span className="absolute right-2 top-2 rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] font-medium text-primary-500">
                    Bientôt
                  </span>
                </button>
              ))}
            </div>
          </div>

          {paymentMethod !== 'stripe' && (
            <Input
              label="Numéro de téléphone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+237 XXXXXXXX"
            />
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full mt-6"
            onClick={handleSubmit}
            disabled={createSubscriptionMutation.isPending}
          >
            {createSubscriptionMutation.isPending ? 'Paiement en cours...' : 'Payer maintenant'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
