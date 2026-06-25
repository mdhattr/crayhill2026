import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Static brand assets (logos, icons, images) live at the repo root in
  // `assets/`, NOT under `frontend/`, because they are content shared between
  // the SPA and the (future) PHP-side admin dashboard for image management.
  // Vite serves this folder at root URLs in dev (e.g. `/images/foo.jpg`) and
  // copies it verbatim into `dist/` at build, with no hashing or transform.
  // See INSTALL.md → "Static assets" for the full convention.
  publicDir: fileURLToPath(new URL('../assets', import.meta.url)),
  server: {
    // Dev-only: forward the SPA's `/api/v1/<name>` calls to the local PHP
    // server, rewriting the clean URL to the on-disk file it serves. Run the
    // API with:  php -S localhost:8000 -t api   (from the repo root).
    // In production Apache serves `/api/v1/<name>` -> api/v1/<name>.php on the
    // same origin, so no proxy is involved there (see INSTALL.md).
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1\/([^/?]+)/, '/v1/$1.php'),
      },
    },
  },
})
