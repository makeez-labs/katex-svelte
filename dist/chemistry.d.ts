/**
 * Chemistry utilities for katex-svelte.
 * Common chemical formulas, elements, and helper functions
 * tailored for Makeez Chemistry and Paa Campus.
 */
export interface ChemElement {
    symbol: string;
    name: string;
    number: number;
    mass: number;
    group?: string;
}
export interface BalancedEquation {
    reactants: string[];
    products: string[];
    /** Full balanced equation in \ce{} notation */
    equation: string;
}
export declare const COMMON_FORMULAS: Record<string, string>;
export declare const COMMON_REACTIONS: Record<string, string>;
/**
 * Format a chemical formula with proper mhchem notation from a plain string.
 * e.g. "H2SO4" → "\ce{H2SO4}"
 */
export declare function toCe(formula: string): string;
/**
 * Format a reaction arrow type for mhchem.
 */
export type ArrowType = '->' | '<-' | '<=>' | '<->' | '->[above][below]';
/**
 * Build a reaction string in mhchem notation.
 *
 * @example
 * buildReaction(['H2', 'O2'], ['H2O'])
 * // → "H2 + O2 -> H2O"
 *
 * buildReaction(['N2', '3H2'], ['2NH3'], '<=>')
 * // → "N2 + 3H2 <=> 2NH3"
 */
export declare function buildReaction(reactants: string[], products: string[], arrow?: ArrowType, above?: string, below?: string): string;
/**
 * Check if a formula string is a valid mhchem expression.
 */
export declare function isValidFormula(formula: string): boolean;
/**
 * Search common formulas by name (case-insensitive partial match).
 */
export declare function searchFormulas(query: string): Array<{
    name: string;
    formula: string;
}>;
/**
 * Search common reactions by name.
 */
export declare function searchReactions(query: string): Array<{
    name: string;
    equation: string;
}>;
export declare const ELEMENTS: ChemElement[];
/**
 * Parse a chemical formula into its component atoms and their counts.
 * Handles coefficients, subscripts, and nested parentheses recursively.
 * e.g. "2H2O" -> { H: 4, O: 2 }
 * e.g. "Ca(OH)2" -> { Ca: 1, O: 2, H: 2 }
 * e.g. "Mg(NO3)2" -> { Mg: 1, N: 2, O: 6 }
 * e.g. "Al2(SO4)3" -> { Al: 2, S: 3, O: 12 }
 */
export declare function parseFormula(formula: string): Record<string, number>;
/**
 * Calculate the molar mass of a chemical formula in g/mol.
 * Uses atomic masses from the ELEMENTS database.
 * Returns null if any element is not found.
 *
 * @example
 * calculateMolarMass('H2O')      // 18.015
 * calculateMolarMass('CO2')      // 44.009
 * calculateMolarMass('Ca(OH)2')  // 74.092
 */
export declare function calculateMolarMass(formula: string): number | null;
/**
 * Check if a chemical equation is balanced.
 * Returns an object with balance status and atom counts for both sides.
 */
export declare function checkBalance(equation: string): {
    balanced: boolean;
    left: Record<string, number>;
    right: Record<string, number>;
    missing?: string[];
};
/**
 * Look up an element by symbol or name.
 */
export declare function getElement(symbolOrName: string): ChemElement | undefined;
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
