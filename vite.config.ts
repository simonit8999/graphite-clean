import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/graphite-clean/',
  plugins: [react()],
  build: { outDir: 'dist', assetsDir: '' }
})