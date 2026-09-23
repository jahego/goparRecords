import type { SiteContent } from '../types'
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from './site'

function escapeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.replace(/^\//, '')}`
}

export function buildJsonLd(content: SiteContent): Record<string, unknown> {
  const [streetAddress, locality = 'Madrid'] = content.site.address.split(',').map((part) => part.trim())

  return {
    '@context': 'https://schema.org',
    '@type': ['MusicGroup', 'LocalBusiness'],
    name: content.site.name,
    url: SITE_URL,
    email: content.site.email,
    telephone: content.site.phone,
    foundingDate: '2009',
    image: absoluteUrl(content.hero.image),
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: locality,
      addressCountry: 'ES',
    },
    makesOffer: content.services.items.map((item) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: item.title,
      },
    })),
  }
}

export function jsonLdScript(content: SiteContent): string {
  return `<script type="application/ld+json">${escapeJson(buildJsonLd(content))}</script>`
}

export function seoHead(content: SiteContent): string {
  const image = absoluteUrl(content.hero.image)
  const preload = `${import.meta.env.BASE_URL}${content.hero.image.replace(/^\//, '')}`

  return [
    `<title>${SITE_TITLE}</title>`,
    `<meta name="description" content="${SITE_DESCRIPTION}" />`,
    `<link rel="canonical" href="${SITE_URL}" />`,
    `<link rel="preload" as="image" href="${preload}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="es_ES" />`,
    `<meta property="og:site_name" content="${content.site.name}" />`,
    `<meta property="og:title" content="${SITE_TITLE}" />`,
    `<meta property="og:description" content="${SITE_DESCRIPTION}" />`,
    `<meta property="og:url" content="${SITE_URL}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="2400" />`,
    `<meta property="og:image:height" content="1600" />`,
    `<meta property="og:image:alt" content="${content.site.name}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${SITE_TITLE}" />`,
    `<meta name="twitter:description" content="${SITE_DESCRIPTION}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    jsonLdScript(content),
  ].join('\n    ')
}
