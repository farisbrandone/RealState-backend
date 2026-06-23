'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '@/shared/api/endpoints/payment.endpoints';
import { Card } from '@/shared/ui/components/Card/Card';
import { formatPrice } from '@/shared/lib/formatters/currency.formatter';
import { format } from 'date-fns';

export default function PaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentApi.getPayments({ limit: 20 }),
  });

  const payments = data?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Historique des paiements</h1>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="space-y-3">
          {payments.map((payment: any) => (
            <Card key={payment.id} padding="md" className="flex justify-between items-center">
              <div>
                <p className="font-medium">{payment.description || 'Paiement'}</p>
                <p className="text-sm text-primary-500">
                  {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-heading text-accent">
                  {formatPrice(payment.amount.amount, payment.amount.currency)}
                </p>
                <p className="text-xs text-primary-400">{payment.status}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
