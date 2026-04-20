import { describe, it, expect } from 'vitest';
import { renderAuto, renderChem, renderLatex } from '../lib/renderer.js';

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
  });

  describe('renderChem edge cases', () => {
    it('handles complex mhchem', () => {
      const r = renderChem('A ->[above][below] B');
      expect(r.isValid).toBe(true);
      expect(r.html).toContain('above');
      expect(r.html).toContain('below');
    });

    it('handles empty formula', () => {
      const r = renderChem('');
      expect(r.isValid).toBe(true); // \ce{} is valid (empty)
    });
  });
});
