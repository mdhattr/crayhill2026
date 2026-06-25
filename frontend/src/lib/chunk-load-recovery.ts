const RELOAD_FLAG = 'crayhill-chunk-reload'

/**
 * After a deploy, browsers may still hold an old main bundle that references
 * hashed chunks that no longer exist. Vite fires `vite:preloadError` when a
 * lazy route chunk 404s; reload once to pick up the fresh index.html + assets.
 */
export function initChunkLoadRecovery(): void {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()

    if (sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.removeItem(RELOAD_FLAG)
      return
    }

    sessionStorage.setItem(RELOAD_FLAG, '1')
    window.location.reload()
  })
}
