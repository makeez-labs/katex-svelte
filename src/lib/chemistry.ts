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

// ── Periodic table data (All 118 elements) ────────────────────

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
  { symbol: 'Sc', name: 'Scandium', number: 21, mass: 44.956, group: 'transition metal' },
  { symbol: 'Ti', name: 'Titanium', number: 22, mass: 47.867, group: 'transition metal' },
  { symbol: 'V', name: 'Vanadium', number: 23, mass: 50.942, group: 'transition metal' },
  { symbol: 'Cr', name: 'Chromium', number: 24, mass: 51.996, group: 'transition metal' },
  { symbol: 'Mn', name: 'Manganese', number: 25, mass: 54.938, group: 'transition metal' },
  { symbol: 'Fe', name: 'Iron', number: 26, mass: 55.845, group: 'transition metal' },
  { symbol: 'Co', name: 'Cobalt', number: 27, mass: 58.933, group: 'transition metal' },
  { symbol: 'Ni', name: 'Nickel', number: 28, mass: 58.693, group: 'transition metal' },
  { symbol: 'Cu', name: 'Copper', number: 29, mass: 63.546, group: 'transition metal' },
  { symbol: 'Zn', name: 'Zinc', number: 30, mass: 65.38, group: 'transition metal' },
  { symbol: 'Ga', name: 'Gallium', number: 31, mass: 69.723, group: 'post-transition metal' },
  { symbol: 'Ge', name: 'Germanium', number: 32, mass: 72.63, group: 'metalloid' },
  { symbol: 'As', name: 'Arsenic', number: 33, mass: 74.922, group: 'metalloid' },
  { symbol: 'Se', name: 'Selenium', number: 34, mass: 78.971, group: 'nonmetal' },
  { symbol: 'Br', name: 'Bromine', number: 35, mass: 79.904, group: 'halogen' },
  { symbol: 'Kr', name: 'Krypton', number: 36, mass: 83.798, group: 'noble gas' },
  { symbol: 'Rb', name: 'Rubidium', number: 37, mass: 85.468, group: 'alkali metal' },
  { symbol: 'Sr', name: 'Strontium', number: 38, mass: 87.62, group: 'alkaline earth' },
  { symbol: 'Y', name: 'Yttrium', number: 39, mass: 88.906, group: 'transition metal' },
  { symbol: 'Zr', name: 'Zirconium', number: 40, mass: 91.224, group: 'transition metal' },
  { symbol: 'Nb', name: 'Niobium', number: 41, mass: 92.906, group: 'transition metal' },
  { symbol: 'Mo', name: 'Molybdenum', number: 42, mass: 95.95, group: 'transition metal' },
  { symbol: 'Tc', name: 'Technetium', number: 43, mass: 98, group: 'transition metal' },
  { symbol: 'Ru', name: 'Ruthenium', number: 44, mass: 101.07, group: 'transition metal' },
  { symbol: 'Rh', name: 'Rhodium', number: 45, mass: 102.91, group: 'transition metal' },
  { symbol: 'Pd', name: 'Palladium', number: 46, mass: 106.42, group: 'transition metal' },
  { symbol: 'Ag', name: 'Silver', number: 47, mass: 107.87, group: 'transition metal' },
  { symbol: 'Cd', name: 'Cadmium', number: 48, mass: 112.41, group: 'transition metal' },
  { symbol: 'In', name: 'Indium', number: 49, mass: 114.82, group: 'post-transition metal' },
  { symbol: 'Sn', name: 'Tin', number: 50, mass: 118.71, group: 'post-transition metal' },
  { symbol: 'Sb', name: 'Antimony', number: 51, mass: 121.76, group: 'metalloid' },
  { symbol: 'Te', name: 'Tellurium', number: 52, mass: 127.6, group: 'metalloid' },
  { symbol: 'I', name: 'Iodine', number: 53, mass: 126.9, group: 'halogen' },
  { symbol: 'Xe', name: 'Xenon', number: 54, mass: 131.29, group: 'noble gas' },
  { symbol: 'Cs', name: 'Cesium', number: 55, mass: 132.91, group: 'alkali metal' },
  { symbol: 'Ba', name: 'Barium', number: 56, mass: 137.33, group: 'alkaline earth' },
  { symbol: 'La', name: 'Lanthanum', number: 57, mass: 138.91, group: 'lanthanide' },
  { symbol: 'Ce', name: 'Cerium', number: 58, mass: 140.12, group: 'lanthanide' },
  { symbol: 'Pr', name: 'Praseodymium', number: 59, mass: 140.91, group: 'lanthanide' },
  { symbol: 'Nd', name: 'Neodymium', number: 60, mass: 144.24, group: 'lanthanide' },
  { symbol: 'Pm', name: 'Promethium', number: 61, mass: 145, group: 'lanthanide' },
  { symbol: 'Sm', name: 'Samarium', number: 62, mass: 150.36, group: 'lanthanide' },
  { symbol: 'Eu', name: 'Europium', number: 63, mass: 151.96, group: 'lanthanide' },
  { symbol: 'Gd', name: 'Gadolinium', number: 64, mass: 157.25, group: 'lanthanide' },
  { symbol: 'Tb', name: 'Terbium', number: 65, mass: 158.93, group: 'lanthanide' },
  { symbol: 'Dy', name: 'Dysprosium', number: 66, mass: 162.5, group: 'lanthanide' },
  { symbol: 'Ho', name: 'Holmium', number: 67, mass: 164.93, group: 'lanthanide' },
  { symbol: 'Er', name: 'Erbium', number: 68, mass: 167.26, group: 'lanthanide' },
  { symbol: 'Tm', name: 'Thulium', number: 69, mass: 168.93, group: 'lanthanide' },
  { symbol: 'Yb', name: 'Ytterbium', number: 70, mass: 173.05, group: 'lanthanide' },
  { symbol: 'Lu', name: 'Lutetium', number: 71, mass: 174.97, group: 'lanthanide' },
  { symbol: 'Hf', name: 'Hafnium', number: 72, mass: 178.49, group: 'transition metal' },
  { symbol: 'Ta', name: 'Tantalum', number: 73, mass: 180.95, group: 'transition metal' },
  { symbol: 'W', name: 'Tungsten', number: 74, mass: 183.84, group: 'transition metal' },
  { symbol: 'Re', name: 'Rhenium', number: 75, mass: 186.21, group: 'transition metal' },
  { symbol: 'Os', name: 'Osmium', number: 76, mass: 190.23, group: 'transition metal' },
  { symbol: 'Ir', name: 'Iridium', number: 77, mass: 192.22, group: 'transition metal' },
  { symbol: 'Pt', name: 'Platinum', number: 78, mass: 195.08, group: 'transition metal' },
  { symbol: 'Au', name: 'Gold', number: 79, mass: 196.97, group: 'transition metal' },
  { symbol: 'Hg', name: 'Mercury', number: 80, mass: 200.59, group: 'transition metal' },
  { symbol: 'Tl', name: 'Thallium', number: 81, mass: 204.38, group: 'post-transition metal' },
  { symbol: 'Pb', name: 'Lead', number: 82, mass: 207.2, group: 'post-transition metal' },
  { symbol: 'Bi', name: 'Bismuth', number: 83, mass: 208.98, group: 'post-transition metal' },
  { symbol: 'Po', name: 'Polonium', number: 84, mass: 209, group: 'post-transition metal' },
  { symbol: 'At', name: 'Astatine', number: 85, mass: 210, group: 'halogen' },
  { symbol: 'Rn', name: 'Radon', number: 86, mass: 222, group: 'noble gas' },
  { symbol: 'Fr', name: 'Francium', number: 87, mass: 223, group: 'alkali metal' },
  { symbol: 'Ra', name: 'Radium', number: 88, mass: 226, group: 'alkaline earth' },
  { symbol: 'Ac', name: 'Actinium', number: 89, mass: 227, group: 'actinide' },
  { symbol: 'Th', name: 'Thorium', number: 90, mass: 232.04, group: 'actinide' },
  { symbol: 'Pa', name: 'Protactinium', number: 91, mass: 231.04, group: 'actinide' },
  { symbol: 'U', name: 'Uranium', number: 92, mass: 238.03, group: 'actinide' },
  { symbol: 'Np', name: 'Neptunium', number: 93, mass: 237, group: 'actinide' },
  { symbol: 'Pu', name: 'Plutonium', number: 94, mass: 244, group: 'actinide' },
  { symbol: 'Am', name: 'Americium', number: 95, mass: 243, group: 'actinide' },
  { symbol: 'Cm', name: 'Curium', number: 96, mass: 247, group: 'actinide' },
  { symbol: 'Bk', name: 'Berkelium', number: 97, mass: 247, group: 'actinide' },
  { symbol: 'Cf', name: 'Californium', number: 98, mass: 251, group: 'actinide' },
  { symbol: 'Es', name: 'Einsteinium', number: 99, mass: 252, group: 'actinide' },
  { symbol: 'Fm', name: 'Fermium', number: 100, mass: 257, group: 'actinide' },
  { symbol: 'Md', name: 'Mendelevium', number: 101, mass: 258, group: 'actinide' },
  { symbol: 'No', name: 'Nobelium', number: 102, mass: 259, group: 'actinide' },
  { symbol: 'Lr', name: 'Lawrencium', number: 103, mass: 266, group: 'actinide' },
  { symbol: 'Rf', name: 'Rutherfordium', number: 104, mass: 267, group: 'transition metal' },
  { symbol: 'Db', name: 'Dubnium', number: 105, mass: 268, group: 'transition metal' },
  { symbol: 'Sg', name: 'Seaborgium', number: 106, mass: 269, group: 'transition metal' },
  { symbol: 'Bh', name: 'Bohrium', number: 107, mass: 270, group: 'transition metal' },
  { symbol: 'Hs', name: 'Hassium', number: 108, mass: 277, group: 'transition metal' },
  { symbol: 'Mt', name: 'Meitnerium', number: 109, mass: 278, group: 'unknown' },
  { symbol: 'Ds', name: 'Darmstadtium', number: 110, mass: 281, group: 'unknown' },
  { symbol: 'Rg', name: 'Roentgenium', number: 111, mass: 282, group: 'unknown' },
  { symbol: 'Cn', name: 'Copernicium', number: 112, mass: 285, group: 'transition metal' },
  { symbol: 'Nh', name: 'Nihonium', number: 113, mass: 286, group: 'unknown' },
  { symbol: 'Fl', name: 'Flerovium', number: 114, mass: 289, group: 'unknown' },
  { symbol: 'Mc', name: 'Moscovium', number: 115, mass: 290, group: 'unknown' },
  { symbol: 'Lv', name: 'Livermorium', number: 116, mass: 293, group: 'unknown' },
  { symbol: 'Ts', name: 'Tennessine', number: 117, mass: 294, group: 'unknown' },
  { symbol: 'Og', name: 'Oganesson', number: 118, mass: 294, group: 'unknown' },
];

/**
 * Parse a chemical formula into its component atoms and their counts.
 * Handles coefficients, subscripts, and nested parentheses recursively.
 * e.g. "2H2O" -> { H: 4, O: 2 }
 * e.g. "Ca(OH)2" -> { Ca: 1, O: 2, H: 2 }
 * e.g. "Mg(NO3)2" -> { Mg: 1, N: 2, O: 6 }
 * e.g. "Al2(SO4)3" -> { Al: 2, S: 3, O: 12 }
 */
export function parseFormula(formula: string): Record<string, number> {
  const counts: Record<string, number> = {};

  // Remove any whitespace
  const cleanFormula = formula.replace(/\s+/g, '');
  
  // 1. Extract coefficient (if any)
  const coeffMatch = cleanFormula.match(/^(\d+)/);
  const coefficient = coeffMatch ? parseInt(coeffMatch[1]) : 1;
  let rest = coeffMatch ? cleanFormula.substring(coeffMatch[1].length) : cleanFormula;

  // 2. Recursive parser for nested parentheses
  const parsePart = (str: string, multiplier: number = 1): Record<string, number> => {
    const result: Record<string, number> = {};
    let i = 0;

    while (i < str.length) {
      // Check for opening parenthesis
      if (str[i] === '(') {
        // Find matching closing parenthesis
        let depth = 1;
        let j = i + 1;
        while (j < str.length && depth > 0) {
          if (str[j] === '(') depth++;
          else if (str[j] === ')') depth--;
          j++;
        }
        
        // Extract content inside parentheses
        const inner = str.substring(i + 1, j - 1);
        
        // Get subscript after closing parenthesis
        let k = j;
        let subscriptStr = '';
        while (k < str.length && /\d/.test(str[k])) {
          subscriptStr += str[k];
          k++;
        }
        const subscript = subscriptStr ? parseInt(subscriptStr) : 1;
        
        // Recursively parse inner content
        const innerCounts = parsePart(inner, multiplier * subscript);
        for (const [el, count] of Object.entries(innerCounts)) {
          result[el] = (result[el] || 0) + count;
        }
        
        i = k;
      }
      // Check for element (uppercase letter followed by optional lowercase)
      else if (/[A-Z]/.test(str[i])) {
        let element = str[i];
        i++;
        
        // Check for lowercase continuation
        while (i < str.length && /[a-z]/.test(str[i])) {
          element += str[i];
          i++;
        }
        
        // Check for subscript
        let subscriptStr = '';
        while (i < str.length && /\d/.test(str[i])) {
          subscriptStr += str[i];
          i++;
        }
        const subscript = subscriptStr ? parseInt(subscriptStr) : 1;
        
        result[element] = (result[element] || 0) + subscript * multiplier;
      }
      else {
        // Skip unexpected characters
        i++;
      }
    }

    return result;
  };

  // Parse with coefficient
  const parsed = parsePart(rest, coefficient);
  
  // Merge into counts
  for (const [el, count] of Object.entries(parsed)) {
    counts[el] = (counts[el] || 0) + count;
  }

  return counts;
}

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
export function calculateMolarMass(formula: string): number | null {
  const atomCounts = parseFormula(formula);
  let totalMass = 0;

  for (const [element, count] of Object.entries(atomCounts)) {
    const elemData = ELEMENTS.find(e => e.symbol === element);
    if (!elemData) {
      return null; // Unknown element
    }
    totalMass += elemData.mass * count;
  }

  return Math.round(totalMass * 1000) / 1000; // Round to 3 decimal places
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
