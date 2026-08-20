import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.indexOf('node_modules/react/') !== -1 || id.indexOf('node_modules/react-dom/') !== -1) {
            return 'vendor-react'
          }
          if (id.indexOf('node_modules/canvas-confetti') !== -1 || id.indexOf('node_modules/lucide-react') !== -1) {
            return 'vendor-ui'
          }
        }
      }
    }
  }
})
