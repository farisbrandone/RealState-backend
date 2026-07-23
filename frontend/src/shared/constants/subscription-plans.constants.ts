// Source unique des plans d'abonnement — utilisée par /pricing et /checkout
// pour qu'ils ne puissent jamais afficher des prix différents pour le même plan.
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'week' | 'month' | 'year';
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_weekly',
    name: 'Hebdomadaire',
    price: 6500,
    currency: 'XAF',
    interval: 'week',
    features: ['Accès illimité', 'Messagerie', 'Notifications', 'Support standard'],
  },
  {
    id: 'plan_monthly',
    name: 'Mensuel',
    price: 19500,
    currency: 'XAF',
    interval: 'month',
    features: [
      'Accès illimité',
      'Messagerie prioritaire',
      'Statistiques avancées',
      'Support prioritaire',
    ],
    popular: true,
  },
  {
    id: 'plan_yearly',
    name: 'Annuel',
    price: 180000,
    currency: 'XAF',
    interval: 'year',
    features: ['Tout le plan mensuel', '2 mois offerts', 'Badge Premium', 'Support dédié'],
  },
];

export function getSubscriptionPlan(planId: string): SubscriptionPlan {
  return (
    SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) ?? SUBSCRIPTION_PLANS[1]
  );
}
