import { resolve } from 'path';
import dynamicImport from 'vite-plugin-dynamic-import';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dynamicImport()],
  build: {
    outDir: '../server/public',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
      },
      '/app': {
        target: 'http://localhost:8787',
      },
    },
  },
  resolve: {
    alias: {
      '@common': resolve(__dirname, 'src/common'),
      '@admin': resolve(__dirname, 'admin'),
      '@home': resolve(__dirname, 'home'),
    },
  },
  optimizeDeps: {
    exclude: ['eslint-plugin-import'],
  },
});
