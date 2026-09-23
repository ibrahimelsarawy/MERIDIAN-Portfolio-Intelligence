import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text','json','html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.{ts,tsx}','src/**/*.test.{ts,tsx}','src/widgets/widgets.test.tsx'],
    },
  },
  esbuild: { jsx: 'automatic' },
});
