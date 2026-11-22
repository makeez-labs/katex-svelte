import { describe, it, expect } from 'vitest';
import { renderAuto, renderChem, renderChemBlock, renderLatex } from '../lib/renderer.js';

describe('Edge Cases', () => {
  describe('renderAuto', () => {
    it('handles empty string', () => {
      expect(renderAuto('')).toBe('');
    });

    it('handles string with no math or chem', () => {
      const text = 'Just some plain text with <special> characters.';
      expect(renderAuto(text)).toBe('Just some plain text with &lt;special&gt; characters.');
    });

    it('handles escaped dollar signs', () => {
      const text = 'Price is \\$100 and tax is \\$20';
      const rendered = renderAuto(text);
      expect(rendered).toBe('Price is $100 and tax is $20');
      expect(rendered).not.toContain('katex');
    });

    it('handles unclosed delimiters', () => {
      expect(renderAuto('This is $ unclosed')).toBe('This is $ unclosed');
      expect(renderAuto('This is \\ce{ unclosed')).toBe('This is \\ce{ unclosed');
    });

    it('handles multiple expressions on one line', () => {
      const text = 'Water is \\ce{H2O} and salt is \\ce{NaCl}.';
      const rendered = renderAuto(text);
      expect(rendered).toContain('katex');
      const count = (rendered.match(/katex/g) || []).length;
      expect(count).toBeGreaterThanOrEqual(2);
    });

    it('handles multiline math', () => {
      const text = '$$\nE = mc^2\n$$';
      const rendered = renderAuto(text);
      expect(rendered).toContain('katex-display');
    });

    it('pairs multiple inline math expressions on one line', () => {
      const rendered = renderAuto('$a$ and $b$');
      expect((rendered.match(/class="katex"/g) || []).length).toBe(2);
      expect(rendered).not.toContain('$a$');
    });

    it('leaves dollars literal around chemistry inside $...$', () => {
      const rendered = renderAuto('$\\ce{H2O}$');
      expect(rendered).toContain('katex');
      expect(rendered).toContain('$');
    });

    it('renders error for invalid block math in default mode', () => {
      const rendered = renderAuto('$$\\invalid$$');
      expect(rendered).toContain('katex-error');
    });

    it('renders nothing for invalid math with errorMode none', () => {
      expect(renderAuto('$\\invalid$', { errorMode: 'none' })).toBe('');
    });

    it('pairs unpaired dollars as math boundaries (currency behaviour)', () => {
      const rendered = renderAuto('Price is $5 and $10');
      expect(rendered).toContain('katex');
    });

    it('leaves backslashes not preceding $ or \\ untouched', () => {
      expect(renderAuto('C:\\temp\\file')).toBe('C:\\temp\\file');
    });

    it('escapes ampersands, angle brackets and quotes in text', () => {
      expect(renderAuto('A & B <x> "y"')).toBe('A &amp; B &lt;x&gt; &quot;y&quot;');
    });

    it('renders math containing comparison operators', () => {
      const rendered = renderAuto('$a < b$');
      expect(rendered).toContain('katex');
      // the raw expression is consumed by KaTeX, not left as escaped text
      expect(rendered).not.toContain('$a');
    });

    it('supports \\(...\\) inline delimiters by default', () => {
      expect(renderAuto('Math \\(x+y\\) here')).toContain('katex');
    });

    it('supports \\[...\\] block delimiters by default', () => {
      expect(renderAuto('\\[x^2\\]')).toContain('katex-display');
    });

    it('supports fully custom delimiters', () => {
      const rendered = renderAuto('%%x^2%% and $y$', { inlineDelimiters: [['%%', '%%']] });
      expect(rendered).toContain('katex');
      expect(rendered).toContain('$y$');
    });

    it('renders math from empty block delimiters', () => {
      expect(renderAuto('$$')).toContain('katex');
    });

    it('preserves unicode text', () => {
      expect(renderAuto('Température 25°C — ✓')).toBe('Température 25°C — ✓');
    });
  });

  describe('renderLatex edge cases', () => {
    it('renders empty latex', () => {
      expect(renderLatex('').isValid).toBe(true);
    });

    it('renders whitespace-only latex', () => {
      expect(renderLatex('   ').isValid).toBe(true);
    });

    it('renders unicode inside text mode', () => {
      expect(renderLatex('\\text{café}').isValid).toBe(true);
    });

    it('combines color with display mode', () => {
      const r = renderLatex('x', { displayMode: true, color: 'red' });
      expect(r.isValid).toBe(true);
      expect(r.html).toMatch(/^<span style="color:red">/);
      expect(r.html).toContain('katex-display');
    });

    it('accepts rgb() colours', () => {
      const r = renderLatex('x', { color: 'rgb(220, 38, 38)' });
      expect(r.html).toContain('color:rgb(220, 38, 38)');
    });

    it('accepts minRuleThickness', () => {
      expect(renderLatex('\\frac{a}{b}', { minRuleThickness: 0.05 }).isValid).toBe(true);
    });

    it('clamps maxSize without throwing', () => {
      expect(renderLatex('\\Huge x', { maxSize: 2 }).isValid).toBe(true);
    });

    it('throws with errorMode throw', () => {
      expect(() => renderLatex('\\invalid', { errorMode: 'throw' })).toThrow();
    });
  });

  describe('renderChem edge cases', () => {
    it('renders complex mhchem', () => {
      const r = renderChem('A ->[above][below] B');
      expect(r.isValid).toBe(true);
      expect(r.html).toContain('above');
      expect(r.html).toContain('below');
    });

    it('handles empty formula', () => {
      const r = renderChem('');
      expect(r.isValid).toBe(true); // \ce{} is valid (empty)
    });

    it('renders hydrate notation', () => {
      expect(renderChem('CuSO4.5H2O').isValid).toBe(true);
    });

    it('renders reverse arrow', () => {
      expect(renderChem('A <- B').isValid).toBe(true);
    });

    it('renders complex ion brackets', () => {
      expect(renderChem('[Fe(CN)6]^{4-}').isValid).toBe(true);
    });

    it('renders polyatomic ion charges', () => {
      expect(renderChem('Cr2O7^{2-}').isValid).toBe(true);
    });

    it('renders ionic state symbols', () => {
      expect(renderChem('Cl^-_{(aq)}').isValid).toBe(true);
    });

    it('renders block chemistry', () => {
      expect(renderChemBlock('N2 + 3H2 <=> 2NH3').html).toContain('katex-display');
    });
  });
});
