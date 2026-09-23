import { renderToString } from 'react-dom/server'
import App from './App'
import { seoHead } from './lib/seo'
import type { SiteContent } from './types'

export function render(content: SiteContent): { html: string; head: string } {
  return {
    html: renderToString(<App initialContent={content} />),
    head: seoHead(content),
  }
}
