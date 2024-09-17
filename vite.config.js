import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url'; // Use URL and fileURLToPath

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Polyfill Buffer
      buffer: fileURLToPath(new URL('./node_modules/buffer/', import.meta.url)),
    },
  },
  define: {
    // Make global Buffer available
    'global.Buffer': 'buffer.Buffer',
  },
});
