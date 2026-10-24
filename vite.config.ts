import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts')) {
            return 'recharts';
          }
          if (id.includes('node_modules/pdfjs-dist')) {
            return 'pdfjs';
          }
          if (id.includes('node_modules/mammoth')) {
            return 'mammoth';
          }
        }
      }
    }
  }
})
