import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ChemEquation from '../lib/ChemEquation.svelte';
import ChemBlock from '../lib/ChemBlock.svelte';
import ChemAuto from '../lib/ChemAuto.svelte';
import ChemNotation from '../lib/ChemNotation.svelte';
import LatexMath from '../lib/LatexMath.svelte';
import LatexBlock from '../lib/LatexBlock.svelte';

describe('ChemEquation', () => {
  it('renders katex html for a valid formula', () => {
    const { container } = render(ChemEquation, { formula: 'H2O' });
    expect(container.querySelector('.katex')).toBeTruthy();
    expect(container.querySelector('.chem-equation')).toBeTruthy();
  });

  it('sets aria-label to the raw formula', () => {
    const { container } = render(ChemEquation, { formula: 'H2O' });
    expect(container.querySelector('.chem-equation')?.getAttribute('aria-label')).toBe('H2O');
  });

  it('renders inline error text for an invalid formula', () => {
    const { container } = render(ChemEquation, { formula: '\\invalid' });
    expect(container.querySelector('.katex-error')).toBeTruthy();
  });

  it('renders nothing with errorMode none', () => {
    const { container } = render(ChemEquation, { formula: '\\invalid', errorMode: 'none' });
    expect(container.querySelector('.katex')).toBeNull();
    expect(container.querySelector('.katex-error')).toBeNull();
  });

  it('applies the class prop', () => {
    const { container } = render(ChemEquation, { formula: 'H2O', class: 'my-math' });
    expect(container.querySelector('.chem-equation.my-math')).toBeTruthy();
  });

  it('applies color through to the rendered html', () => {
    const { container } = render(ChemEquation, { formula: 'H2O', color: 'blue' });
    expect(container.innerHTML).toContain('style="color:blue"');
  });
});

describe('ChemBlock', () => {
  it('renders display math with label and number', () => {
    const { container } = render(ChemBlock, {
      formula: '2H2 + O2 -> 2H2O',
      label: 'Combustion of hydrogen',
      number: 1,
    });
    expect(container.querySelector('.katex-display')).toBeTruthy();
    expect(container.querySelector('.chem-block__label')?.textContent).toBe(
      'Combustion of hydrogen'
    );
    expect(container.querySelector('.chem-block__number')?.textContent).toBe('(1)');
  });

  it('omits aria-describedby when there is no label', () => {
    const { container } = render(ChemBlock, { formula: 'H2O' });
    const block = container.querySelector('.chem-block');
    expect(block?.getAttribute('aria-describedby')).toBeNull();
  });

  it('links aria-describedby to the label element', () => {
    const { container } = render(ChemBlock, { formula: 'H2O', label: 'Water' });
    const describedBy = container.querySelector('.chem-block')?.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(container.querySelector(`#${describedBy}`)?.textContent).toBe('Water');
  });

  it('renders nothing with errorMode none', () => {
    const { container } = render(ChemBlock, { formula: '\\invalid', errorMode: 'none' });
    expect(container.querySelector('.katex')).toBeNull();
  });

  it('omits the label element when there is no label', () => {
    const { container } = render(ChemBlock, { formula: 'H2O' });
    expect(container.querySelector('.chem-block__label')).toBeNull();
  });
});

describe('LatexMath', () => {
  it('renders inline katex html', () => {
    const { container } = render(LatexMath, { formula: 'E = mc^2' });
    expect(container.querySelector('.katex')).toBeTruthy();
    expect(container.querySelector('.katex-display')).toBeNull();
  });

  it('renders display math when displayMode is set', () => {
    const { container } = render(LatexMath, { formula: 'E = mc^2', displayMode: true });
    expect(container.querySelector('.katex-display')).toBeTruthy();
  });

  it('renders nothing with errorMode none', () => {
    const { container } = render(LatexMath, { formula: '\\invalid', errorMode: 'none' });
    expect(container.querySelector('.katex')).toBeNull();
  });
});

describe('LatexBlock', () => {
  it('renders display math with label', () => {
    const { container } = render(LatexBlock, { formula: '\\frac{a}{b}', label: 'Fraction' });
    expect(container.querySelector('.katex-display')).toBeTruthy();
    expect(container.querySelector('.latex-block__label')?.textContent).toBe('Fraction');
  });

  it('omits aria-describedby when there is no label', () => {
    const { container } = render(LatexBlock, { formula: 'E = mc^2' });
    expect(container.querySelector('.latex-block')?.getAttribute('aria-describedby')).toBeNull();
  });

  it('shows error text for invalid latex', () => {
    const { container } = render(LatexBlock, { formula: '\\invalid' });
    expect(container.querySelector('.katex-error')).toBeTruthy();
  });
});

describe('ChemAuto', () => {
  it('renders embedded chemistry and math', () => {
    const { container } = render(ChemAuto, { text: 'Water is \\ce{H2O} at $0°C$' });
    expect(container.querySelectorAll('.katex').length).toBeGreaterThanOrEqual(2);
  });

  it('renders inside the configured tag', () => {
    const { container } = render(ChemAuto, { text: 'plain', tag: 'div' });
    expect(container.querySelector('div.chem-auto')).toBeTruthy();
  });

  it('leaves \\ce literal when chemistry is disabled', () => {
    const { container } = render(ChemAuto, { text: 'Water is \\ce{H2O}', chemistry: false });
    expect(container.querySelector('.katex')).toBeNull();
    expect(container.textContent).toContain('\\ce{H2O}');
  });
});

describe('ChemNotation', () => {
  it('renders formula card with name and description', () => {
    const { container } = render(ChemNotation, {
      formula: 'H2SO4',
      name: 'Sulfuric acid',
      desc: 'Strong diprotic acid',
      type: 'formula',
    });
    expect(container.querySelector('.katex')).toBeTruthy();
    expect(container.querySelector('.chem-notation__name')?.textContent).toBe('Sulfuric acid');
    expect(container.querySelector('.chem-notation__desc')?.textContent).toBe(
      'Strong diprotic acid'
    );
    expect(container.querySelector('.chem-notation__type')?.textContent).toBe('Formula');
  });

  it('applies the accent colour for the type', () => {
    const { container } = render(ChemNotation, { formula: 'H2O', type: 'reaction' });
    const card = container.querySelector('.chem-notation') as HTMLElement;
    expect(card.style.getPropertyValue('--accent')).toBe('#059669');
  });

  it('omits name and desc when not provided', () => {
    const { container } = render(ChemNotation, { formula: 'H2O' });
    expect(container.querySelector('.chem-notation__name')).toBeNull();
    expect(container.querySelector('.chem-notation__desc')).toBeNull();
  });

  it('uses the ionic label and accent for the ionic type', () => {
    const { container } = render(ChemNotation, { formula: 'H2O', type: 'ionic' });
    const card = container.querySelector('.chem-notation') as HTMLElement;
    expect(card.style.getPropertyValue('--accent')).toBe('#7c3aed');
    expect(container.querySelector('.chem-notation__type')?.textContent).toBe('Ionic equation');
  });
});
