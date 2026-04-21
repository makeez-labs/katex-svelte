<script lang="ts">
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
  import { renderLatexBlock, type RenderOptions } from './renderer.js';

  interface Props extends RenderOptions {
    formula: string;
    label?: string;
    number?: string | number;
    class?: string;
  }

  let { formula, label, number: eqNumber, class: className = '', ...options }: Props = $props();

  let result = $derived(
    renderLatexBlock(formula, {
      ...options,
      errorMode: options.errorMode ?? 'text',
    })
  );
</script>

<div
  class="latex-block {className}"
  class:latex-block--error={!result.isValid}
  role="math"
  aria-label={formula}
>
  <div class="latex-block__inner">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html result.html}

    {#if eqNumber !== undefined}
      <span class="latex-block__number">({eqNumber})</span>
    {/if}
  </div>

  {#if label}
    <p class="latex-block__label">{label}</p>
  {/if}
</div>

<style>
  .latex-block {
    margin: 1.25em 0;
    text-align: center;
  }

  .latex-block__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    overflow-x: auto;
    padding: 4px 0;
  }

  .latex-block__number {
    font-size: 0.9em;
    opacity: 0.55;
    white-space: nowrap;
    font-family: serif;
  }

  .latex-block__label {
    margin-top: 6px;
    font-size: 0.8em;
    opacity: 0.6;
    font-style: italic;
    text-align: center;
  }
</style>
