/**
 * Chemistry utilities for katex-svelte.
 * Common chemical formulas, elements, and helper functions
 * tailored for Makeez Chemistry and Paa Campus.
 */

import { renderChem, isValidChem } from './renderer.js';

// ── Types ─────────────────────────────────────────────────────

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

// ── Common chemical formulas ──────────────────────────────────
// Useful for autocomplete and lesson content in Paa Campus

export const COMMON_FORMULAS: Record<string, string> = {
  // Oxides
  water: 'H2O',
  'carbon dioxide': 'CO2',
  'carbon monoxide': 'CO',
  'sulfur dioxide': 'SO2',
  'sulfur trioxide': 'SO3',
  'nitrogen dioxide': 'NO2',
  'dinitrogen oxide': 'N2O',
  'hydrogen peroxide': 'H2O2',
  'iron(ii) oxide': 'FeO',
  'iron(iii) oxide': 'Fe2O3',
  'copper(ii) oxide': 'CuO',

  // Acids
  'hydrochloric acid': 'HCl',
  'sulfuric acid': 'H2SO4',
  'nitric acid': 'HNO3',
  'phosphoric acid': 'H3PO4',
  'acetic acid': 'CH3COOH',
  'carbonic acid': 'H2CO3',
  'hydrofluoric acid': 'HF',

  // Bases / alkalis
  'sodium hydroxide': 'NaOH',
  'potassium hydroxide': 'KOH',
  'calcium hydroxide': 'Ca(OH)2',
  ammonia: 'NH3',

  // Salts
  'sodium chloride': 'NaCl',
  'sodium carbonate': 'Na2CO3',
  'sodium bicarbonate': 'NaHCO3',
  'calcium carbonate': 'CaCO3',
  'calcium chloride': 'CaCl2',
  'copper(ii) sulfate': 'CuSO4',
  'potassium nitrate': 'KNO3',
  'ammonium nitrate': 'NH4NO3',

  // Organic
  methane: 'CH4',
  ethane: 'C2H6',
  propane: 'C3H8',
  butane: 'C4H10',
  ethanol: 'C2H5OH',
  methanol: 'CH3OH',
  glucose: 'C6H12O6',
  sucrose: 'C12H22O11',
  'ethanoic acid': 'CH3COOH',

  // Elements
  'oxygen gas': 'O2',
  'hydrogen gas': 'H2',
  'nitrogen gas': 'N2',
  'chlorine gas': 'Cl2',
};

// ── Common chemical reactions (KCSE / A-level) ────────────────

export const COMMON_REACTIONS: Record<string, string> = {
  'combustion of methane': 'CH4 + 2O2 -> CO2 + 2H2O',
  'combustion of ethanol': 'C2H5OH + 3O2 -> 2CO2 + 3H2O',
  photosynthesis: '6CO2 + 6H2O ->[\text{light}][\text{chlorophyll}] C6H12O6 + 6O2',
  respiration: 'C6H12O6 + 6O2 -> 6CO2 + 6H2O',
  neutralisation: 'HCl + NaOH -> NaCl + H2O',
  'haber process': 'N2 + 3H2 <=> 2NH3',
  'contact process': '2SO2 + O2 <=> 2SO3',
  'electrolysis of water': '2H2O -> 2H2 + O2',
  'thermal decomposition of CaCO3': 'CaCO3 ->[\Delta] CaO + CO2',
  'reaction of Na with water': '2Na + 2H2O -> 2NaOH + H2',
  rusting: '4Fe + 3O2 + 6H2O -> 2Fe2O3.3H2O',
  'reduction of iron oxide': 'Fe2O3 + 3CO -> 2Fe + 3CO2',
  'dissolving CO2 in water': 'CO2 + H2O <=> H2CO3',
};

// ── Formatting helpers ────────────────────────────────────────

/**
 * Format a chemical formula with proper mhchem notation from a plain string.
 * e.g. "H2SO4" → "\ce{H2SO4}"
 */
export function toCe(formula: string): string {
  return `\\ce{${formula}}`;
}

/**
 * Format a reaction arrow type for mhchem.
 */
export type ArrowType =
  | '->' // forward
  | '<-' // reverse
  | '<=>' // equilibrium
  | '<->' // resonance
  | '->[above][below]'; // with conditions

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
export function buildReaction(
  reactants: string[],
  products: string[],
  arrow: ArrowType = '->',
  above?: string,
  below?: string
): string {
  const r = reactants.join(' + ');
  const p = products.join(' + ');
  const a = above || below ? `->[${above ?? ''}][${below ?? ''}]` : arrow;
  return `${r} ${a} ${p}`;
}

/**
 * Check if a formula string is a valid mhchem expression.
 */
export function isValidFormula(formula: string): boolean {
  return isValidChem(formula);
}

/**
 * Search common formulas by name (case-insensitive partial match).
 */
export function searchFormulas(query: string): Array<{ name: string; formula: string }> {
  const q = query.toLowerCase();
  return Object.entries(COMMON_FORMULAS)
    .filter(([name]) => name.includes(q))
    .map(([name, formula]) => ({ name, formula }));
}

/**
 * Search common reactions by name.
 */
export function searchReactions(query: string): Array<{ name: string; equation: string }> {
  const q = query.toLowerCase();
  return Object.entries(COMMON_REACTIONS)
    .filter(([name]) => name.includes(q))
    .map(([name, equation]) => ({ name, equation }));
}

// ── Periodic table data (Common elements including first 20) ──

export const ELEMENTS: ChemElement[] = [
  { symbol: 'H', name: 'Hydrogen', number: 1, mass: 1.008, group: 'nonmetal' },
  { symbol: 'He', name: 'Helium', number: 2, mass: 4.003, group: 'noble gas' },
  { symbol: 'Li', name: 'Lithium', number: 3, mass: 6.941, group: 'alkali metal' },
  { symbol: 'Be', name: 'Beryllium', number: 4, mass: 9.012, group: 'alkaline earth' },
  { symbol: 'B', name: 'Boron', number: 5, mass: 10.811, group: 'metalloid' },
  { symbol: 'C', name: 'Carbon', number: 6, mass: 12.011, group: 'nonmetal' },
  { symbol: 'N', name: 'Nitrogen', number: 7, mass: 14.007, group: 'nonmetal' },
  { symbol: 'O', name: 'Oxygen', number: 8, mass: 15.999, group: 'nonmetal' },
  { symbol: 'F', name: 'Fluorine', number: 9, mass: 18.998, group: 'halogen' },
  { symbol: 'Ne', name: 'Neon', number: 10, mass: 20.18, group: 'noble gas' },
  { symbol: 'Na', name: 'Sodium', number: 11, mass: 22.99, group: 'alkali metal' },
  { symbol: 'Mg', name: 'Magnesium', number: 12, mass: 24.305, group: 'alkaline earth' },
  { symbol: 'Al', name: 'Aluminium', number: 13, mass: 26.982, group: 'post-transition metal' },
  { symbol: 'Si', name: 'Silicon', number: 14, mass: 28.086, group: 'metalloid' },
  { symbol: 'P', name: 'Phosphorus', number: 15, mass: 30.974, group: 'nonmetal' },
  { symbol: 'S', name: 'Sulfur', number: 16, mass: 32.065, group: 'nonmetal' },
  { symbol: 'Cl', name: 'Chlorine', number: 17, mass: 35.453, group: 'halogen' },
  { symbol: 'Ar', name: 'Argon', number: 18, mass: 39.948, group: 'noble gas' },
  { symbol: 'K', name: 'Potassium', number: 19, mass: 39.098, group: 'alkali metal' },
  { symbol: 'Ca', name: 'Calcium', number: 20, mass: 40.078, group: 'alkaline earth' },
  { symbol: 'Fe', name: 'Iron', number: 26, mass: 55.845, group: 'transition metal' },
  { symbol: 'Cu', name: 'Copper', number: 29, mass: 63.546, group: 'transition metal' },
];

/**
 * Parse a chemical formula into its component atoms and their counts.
 * Handles coefficients, subscripts, and parentheses.
 * e.g. "2H2O" -> { H: 4, O: 2 }
 * e.g. "Ca(OH)2" -> { Ca: 1, O: 2, H: 2 }
 */
export function parseFormula(formula: string): Record<string, number> {
  const counts: Record<string, number> = {};

  // 1. Extract coefficient (if any)
  const coeffMatch = formula.match(/^(\d+)/);
  const coefficient = coeffMatch ? parseInt(coeffMatch[1]) : 1;
  let rest = coeffMatch ? formula.substring(coeffMatch[1].length) : formula;

  // 2. Helper to add to counts
  const addAtoms = (element: string, count: number, multiplier: number = 1) => {
    counts[element] = (counts[element] || 0) + count * multiplier;
  };

  // 3. Handle parentheses recursively or using a stack
  // For simplicity here, we'll use a basic regex for elements and handle one level of parens
  // A truly "formidable" version would use a proper grammar.

  const processPart = (part: string, multiplier: number) => {
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let m;
    while ((m = regex.exec(part)) !== null) {
      const element = m[1];
      const count = m[2] ? parseInt(m[2]) : 1;
      addAtoms(element, count, multiplier);
    }
  };

  // Handle parentheses: e.g. Ca(OH)2
  const parenRegex = /\(([^)]+)\)(\d*)/g;
  let lastIdx = 0;
  let parenMatch;
  while ((parenMatch = parenRegex.exec(rest)) !== null) {
    // Process text before parens
    processPart(rest.substring(lastIdx, parenMatch.index), coefficient);
    // Process inner part with its subscript
    const inner = parenMatch[1];
    const sub = parenMatch[2] ? parseInt(parenMatch[2]) : 1;
    processPart(inner, coefficient * sub);
    lastIdx = parenMatch.index + parenMatch[0].length;
  }
  // Process remaining text
  processPart(rest.substring(lastIdx), coefficient);

  return counts;
}

/**
 * Check if a chemical equation is balanced.
 * Returns an object with balance status and atom counts for both sides.
 */
export function checkBalance(equation: string): {
  balanced: boolean;
  left: Record<string, number>;
  right: Record<string, number>;
  missing?: string[];
} {
  // Split by arrow (->, <=>, etc.)
  const sides = equation.split(/->|<=>|<-|<->/);
  if (sides.length !== 2) {
    throw new Error('Invalid equation: must have exactly one arrow');
  }

  const parseSide = (side: string) => {
    const parts = side.split('+').map((p) => p.trim());
    const total: Record<string, number> = {};
    for (const part of parts) {
      const counts = parseFormula(part);
      for (const [el, count] of Object.entries(counts)) {
        total[el] = (total[el] || 0) + count;
      }
    }
    return total;
  };

  const left = parseSide(sides[0]);
  const right = parseSide(sides[1]);

  const allElements = new Set([...Object.keys(left), ...Object.keys(right)]);
  const missing: string[] = [];
  let balanced = true;

  for (const el of allElements) {
    if (left[el] !== right[el]) {
      balanced = false;
      missing.push(el);
    }
  }

  return { balanced, left, right, missing };
}

/**
 * Look up an element by symbol or name.
 */
export function getElement(symbolOrName: string): ChemElement | undefined {
  const q = symbolOrName.toLowerCase();
  return ELEMENTS.find((e) => e.symbol.toLowerCase() === q || e.name.toLowerCase() === q);
}
