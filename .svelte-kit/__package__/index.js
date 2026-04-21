// ── Components ────────────────────────────────────────────────
export { default as ChemEquation } from './ChemEquation.svelte';
export { default as ChemBlock } from './ChemBlock.svelte';
export { default as ChemAuto } from './ChemAuto.svelte';
export { default as ChemNotation } from './ChemNotation.svelte';
export { default as LatexMath } from './LatexMath.svelte';
export { default as LatexBlock } from './LatexBlock.svelte';
// ── Renderer utilities ────────────────────────────────────────
export { renderChem, renderChemBlock, renderLatex, renderLatexBlock, renderAuto, isValidChem, isValidLatex, } from './renderer.js';
// ── Chemistry utilities ───────────────────────────────────────
export { toCe, buildReaction, isValidFormula, parseFormula, checkBalance, searchFormulas, searchReactions, getElement, calculateMolarMass, COMMON_FORMULAS, COMMON_REACTIONS, ELEMENTS, } from './chemistry.js';
// ── Equation balancing (using linear algebra / null space) ────
import { parseFormula } from './chemistry.js';
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
export function balanceEquation(equation) {
    // Parse the equation
    const sides = equation.split(/->|<=>|<-|<->/).map(s => s.trim());
    if (sides.length !== 2) {
        return null;
    }
    const parseSide = (side) => {
        return side.split('+').map(s => s.trim()).filter(s => s.length > 0);
    };
    const reactants = parseSide(sides[0]);
    const products = parseSide(sides[1]);
    const allCompounds = [...reactants, ...products];
    if (allCompounds.length === 0) {
        return null;
    }
    // Extract all unique elements
    const elementSet = new Set();
    const parsedCompounds = allCompounds.map(compound => {
        const atoms = parseFormula(compound);
        Object.keys(atoms).forEach(el => elementSet.add(el));
        return atoms;
    });
    const elements = Array.from(elementSet);
    const numElements = elements.length;
    const numCompounds = allCompounds.length;
    // Build matrix: rows = elements, cols = compounds
    // Reactants have positive coefficients, products negative
    const matrix = [];
    for (let i = 0; i < numElements; i++) {
        const row = [];
        for (let j = 0; j < numCompounds; j++) {
            const count = parsedCompounds[j][elements[i]] || 0;
            // Reactants (positive), Products (negative)
            row.push(j < reactants.length ? count : -count);
        }
        matrix.push(row);
    }
    // Solve using Gaussian elimination to find null space
    const coefficients = solveNullSpace(matrix, numCompounds);
    if (!coefficients) {
        return null;
    }
    // Build balanced equation
    const formatCompound = (compound, coeff) => {
        if (coeff === 1)
            return compound;
        return `${coeff}${compound}`;
    };
    const balancedReactants = reactants.map((r, i) => formatCompound(r, coefficients[i]));
    const balancedProducts = products.map((p, i) => formatCompound(p, coefficients[reactants.length + i]));
    return {
        equation: `${balancedReactants.join(' + ')} -> ${balancedProducts.join(' + ')}`,
        coefficients,
        reactants,
        products,
    };
}
/**
 * Solve for null space of matrix using Gaussian elimination.
 * Returns smallest positive integer coefficients or null if no solution.
 */
function solveNullSpace(matrix, numVars) {
    const numRows = matrix.length;
    const numCols = numVars;
    // Create augmented matrix for Gaussian elimination
    const aug = matrix.map(row => [...row]);
    let pivotRow = 0;
    const pivotCols = [];
    // Forward elimination
    for (let col = 0; col < numCols && pivotRow < numRows; col++) {
        // Find pivot
        let maxRow = pivotRow;
        for (let row = pivotRow + 1; row < numRows; row++) {
            if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) {
                maxRow = row;
            }
        }
        if (Math.abs(aug[maxRow][col]) < 1e-10) {
            continue; // No pivot in this column
        }
        // Swap rows
        [aug[pivotRow], aug[maxRow]] = [aug[maxRow], aug[pivotRow]];
        pivotCols.push(col);
        // Eliminate
        const pivot = aug[pivotRow][col];
        for (let c = col; c < numCols; c++) {
            aug[pivotRow][c] /= pivot;
        }
        for (let row = 0; row < numRows; row++) {
            if (row !== pivotRow && Math.abs(aug[row][col]) > 1e-10) {
                const factor = aug[row][col];
                for (let c = col; c < numCols; c++) {
                    aug[row][c] -= factor * aug[pivotRow][c];
                }
            }
        }
        pivotRow++;
    }
    // Back substitution to find null space vector
    const freeCols = [];
    for (let col = 0; col < numCols; col++) {
        if (!pivotCols.includes(col)) {
            freeCols.push(col);
        }
    }
    // If no free variables, try setting last variable as free
    if (freeCols.length === 0) {
        freeCols.push(numCols - 1);
    }
    // Set free variable to 1 and solve
    const solution = new Array(numCols).fill(0);
    solution[freeCols[0]] = 1;
    // Back substitute
    for (let i = pivotCols.length - 1; i >= 0; i--) {
        const col = pivotCols[i];
        let sum = 0;
        for (let j = col + 1; j < numCols; j++) {
            sum += aug[i][j] * solution[j];
        }
        solution[col] = -sum;
    }
    // Convert to positive integers
    // First, make all positive
    const minVal = Math.min(...solution.filter(v => v !== 0));
    if (minVal < 0) {
        for (let i = 0; i < numCols; i++) {
            solution[i] = -solution[i];
        }
    }
    // Find LCM of denominators to convert to integers
    const fractions = solution.map(v => {
        // Convert to fraction with tolerance
        const tolerance = 1e-6;
        for (let d = 1; d <= 1000; d++) {
            const n = Math.round(v * d);
            if (Math.abs(v - n / d) < tolerance) {
                return { n: Math.abs(n), d };
            }
        }
        return { n: Math.round(v * 1000), d: 1000 };
    });
    // Find LCM of all denominators
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    let commonDenom = 1;
    for (const f of fractions) {
        commonDenom = lcm(commonDenom, f.d);
    }
    // Multiply by common denominator and simplify
    const intSolution = solution.map((v, i) => Math.round(v * commonDenom));
    // Find GCD of all coefficients
    let commonFactor = intSolution[0];
    for (let i = 1; i < intSolution.length; i++) {
        commonFactor = gcd(commonFactor, intSolution[i]);
    }
    // Divide by GCD
    const finalCoeffs = intSolution.map(v => Math.max(1, Math.round(v / commonFactor)));
    // Verify solution
    for (let i = 0; i < numRows; i++) {
        let sum = 0;
        for (let j = 0; j < numCols; j++) {
            sum += matrix[i][j] * finalCoeffs[j];
        }
        if (Math.abs(sum) > 1e-6) {
            // Solution doesn't verify, return original checkBalance result
            return null;
        }
    }
    return finalCoeffs;
}
