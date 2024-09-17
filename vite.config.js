import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer',  // Polyfill Buffer for browser environments
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  define: {
    global: 'globalThis',  // Polyfill global with globalThis
  },
});