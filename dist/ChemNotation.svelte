<script lang="ts">
  /**
   * ChemNotation — renders a labelled chemistry notation reference card.
   * Useful in lessons to show a formula with its name and description.
   *
   * @example
   * <ChemNotation
   *   formula="H2SO4"
   *   name="Sulfuric acid"
   *   desc="Strong diprotic acid"
   * />
   *
   * @example
   * <ChemNotation
   *   formula="Fe2O3 + 3CO -> 2Fe + 3CO2"
   *   name="Reduction of iron(III) oxide"
   *   desc="Used in blast furnace iron extraction"
   *   type="reaction"
   * />
   */
  import { renderChem } from './renderer.js';
  import ChemEquation from './ChemEquation.svelte';

  interface Props {
    formula: string;
    name?: string;
    desc?: string;
    type?: 'formula' | 'reaction' | 'equilibrium' | 'ionic';
    class?: string;
  }

  let { formula, name, desc, type = 'formula', class: className = '' }: Props = $props();

  const typeColors: Record<string, string> = {
    formula: '#2563eb',
    reaction: '#059669',
    equilibrium: '#d97706',
    ionic: '#7c3aed',
  };

  const typeLabels: Record<string, string> = {
    formula: 'Formula',
    reaction: 'Reaction',
    equilibrium: 'Equilibrium',
    ionic: 'Ionic equation',
  };

  let color = $derived(typeColors[type] ?? typeColors.formula);
  let label = $derived(typeLabels[type] ?? type);
</script>

<div class="chem-notation {className}" style="--accent:{color}">
  <div class="chem-notation__type">{label}</div>

  <div class="chem-notation__formula">
    <ChemEquation {formula} />
  </div>

  {#if name}
    <div class="chem-notation__name">{name}</div>
  {/if}

  {#if desc}
    <p class="chem-notation__desc">{desc}</p>
  {/if}
</div>

<style>
  .chem-notation {
    border: 1px solid #e2e8f0;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
    padding: 14px 18px;
    margin: 12px 0;
    background: #f8fafc;
  }

  .chem-notation__type {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 8px;
    opacity: 0.8;
  }

  .chem-notation__formula {
    font-size: 1.15em;
    margin-bottom: 8px;
  }

  .chem-notation__name {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 4px;
  }

  .chem-notation__desc {
    font-size: 13px;
    color: #64748b;
    line-height: 1.55;
    margin: 0;
  }
</style>
