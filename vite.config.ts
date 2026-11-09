import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/graphite/',
  plugins: [react()],
  build: { outDir: 'dist', assetsDir: '' }
})