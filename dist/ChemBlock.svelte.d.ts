/**
   * ChemBlock — renders a chemistry equation in display mode,
   * centered on its own line. Ideal for important reactions in lessons.
   *
   * @example
   * <ChemBlock formula="2H2 + O2 -> 2H2O" label="Combustion of hydrogen" />
   *
   * @example
   * <ChemBlock formula="CH4 + 2O2 ->[\text{ignition}] CO2 + 2H2O" />
   */
import { type RenderOptions } from './renderer.js';
interface Props extends RenderOptions {
    formula: string;
    /** Optional label shown below the equation */
    label?: string;
    /** Optional equation number shown on the right */
    number?: string | number;
    /** Extra CSS classes */
    class?: string;
}
declare const ChemBlock: import("svelte").Component<Props, {}, "">;
type ChemBlock = ReturnType<typeof ChemBlock>;
export default ChemBlock;
