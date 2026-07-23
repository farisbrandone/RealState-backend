import { calculateMortgage } from "./mortgage";

describe("calculateMortgage", () => {
  it("calcule une mensualité cohérente pour un cas standard", () => {
    // 50 000 000 XAF, apport 10M, taux 6%/an, 20 ans
    const result = calculateMortgage({
      price: 50_000_000,
      downPaymentAmount: 10_000_000,
      annualRatePercent: 6,
      termYears: 20,
    });

    expect(result.loanAmount).toBe(40_000_000);
    // Mensualité attendue ≈ 286 610 XAF (formule d'amortissement standard)
    expect(result.monthlyPayment).toBeGreaterThan(280_000);
    expect(result.monthlyPayment).toBeLessThan(295_000);
    expect(result.totalCost).toBeGreaterThan(result.loanAmount);
    expect(result.totalInterest).toBeCloseTo(result.totalCost - result.loanAmount, 5);
  });

  it("gère un taux à 0% (paiement égal au capital divisé par le nombre de mensualités)", () => {
    const result = calculateMortgage({
      price: 12_000_000,
      downPaymentAmount: 0,
      annualRatePercent: 0,
      termYears: 10,
    });
    expect(result.monthlyPayment).toBeCloseTo(12_000_000 / 120, 5);
    expect(result.totalInterest).toBeCloseTo(0, 5);
  });

  it("ne renvoie jamais un montant emprunté négatif si l'apport dépasse le prix", () => {
    const result = calculateMortgage({
      price: 10_000_000,
      downPaymentAmount: 15_000_000,
      annualRatePercent: 5,
      termYears: 15,
    });
    expect(result.loanAmount).toBe(0);
    expect(result.monthlyPayment).toBe(0);
  });
});
