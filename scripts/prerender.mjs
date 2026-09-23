import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distIndex = resolve(root, 'dist/index.html')
const contentPath = resolve(root, 'public/content.json')

const content = JSON.parse(await readFile(contentPath, 'utf8'))
const vite = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
  const { jsonLdScript } = await vite.ssrLoadModule('/src/lib/seo.ts')
  const { html } = render(content)
  let document = await readFile(distIndex, 'utf8')
  const payload = JSON.stringify(content).replace(/</g, '\\u003c')

  document = document.replace('</head>', `    ${jsonLdScript(content)}\n  </head>`)
  document = document.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>\n    <script type="application/json" id="site-content">${payload}</script>`,
  )

  await writeFile(distIndex, document)
} finally {
  await vite.close()
}
