import { resolve } from 'path';
import dynamicImport from 'vite-plugin-dynamic-import';

import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), dynamicImport({
      filter(id) {
        return !/\/src\/main\.tsx$/.test(id);
      },
    }),
  ],
  build: {
    emptyOutDir: true,
    outDir: '../server/public',
    rollupOptions: {
      output: {
        manualChunks: (id: string, e) => {
          console.log(id);
          if (id.includes('node_modules')) {
            const folders = id.split('node_modules/')?.[1]?.split('/');
            if (folders){
              return folders[0];
            }
            return 'vendor';
          }
        },
      },
    },
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
      '@common': resolve(__dirname, 'src'),
      '@admin': resolve(__dirname, 'admin'),
      '@home': resolve(__dirname, 'home'),
    },
  },
  optimizeDeps: {
    exclude: ['eslint-plugin-import'],
  },
});
