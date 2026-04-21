<script lang="ts">
  /**
   * LatexMath — renders an inline LaTeX math expression.
   *
   * @example
   * <p>Energy: <LatexMath formula="E = mc^2" /></p>
   * <p>Equilibrium: <LatexMath formula="K_{eq} = \frac{[\text{products}]}{[\text{reactants}]}" /></p>
   */
  import { renderLatex, type RenderOptions } from './renderer.js';

  interface Props extends RenderOptions {
    formula: string;
    class?: string;
  }

  let { formula, class: className = '', ...options }: Props = $props();

  let result = $derived(
    renderLatex(formula, {
      ...options,
      displayMode: options.displayMode ?? false,
      errorMode: options.errorMode ?? 'text',
    })
  );
</script>

<span
  class="latex-math {className}"
  class:latex-error={!result.isValid}
  role="math"
  aria-label={formula}
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html result.html}
</span>

<style>
  .latex-math {
    display: inline;
  }
</style>
