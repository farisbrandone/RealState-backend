export interface MortgageInput {
  price: number;
  downPaymentAmount: number;
  annualRatePercent: number;
  termYears: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
}

/**
 * Mensualité d'un prêt amortissable à taux fixe (formule standard) :
 * M = P × [r(1+r)^n] / [(1+r)^n - 1]
 * P = capital emprunté, r = taux mensuel, n = nombre de mensualités.
 */
export function calculateMortgage({
  price,
  downPaymentAmount,
  annualRatePercent,
  termYears,
}: MortgageInput): MortgageResult {
  const loanAmount = Math.max(0, price - downPaymentAmount);
  const monthlyRate = annualRatePercent / 100 / 12;
  const numberOfPayments = Math.max(1, Math.round(termYears * 12));

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numberOfPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, numberOfPayments);
    monthlyPayment = (loanAmount * (monthlyRate * factor)) / (factor - 1);
  }

  const totalCost = monthlyPayment * numberOfPayments;
  const totalInterest = totalCost - loanAmount;

  return {
    loanAmount,
    monthlyPayment: Number.isFinite(monthlyPayment) ? monthlyPayment : 0,
    totalCost: Number.isFinite(totalCost) ? totalCost : 0,
    totalInterest: Number.isFinite(totalInterest) ? totalInterest : 0,
  };
}
