/**
   * LatexMath — renders an inline LaTeX math expression.
   *
   * @example
   * <p>Energy: <LatexMath formula="E = mc^2" /></p>
   * <p>Equilibrium: <LatexMath formula="K_{eq} = \frac{[\text{products}]}{[\text{reactants}]}" /></p>
   */
import { type RenderOptions } from './renderer.js';
interface Props extends RenderOptions {
    formula: string;
    class?: string;
}
declare const LatexMath: import("svelte").Component<Props, {}, "">;
type LatexMath = ReturnType<typeof LatexMath>;
export default LatexMath;
