import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173, strictPort: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/test/**'],
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcovonly'],
    },
  },
});
