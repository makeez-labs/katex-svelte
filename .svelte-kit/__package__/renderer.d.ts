/**
 * Core rendering utilities for katex-svelte.
 *
 * KaTeX renders synchronously — no async loading required.
 * mhchem is imported as a KaTeX extension that adds \ce{} support.
 */
import 'katex/contrib/mhchem/mhchem.js';
export interface RenderOptions {
    /** Show error text in the output instead of throwing (default: true) */
    errorMode?: 'text' | 'throw' | 'none';
    /** Display mode — centers the equation on its own line (default: false) */
    displayMode?: boolean;
    /** Trust all LaTeX commands including \htmlClass etc. (default: false) */
    trust?: boolean;
    /** Minimum thickness of lines in em (default: undefined) */
    minRuleThickness?: number;
    /** Max size for \Huge etc. in ems (default: 10) */
    maxSize?: number;
    /** Text colour override */
    color?: string;
}
export interface RenderResult {
    html: string;
    error: string | null;
    isValid: boolean;
}
/**
 * Render a chemistry expression using mhchem's \ce{} notation.
 *
 * @example
 * renderChem('H2O')                 // water
 * renderChem('CO2 + H2O -> H2CO3') // reaction
 * renderChem('Fe^{2+} + 2e^- -> Fe') // ionic
 * renderChem('2H2 + O2 ->[\Delta] 2H2O') // with condition
 */
export declare function renderChem(formula: string, options?: RenderOptions): RenderResult;
/**
 * Render a chemistry expression in display (block) mode.
 */
export declare function renderChemBlock(formula: string, options?: RenderOptions): RenderResult;
/**
 * Render a LaTeX math expression.
 *
 * @example
 * renderLatex('E = mc^2')
 * renderLatex('\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}')
 */
export declare function renderLatex(latex: string, options?: RenderOptions): RenderResult;
/**
 * Render a LaTeX math expression in display (block) mode.
 */
export declare function renderLatexBlock(latex: string, options?: RenderOptions): RenderResult;
export interface AutoRenderOptions extends RenderOptions {
    /** Delimiters for inline math (default: $...$ and \(...\)) */
    inlineDelimiters?: [string, string][];
    /** Delimiters for block math (default: $$...$$ and \[...\]) */
    blockDelimiters?: [string, string][];
    /** Also render \ce{...} chemistry expressions (default: true) */
    chemistry?: boolean;
}
/**
 * Parse a string of text and render all embedded LaTeX and chemistry
 * expressions, returning safe HTML.
 *
 * Supports:
 *   $...$       inline math
 *   $$...$$     display math
 *   \(...\)     inline math (alt)
 *   \[...\]     display math (alt)
 *   \ce{...}    chemistry (mhchem)
 *
 * @example
 * renderAuto('Water is $H_2O$ and ice melts at $0°C$')
 * renderAuto('The equation \\ce{CO2 + H2O -> H2CO3} shows...')
 */
export declare function renderAuto(text: string, options?: AutoRenderOptions): string;
/**
 * Returns true if a \ce{} formula is valid and can be rendered.
 */
export declare function isValidChem(formula: string): boolean;
/**
 * Returns true if a LaTeX string is valid and can be rendered.
 */
export declare function isValidLatex(latex: string): boolean;
