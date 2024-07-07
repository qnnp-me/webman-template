import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    chunkSplitPlugin({
      strategy: 'unbundle',
      useEntryName: true,
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: 'test.html', //分析图生成的文件名
      open: true, //如果存在本地服务端口，将在打包后自动展示
    }),
  ],
  build: {
    emptyOutDir: true,
    outDir: '../server/public',
    rollupOptions: {
      output: {
        manualChunks: (id, meta) => {
          // if (id.includes('home/pages')) {
          //   const key = id.replace(/.*home\/pages\/([^/]+).*/, '$1');
          //   return `home-pages-${key}`;
          // }
          // if (id.includes('antd/es/result/')) {
          //   const info = meta.getModuleInfo(id);
          //   console.log(info);
          //   console.log(info?.isIncluded);
          // }
          // if (id.includes('dayjs')){
          //   return 'dayjs';
          // }
          // if (id.includes('lodash')){
          //   return 'lodash';
          // }
          // if (/@ant-design\/icons-svg\/es\/asn\/[A-Z][a-zA-Z0-9]+/.test(id)) {
          //   return 'antd-icon';
          //   // const key = id.replace(/.*@ant-design\/icons-svg\/es\/asn\/([A-Z][a-zA-Z0-9]+).*/, '$1');
          //   // return `antd-icon-${key}`;
          // }
          // if (/@ant-design\/[^/]+/.test(id)){
          //   return 'ant-design';
          //   // const key = id.replace(/.*@ant-design\/([^/]+).*/, '$1');
          //   // return `antd-pro-${key}`;
          // }
          // console.log(id);
          // if (id.includes('node_modules')) {
          //   return 'vendor';
          // }
        },
      },
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
      '/upload': {
        target: 'http://localhost:8787',
      },
    },
  },
  resolve: {
    alias: {
      '@root': resolve(__dirname),
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
