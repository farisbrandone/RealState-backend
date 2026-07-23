import { formatPrice } from './currency.formatter';

describe('formatPrice', () => {
  it('formate en FCFA (XAF) par défaut — marché principal de LuxHorizon', () => {
    expect(formatPrice(85_000)).toContain('FCFA');
  });

  it('n’affiche pas de décimales (maximumFractionDigits: 0)', () => {
    expect(formatPrice(19_500.5, 'XAF')).not.toMatch(/[,.]5/);
  });

  it('respecte la devise explicitement fournie', () => {
    expect(formatPrice(9.99, 'EUR')).toContain('€');
  });
});
