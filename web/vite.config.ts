import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import dynamicImport from "vite-plugin-dynamic-import";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dynamicImport()],
  build: {
    outDir: '../server/public',
    emptyOutDir: true,
  },
})
