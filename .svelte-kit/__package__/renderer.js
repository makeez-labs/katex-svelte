/**
 * Core rendering utilities for katex-svelte.
 *
 * KaTeX renders synchronously — no async loading required.
 * mhchem is imported as a KaTeX extension that adds \ce{} support.
 */
import katex from 'katex';
import 'katex/contrib/mhchem/mhchem.js';
// ── Chemistry rendering (\ce{} via mhchem) ───────────────────
/**
 * Render a chemistry expression using mhchem's \ce{} notation.
 *
 * @example
 * renderChem('H2O')                 // water
 * renderChem('CO2 + H2O -> H2CO3') // reaction
 * renderChem('Fe^{2+} + 2e^- -> Fe') // ionic
 * renderChem('2H2 + O2 ->[\Delta] 2H2O') // with condition
 */
export function renderChem(formula, options = {}) {
    return renderLatex(`\\ce{${formula}}`, {
        ...options,
        displayMode: options.displayMode ?? false,
    });
}
/**
 * Render a chemistry expression in display (block) mode.
 */
export function renderChemBlock(formula, options = {}) {
    return renderChem(formula, { ...options, displayMode: true });
}
// ── Math rendering ────────────────────────────────────────────
/**
 * Render a LaTeX math expression.
 *
 * @example
 * renderLatex('E = mc^2')
 * renderLatex('\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}')
 */
export function renderLatex(latex, options = {}) {
    const { errorMode = 'text', displayMode = false, ...rest } = options;
    try {
        const html = katex.renderToString(latex, {
            throwOnError: true,
            displayMode,
            output: 'html',
            trust: rest.trust ?? false,
            minRuleThickness: rest.minRuleThickness,
            maxSize: rest.maxSize ?? 10,
            colorIsTextColor: !!rest.color,
            ...(rest.color ? { macros: { '\\color': rest.color } } : {}),
        });
        return { html, error: null, isValid: true };
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : 'Render failed';
        if (errorMode === 'throw')
            throw e;
        if (errorMode === 'none')
            return { html: '', error: msg, isValid: false };
        // errorMode === 'text' — render error message inline
        const errHtml = `<span class="katex-error" style="color:#dc2626;font-family:monospace;font-size:0.9em" title="${escapeHtml(msg)}">LaTeX error: ${escapeHtml(msg)}</span>`;
        return { html: errHtml, error: msg, isValid: false };
    }
}
/**
 * Render a LaTeX math expression in display (block) mode.
 */
export function renderLatexBlock(latex, options = {}) {
    return renderLatex(latex, { ...options, displayMode: true });
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
export function renderAuto(text, options = {}) {
    const { inlineDelimiters = [
        ['$', '$'],
        ['\\(', '\\)'],
    ], blockDelimiters = [
        ['$$', '$$'],
        ['\\[', '\\]'],
    ], chemistry = true, ...renderOpts } = options;
    let result = escapeHtml(text);
    // Define all delimiters with their properties
    const delimiters = [
        ...blockDelimiters.map(([o, c]) => ({
            open: escapeHtml(o),
            close: escapeHtml(c),
            display: true,
            type: 'math',
        })),
        ...inlineDelimiters.map(([o, c]) => ({
            open: escapeHtml(o),
            close: escapeHtml(c),
            display: false,
            type: 'math',
        })),
    ];
    if (chemistry) {
        delimiters.push({
            open: escapeHtml('\\ce{'),
            close: escapeHtml('}'),
            display: false,
            type: 'chem',
        });
    }
    // Sort by opener length descending to match longest first (e.g. $$ before $)
    delimiters.sort((a, b) => b.open.length - a.open.length);
    // We'll use a marker-based approach to protect math/chem parts from subsequent replaces
    const parts = [
        { type: 'text', content: result },
    ];
    for (const delim of delimiters) {
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].type === 'html')
                continue;
            const { content } = parts[i];
            let startIndex = 0;
            let openIdx = -1;
            while (true) {
                openIdx = content.indexOf(delim.open, startIndex);
                if (openIdx === -1)
                    break;
                // Check for escaping (e.g. \\$)
                if (openIdx > 0 && content[openIdx - 1] === '\\') {
                    startIndex = openIdx + 1; // move past the escaped character
                }
                else {
                    break; // found unescaped
                }
            }
            if (openIdx === -1)
                continue;
            const closeIdx = content.indexOf(delim.close, openIdx + delim.open.length);
            if (closeIdx === -1)
                continue;
            const before = content.substring(0, openIdx);
            const inner = content.substring(openIdx + delim.open.length, closeIdx);
            const after = content.substring(closeIdx + delim.close.length);
            // Render the inner part
            let rendered;
            const unescapedInner = unescapeHtml(inner);
            if (delim.type === 'chem') {
                rendered = renderChem(unescapedInner, renderOpts);
            }
            else {
                rendered = delim.display
                    ? renderLatexBlock(unescapedInner, renderOpts)
                    : renderLatex(unescapedInner, renderOpts);
            }
            // Replace this part with [before, rendered, after]
            const newParts = [];
            if (before)
                newParts.push({ type: 'text', content: before });
            newParts.push({ type: 'html', content: rendered.html });
            if (after)
                newParts.push({ type: 'text', content: after });
            parts.splice(i, 1, ...newParts);
            // Adjust i to continue from the 'after' part (if any) or the next part
            i += before ? 1 : 0;
        }
    }
    // Final pass: handle escaped characters in the remaining text parts
    return parts
        .map((p) => {
        if (p.type === 'html')
            return p.content;
        // Unescape \$ -> $, \\ -> \ etc in plain text parts
        return p.content.replace(/\\([\\$])/g, '$1');
    })
        .join('');
}
// ── Chemistry validation ──────────────────────────────────────
/**
 * Returns true if a \ce{} formula is valid and can be rendered.
 */
export function isValidChem(formula) {
    return renderChem(formula, { errorMode: 'none' }).isValid;
}
/**
 * Returns true if a LaTeX string is valid and can be rendered.
 */
export function isValidLatex(latex) {
    return renderLatex(latex, { errorMode: 'none' }).isValid;
}
// ── Helpers ───────────────────────────────────────────────────
function escapeHtml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function unescapeHtml(s) {
    return s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');
}
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
