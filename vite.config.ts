import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],


  define: {
    // Define global for browser compatibility
    global: 'globalThis',
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'buffer'],
    esbuildOptions: {
      target: 'esnext',
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    }
  },

  build: {
    target: 'esnext',

    // Minifikacja z usunięciem console.log
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },

    // CSS optimization
    cssCodeSplit: true,
    cssMinify: true,

    // Wyłącz sourcemaps w produkcji (mniejszy bundle)
    sourcemap: false,

    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },


    // Warning gdy chunk > 1MB
    chunkSizeWarningLimit: 1000,


  }
})