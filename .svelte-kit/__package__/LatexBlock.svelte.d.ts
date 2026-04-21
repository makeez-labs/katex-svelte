/**
   * LatexBlock — renders a LaTeX expression in display (block) mode.
   * Centered on its own line, larger and more prominent than inline math.
   *
   * @example
   * <LatexBlock formula="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}" />
   *
   * @example
   * <!-- Rate equation with label -->
   * <LatexBlock
   *   formula="\text{rate} = k[\text{A}]^m[\text{B}]^n"
   *   label="General rate equation"
   *   number={1}
   * />
   */
import { type RenderOptions } from './renderer.js';
interface Props extends RenderOptions {
    formula: string;
    label?: string;
    number?: string | number;
    class?: string;
}
declare const LatexBlock: import("svelte").Component<Props, {}, "">;
type LatexBlock = ReturnType<typeof LatexBlock>;
export default LatexBlock;
