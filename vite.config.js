import { defineConfig } from 'vite'

export default defineConfig({
  base: '/japan-map/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})