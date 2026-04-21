/**
   * ChemAuto — automatically finds and renders all chemistry and math
   * expressions embedded in a string of text.
   *
   * Supports:
   *   \ce{...}   — chemistry expressions (mhchem)
   *   $...$      — inline math
   *   $$...$$    — display math
   *   \(...\)    — inline math (alt)
   *   \[...\]    — display math (alt)
   *
   * Perfect for:
   *   - Chemistry lesson paragraphs
   *   - Exam questions
   *   - Notes with mixed text and equations
   *
   * @example
   * <ChemAuto text="Water (\ce{H2O}) has a molar mass of $18\text{ g/mol}$." />
   *
   * @example
   * <ChemAuto text="The combustion of methane: \ce{CH4 + 2O2 -> CO2 + 2H2O}" />
   *
   * @example
   * <ChemAuto text="pH is defined as $$pH = -\log_{10}[\ce{H+}]$$" />
   */
import { type AutoRenderOptions } from './renderer.js';
interface Props extends AutoRenderOptions {
    /** Text containing embedded \ce{}, $...$, $$...$$ expressions */
    text: string;
    /** HTML tag to wrap the output (default: 'p') */
    tag?: string;
    class?: string;
}
declare const ChemAuto: import("svelte").Component<Props, {}, "">;
type ChemAuto = ReturnType<typeof ChemAuto>;
export default ChemAuto;
