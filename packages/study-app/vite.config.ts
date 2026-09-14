import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Dev-only: serve the private BBZ solution tree at <base>bbz/*. The Live BBZ
// page fetches index.json plus solution files lazily from here. Not part of
// the production build — the data is licensed and huge (1.5 GB).
const bbzDir = path.resolve(dirname, '../../straddle-solutions/bbz')
const bbzPrefix = '/straddle/bbz/'
function bbzData(): Plugin {
  return {
    name: 'bbz-data',
    apply: 'serve',
    configureServer(server) {
      // Exact base-prefixed route only — never a loose substring match:
      // the repo path itself contains "/bbz/", which would hijack the /@fs/
      // module URLs vite serves for the design-system workspace.
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith(bbzPrefix)) return next()
        const rel = decodeURIComponent(req.url.slice(bbzPrefix.length).split('?')[0])
        const file = path.normalize(path.join(bbzDir, rel))
        if (!file.startsWith(bbzDir) || !fs.existsSync(file)) {
          res.statusCode = 404
          res.end('not found')
          return
        }
        res.setHeader('Content-Type', 'application/json')
        fs.createReadStream(file).pipe(res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), bbzData()],
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
