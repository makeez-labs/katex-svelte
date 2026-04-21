<script lang="ts">
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
  import { renderChemBlock, type RenderOptions } from './renderer.js';

  interface Props extends RenderOptions {
    formula: string;
    /** Optional label shown below the equation */
    label?: string;
    /** Optional equation number shown on the right */
    number?: string | number;
    /** Extra CSS classes */
    class?: string;
  }

  let { formula, label, number: eqNumber, class: className = '', ...options }: Props = $props();

  let result = $derived(
    renderChemBlock(formula, {
      ...options,
      errorMode: options.errorMode ?? 'text',
    })
  );
</script>

<div
  class="chem-block {className}"
  class:chem-block--error={!result.isValid}
  role="math"
  aria-label={formula}
>
  <div class="chem-block__equation">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html result.html}

    {#if eqNumber !== undefined}
      <span class="chem-block__number">({eqNumber})</span>
    {/if}
  </div>

  {#if label}
    <p class="chem-block__label">{label}</p>
  {/if}
</div>

<style>
  .chem-block {
    margin: 1.25em 0;
    text-align: center;
    position: relative;
  }

  .chem-block__equation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    overflow-x: auto;
    padding: 4px 0;
  }

  .chem-block__number {
    font-size: 0.9em;
    color: currentColor;
    opacity: 0.55;
    white-space: nowrap;
    font-family: serif;
  }

  .chem-block__label {
    margin-top: 6px;
    font-size: 0.8em;
    color: currentColor;
    opacity: 0.6;
    font-style: italic;
    text-align: center;
  }
</style>
