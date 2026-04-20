import { describe, it, expect } from 'vitest';
import { renderChem, renderLatex, renderAuto, isValidChem, isValidLatex } from '../lib/renderer.js';

// ── renderChem ────────────────────────────────────────────────

describe('renderChem', () => {
  it('renders water without error', () => {
    const r = renderChem('H2O');
    expect(r.isValid).toBe(true);
    expect(r.error).toBeNull();
    expect(r.html).toContain('katex');
  });

  it('renders a reaction', () => {
    const r = renderChem('CH4 + 2O2 -> CO2 + 2H2O');
    expect(r.isValid).toBe(true);
    expect(r.html.length).toBeGreaterThan(0);
  });

  it('renders ionic equation', () => {
    const r = renderChem('Fe^{2+} + 2e^- -> Fe');
    expect(r.isValid).toBe(true);
  });

  it('renders equilibrium arrow', () => {
    const r = renderChem('N2 + 3H2 <=> 2NH3');
    expect(r.isValid).toBe(true);
  });

  it('returns error html for invalid formula in text mode', () => {
    const r = renderChem('\\invalid', { errorMode: 'text' });
    expect(r.isValid).toBe(false);
    expect(r.error).not.toBeNull();
    expect(r.html).toContain('katex-error');
  });

  it('returns empty html for invalid formula in none mode', () => {
    const r = renderChem('\\invalid', { errorMode: 'none' });
    expect(r.html).toBe('');
    expect(r.isValid).toBe(false);
  });

  it('renders in display mode', () => {
    const r = renderChem('H2O', { displayMode: true });
    expect(r.isValid).toBe(true);
    expect(r.html).toContain('katex-display');
  });
});

// ── renderLatex ───────────────────────────────────────────────

describe('renderLatex', () => {
  it('renders E = mc^2', () => {
    const r = renderLatex('E = mc^2');
    expect(r.isValid).toBe(true);
    expect(r.html).toContain('katex');
  });

  it('renders fractions', () => {
    const r = renderLatex('\\frac{a}{b}');
    expect(r.isValid).toBe(true);
  });

  it('renders integrals', () => {
    const r = renderLatex('\\int_{0}^{\\infty} f(x) dx');
    expect(r.isValid).toBe(true);
  });

  it('renders subscripts and superscripts', () => {
    const r = renderLatex('x_{n}^{2}');
    expect(r.isValid).toBe(true);
  });

  it('handles display mode', () => {
    const r = renderLatex('E = mc^2', { displayMode: true });
    expect(r.html).toContain('katex-display');
  });

  it('returns error for invalid latex in text mode', () => {
    const r = renderLatex('\\invalidcommand{}', { errorMode: 'text' });
    expect(r.isValid).toBe(false);
    expect(r.html).toContain('katex-error');
  });
});

// ── isValidChem ───────────────────────────────────────────────

describe('isValidChem', () => {
  it('returns true for valid formula', () => {
    expect(isValidChem('H2O')).toBe(true);
    expect(isValidChem('CH4 + 2O2 -> CO2 + 2H2O')).toBe(true);
    expect(isValidChem('N2 + 3H2 <=> 2NH3')).toBe(true);
  });
});

// ── isValidLatex ──────────────────────────────────────────────

describe('isValidLatex', () => {
  it('returns true for valid latex', () => {
    expect(isValidLatex('E = mc^2')).toBe(true);
    expect(isValidLatex('\\frac{1}{2}')).toBe(true);
  });

  it('returns false for invalid latex', () => {
    expect(isValidLatex('\\invalidcmd{}')).toBe(false);
  });
});

// ── renderAuto ────────────────────────────────────────────────

describe('renderAuto', () => {
  it('renders inline $...$ math', () => {
    const html = renderAuto('Energy is $E = mc^2$ in physics');
    expect(html).toContain('katex');
  });

  it('renders \\ce{} chemistry', () => {
    const html = renderAuto('Water is \\ce{H2O}');
    expect(html).toContain('katex');
  });

  it('renders $$...$$ block math', () => {
    const html = renderAuto('The formula $$E = mc^2$$');
    expect(html).toContain('katex-display');
  });

  it('escapes plain text', () => {
    const html = renderAuto('Hello <world>');
    expect(html).toContain('&lt;world&gt;');
  });

  it('can disable chemistry rendering', () => {
    const html = renderAuto('\\ce{H2O}', { chemistry: false });
    expect(html).not.toContain('katex');
    expect(html).toContain('\\ce');
  });
});
