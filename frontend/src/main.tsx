import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'

// Body font (Montserrat) is self-hosted via @fontsource. Each entry below
// declares @font-face per Unicode subset with unicode-range, so browsers
// only download the slices actually used on the page. Add weights/styles
// deliberately — every import is bytes shipped.
//
// Display font (New Science) is loaded separately via Adobe Fonts / Typekit,
// referenced from the <link> tag in index.html. See INSTALL.md → "Typography
// / Fonts" for the rationale (Montserrat = open-source, ships fine via npm;
// New Science = commercially licensed, only legitimate channel is Typekit).
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/400-italic.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/600-italic.css'

import '@/styles/global.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
