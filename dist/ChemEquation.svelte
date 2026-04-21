<script lang="ts">
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
  import { renderChem, type RenderOptions } from './renderer.js';

  interface Props extends RenderOptions {
    /** Chemistry formula in mhchem \ce{} notation (without the \ce{} wrapper) */
    formula: string;
    /** Extra CSS classes on the wrapper span */
    class?: string;
  }

  let { formula, class: className = '', ...options }: Props = $props();

  let result = $derived(
    renderChem(formula, {
      ...options,
      displayMode: false,
      errorMode: options.errorMode ?? 'text',
    })
  );
</script>

<!--
  Renders inline — wraps in a <span> so it flows within prose text.
  KaTeX CSS must be loaded separately — import 'katex-svelte/styles' in your app.
-->
<span
  class="chem-equation {className}"
  class:chem-error={!result.isValid}
  aria-label={formula}
  role="math"
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html result.html}
</span>

<style>
  .chem-equation {
    display: inline;
  }

  .chem-error :global(.katex-error) {
    color: #dc2626;
    font-family: monospace;
    font-size: 0.875em;
  }
</style>
