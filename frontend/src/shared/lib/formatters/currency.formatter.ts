export const formatPrice = (price: number, currency: string = "EUR") => {
  console.log({ price, currency });
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};
