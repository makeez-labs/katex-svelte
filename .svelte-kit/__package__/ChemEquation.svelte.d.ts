/**
   * ChemEquation — renders a chemistry expression inline using mhchem's \ce{} notation.
   *
   * @example
   * <!-- Water molecule -->
   * <ChemEquation formula="H2O" />
   *
   * @example
   * <!-- Combustion reaction -->
   * <ChemEquation formula="CH4 + 2O2 -> CO2 + 2H2O" />
   *
   * @example
   * <!-- Ionic equation -->
   * <ChemEquation formula="Fe^{2+} + 2e^- -> Fe" />
   *
   * @example
   * <!-- Reaction with condition above arrow -->
   * <ChemEquation formula="2H2 + O2 ->[\Delta] 2H2O" />
   */
import { type RenderOptions } from './renderer.js';
interface Props extends RenderOptions {
    /** Chemistry formula in mhchem \ce{} notation (without the \ce{} wrapper) */
    formula: string;
    /** Extra CSS classes on the wrapper span */
    class?: string;
}
declare const ChemEquation: import("svelte").Component<Props, {}, "">;
type ChemEquation = ReturnType<typeof ChemEquation>;
export default ChemEquation;
