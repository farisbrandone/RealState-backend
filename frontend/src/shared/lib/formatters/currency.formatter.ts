// XAF (FCFA) par défaut : marché principal de LuxHorizon (Afrique centrale).
export const formatPrice = (price: number, currency: string = "XAF") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};
