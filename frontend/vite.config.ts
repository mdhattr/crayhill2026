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
})
