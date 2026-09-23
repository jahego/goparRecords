import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import { readInlineContent } from './lib/content'
import './styles/global.css'

const root = document.getElementById('root')
if (!root) {
  throw new Error('root')
}

const app = (
  <StrictMode>
    <App initialContent={readInlineContent()} />
  </StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
