
import react from '@vitejs/plugin-react-swc';
import {resolve} from 'path';
import {visualizer} from 'rollup-plugin-visualizer';
import {defineConfig} from 'vite';
import {chunkSplitPlugin} from 'vite-plugin-chunk-split';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {BasicConfig} from './src/basic.config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rewrite-dev-server',
      configureServer: (server) => {
        server.middlewares.use((req, res, next) => {
          if (
            req.url?.startsWith(`/${BasicConfig.adminFolder}/`)
            && !/\.(.*)$/.test(req.url)
          ) {
            req.url = '/admin.html?';
          }
          next();
        });
      },
    },
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: 'report.html', //分析图生成的文件名
      open: true, //如果存在本地服务端口，将在打包后自动展示
    }),
    chunkSplitPlugin({
      strategy: 'single-vendor',
      useEntryName: true,
    }),
  ],
  build: {
    emptyOutDir: true,
    outDir: '../server/public',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
      output: {},
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
      },
      '/app': {
        target: 'http://127.0.0.1:8787',
      },
      '/upload': {
        target: 'http://127.0.0.1:8787',
      },
    },
  },
  resolve: {
    alias: {
      '#admin': resolve(__dirname, 'admin'),
      '#home': resolve(__dirname, 'home'),
      '@basic': resolve(__dirname, 'src/basic'),
      '@admin': resolve(__dirname, 'src/admin'),
      '@home': resolve(__dirname, 'src/home'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  optimizeDeps: {
    exclude: ['eslint-plugin-import'],
  },
});
