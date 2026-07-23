// Devise suggérée automatiquement selon le pays choisi
const CEMAC = ["Cameroun", "Gabon", "Congo", "Tchad", "Centrafrique"];
const UEMOA = [
  "Côte d'Ivoire",
  "Sénégal",
  "Burkina Faso",
  "Mali",
  "Togo",
  "Bénin",
  "Niger",
  "Guinée-Bissau",
];

export function suggestCurrency(country: string): string {
  if (CEMAC.includes(country)) return "XAF";
  if (UEMOA.includes(country)) return "XOF";
  if (country === "Maroc") return "MAD";
  if (country === "Algérie") return "DZD";
  if (country === "Tunisie") return "TND";
  if (country === "RD Congo") return "CDF";
  if (country === "France" || country === "Belgique") return "EUR";
  return "XAF";
}
