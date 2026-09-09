import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/straddle/',
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
      '@poker/design-system/src': path.resolve(dirname, '../design-system/src'),
    },
  },
  build: {
    outDir: 'dist',
  },
})
