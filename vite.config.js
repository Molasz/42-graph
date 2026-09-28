import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/42-graph/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) {
            return 'three';
          }
          if (id.includes('node_modules/@react-three/')) {
            return 'react-three';
          }
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/lucide-react/') ||
            id.includes('node_modules/@tweenjs/tween.js/')
          ) {
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
