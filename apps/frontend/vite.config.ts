import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@dentalhub/core': path.resolve(__dirname, '../../packages/core/dist'),
      '@dentalhub/components': path.resolve(__dirname, '../../packages/components/dist'),
      '@dentalhub/utils': path.resolve(__dirname, '../../packages/utils/dist'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', '@dentalhub/core']
  }
});
