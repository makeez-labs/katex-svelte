export { default as ChemEquation } from './ChemEquation.svelte';
export { default as ChemBlock } from './ChemBlock.svelte';
export { default as ChemAuto } from './ChemAuto.svelte';
export { default as ChemNotation } from './ChemNotation.svelte';
export { default as LatexMath } from './LatexMath.svelte';
export { default as LatexBlock } from './LatexBlock.svelte';
export { renderChem, renderChemBlock, renderLatex, renderLatexBlock, renderAuto, isValidChem, isValidLatex, } from './renderer.js';
export type { RenderOptions, RenderResult, AutoRenderOptions } from './renderer.js';
export { toCe, buildReaction, isValidFormula, parseFormula, checkBalance, searchFormulas, searchReactions, getElement, calculateMolarMass, COMMON_FORMULAS, COMMON_REACTIONS, ELEMENTS, } from './chemistry.js';
export type { ChemElement, BalancedEquation, ArrowType } from './chemistry.js';
/**
 * Balance a chemical equation using the algebraic method.
 * Returns the balanced equation with smallest integer coefficients.
 *
 * @example
 * balanceEquation('H2 + O2 -> H2O')
 * // → { equation: '2H2 + O2 -> 2H2O', coefficients: [2, 1, 2] }
 *
 * balanceEquation('Fe + O2 -> Fe2O3')
 * // → { equation: '4Fe + 3O2 -> 2Fe2O3', coefficients: [4, 3, 2] }
 *
 * balanceEquation('C3H8 + O2 -> CO2 + H2O')
 * // → { equation: 'C3H8 + 5O2 -> 3CO2 + 4H2O', coefficients: [1, 5, 3, 4] }
 */
export declare function balanceEquation(equation: string): {
    equation: string;
    coefficients: number[];
    reactants: string[];
    products: string[];
} | null;
