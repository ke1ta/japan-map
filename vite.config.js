import { defineConfig } from 'vite'

export default defineConfig({
  root: './src',
  base: '/japan-map/',
  build: {
    outDir: '../docs',
  }
})