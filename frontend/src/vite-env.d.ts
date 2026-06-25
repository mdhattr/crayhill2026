/// <reference types="vite/client" />

// Public, build-time Vite vars. Anything VITE_-prefixed ships to the browser,
// so this must never hold a secret (see .cursor/rules/40-workflow.mdc).
interface ImportMetaEnv {
  /** Base URL the SPA uses to reach the PHP API. Defaults to "/api/v1". */
  readonly VITE_API_BASE_URL?: string
}
