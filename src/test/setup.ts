import '@testing-library/svelte/vitest';

// KaTeX works in jsdom but needs the mhchem extension to load cleanly.
// We mock the mhchem import since it depends on KaTeX's internal module system.
