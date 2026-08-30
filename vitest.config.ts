import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [react() as any],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: [
      { find: /^@\/sanity\/(.*)/, replacement: path.resolve(__dirname, './sanity/$1') },
      { find: /^@\/(.*)/, replacement: path.resolve(__dirname, './src/$1') },
    ],
  },
});
