import { defineConfig } from 'vite'
import { svelte }       from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  // Ensure the client-side Svelte runtime is used when mounting components in tests
  resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
  test: {
    globals:     true,
    environment: 'jsdom',
    setupFiles:  ['src/test/setup.ts'],
  },
})
