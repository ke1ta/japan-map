import { defineConfig } from 'vite'

export default defineConfig({
  base: '/japan-map/',
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})