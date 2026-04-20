import { describe, it, expect } from 'vitest';
import {
  buildReaction,
  searchFormulas,
  searchReactions,
  getElement,
  toCe,
  parseFormula,
  checkBalance,
  COMMON_FORMULAS,
  ELEMENTS,
} from '../lib/chemistry.js';

describe('toCe', () => {
  it('wraps formula in \\ce{}', () => {
    expect(toCe('H2O')).toBe('\\ce{H2O}');
    expect(toCe('CH4 + 2O2 -> CO2 + 2H2O')).toBe('\\ce{CH4 + 2O2 -> CO2 + 2H2O}');
  });
});

describe('buildReaction', () => {
  it('builds forward reaction', () => {
    expect(buildReaction(['H2', 'O2'], ['H2O'])).toBe('H2 + O2 -> H2O');
  });

  it('builds equilibrium reaction', () => {
    expect(buildReaction(['N2', '3H2'], ['2NH3'], '<=>')).toBe('N2 + 3H2 <=> 2NH3');
  });

  it('builds reaction with condition', () => {
    const r = buildReaction(['2H2', 'O2'], ['2H2O'], '->', '\\Delta');
    expect(r).toContain('\\Delta');
  });

  it('handles single reactant and product', () => {
    expect(buildReaction(['CaCO3'], ['CaO', 'CO2'])).toBe('CaCO3 -> CaO + CO2');
  });
});

describe('searchFormulas', () => {
  it('finds water', () => {
    const results = searchFormulas('water');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].formula).toBe('H2O');
  });

  it('finds acids', () => {
    const results = searchFormulas('acid');
    expect(results.length).toBeGreaterThan(2);
  });

  it('returns empty array for no match', () => {
    expect(searchFormulas('xylophone')).toHaveLength(0);
  });

  it('is case insensitive', () => {
    expect(searchFormulas('WATER')).toHaveLength(searchFormulas('water').length);
  });
});

describe('searchReactions', () => {
  it('finds combustion reactions', () => {
    const results = searchReactions('combustion');
    expect(results.length).toBeGreaterThan(0);
  });

  it('finds haber process', () => {
    const results = searchReactions('haber');
    expect(results[0].equation).toContain('NH3');
  });
});

describe('getElement', () => {
  it('finds by symbol', () => {
    const el = getElement('H');
    expect(el?.name).toBe('Hydrogen');
    expect(el?.number).toBe(1);
  });

  it('finds by name (case insensitive)', () => {
    const el = getElement('oxygen');
    expect(el?.symbol).toBe('O');
    expect(el?.mass).toBeCloseTo(15.999, 2);
  });

  it('returns undefined for unknown element', () => {
    expect(getElement('Xx')).toBeUndefined();
  });
});

describe('COMMON_FORMULAS', () => {
  it('has water', () => {
    expect(COMMON_FORMULAS['water']).toBe('H2O');
  });

  it('has sulfuric acid', () => {
    expect(COMMON_FORMULAS['sulfuric acid']).toBe('H2SO4');
  });
});

describe('ELEMENTS', () => {
  it('has 22 elements', () => {
    expect(ELEMENTS).toHaveLength(22);
  });

  it('first element is hydrogen', () => {
    expect(ELEMENTS[0].symbol).toBe('H');
    expect(ELEMENTS[0].number).toBe(1);
  });

  it('twentieth element is calcium', () => {
    expect(ELEMENTS[19].symbol).toBe('Ca');
    expect(ELEMENTS[19].number).toBe(20);
  });
});

describe('parseFormula', () => {
  it('parses simple formula', () => {
    expect(parseFormula('H2O')).toEqual({ H: 2, O: 1 });
    expect(parseFormula('CO2')).toEqual({ C: 1, O: 2 });
  });

  it('handles coefficients', () => {
    expect(parseFormula('2H2O')).toEqual({ H: 4, O: 2 });
    expect(parseFormula('3NaCl')).toEqual({ Na: 3, Cl: 3 });
  });

  it('handles parentheses', () => {
    expect(parseFormula('Ca(OH)2')).toEqual({ Ca: 1, O: 2, H: 2 });
    expect(parseFormula('Mg(NO3)2')).toEqual({ Mg: 1, N: 2, O: 6 });
  });
});

describe('checkBalance', () => {
  it('identifies balanced equation', () => {
    const res = checkBalance('2H2 + O2 -> 2H2O');
    expect(res.balanced).toBe(true);
  });

  it('identifies unbalanced equation', () => {
    const res = checkBalance('H2 + O2 -> H2O');
    expect(res.balanced).toBe(false);
    expect(res.missing).toContain('O');
    expect(res.missing).not.toContain('H');
  });

  it('handles equilibrium arrows', () => {
    const res = checkBalance('N2 + 3H2 <=> 2NH3');
    expect(res.balanced).toBe(true);
  });
});
