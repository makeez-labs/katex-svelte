<script lang="ts">
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
  import { renderAuto, type AutoRenderOptions } from './renderer.js';

  interface Props extends AutoRenderOptions {
    /** Text containing embedded \ce{}, $...$, $$...$$ expressions */
    text: string;
    /** HTML tag to wrap the output (default: 'p') */
    tag?: string;
    class?: string;
  }

  let { text, tag = 'p', class: className = '', ...options }: Props = $props();

  let rendered = $derived(renderAuto(text, options));
</script>

<!--
  Uses dynamic tag — <p> for paragraphs, <span> for inline, <div> for blocks.
  Output is trusted HTML from KaTeX — it is safe as long as the input is
  not from untrusted user content. Set trust={false} (the default) to restrict
  potentially dangerous commands.
-->
<svelte:element this={tag} class="chem-auto {className}" role="presentation">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html rendered}
</svelte:element>

<style>
  .chem-auto {
    line-height: 1.7;
  }

  /* Ensure block equations within prose are properly spaced */
  .chem-auto :global(.katex-display) {
    margin: 1em 0;
  }
</style>
