// ── Components ────────────────────────────────────────────────
export { default as ChemEquation } from './ChemEquation.svelte';
export { default as ChemBlock } from './ChemBlock.svelte';
export { default as ChemAuto } from './ChemAuto.svelte';
export { default as ChemNotation } from './ChemNotation.svelte';
export { default as LatexMath } from './LatexMath.svelte';
export { default as LatexBlock } from './LatexBlock.svelte';

// ── Renderer utilities ────────────────────────────────────────
export {
  renderChem,
  renderChemBlock,
  renderLatex,
  renderLatexBlock,
  renderAuto,
  isValidChem,
  isValidLatex,
} from './renderer.js';

export type { RenderOptions, RenderResult, AutoRenderOptions } from './renderer.js';

// ── Chemistry utilities ───────────────────────────────────────
export {
  toCe,
  buildReaction,
  isValidFormula,
  parseFormula,
  checkBalance,
  searchFormulas,
  searchReactions,
  getElement,
  COMMON_FORMULAS,
  COMMON_REACTIONS,
  ELEMENTS,
} from './chemistry.js';

export type { ChemElement, BalancedEquation, ArrowType } from './chemistry.js';
