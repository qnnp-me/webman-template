import { resolve } from 'path';
import dynamicImport from 'vite-plugin-dynamic-import';

import { defineConfig } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    chunkSplitPlugin(),
  ],
  build: {
    emptyOutDir: true,
    outDir: '../server/public',
    rollupOptions: {
      output: {},
    },
  },
  server: {
    host: '0.0.0.0',
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
      '@common': resolve(__dirname, 'src'),
      '@admin': resolve(__dirname, 'admin'),
      '@home': resolve(__dirname, 'home'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  optimizeDeps: {
    exclude: ['eslint-plugin-import'],
  },
});
