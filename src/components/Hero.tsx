import type { CSSProperties } from 'react'
import { assetUrl } from '../lib/content'
import type { SiteContent } from '../types'

type HeroProps = {
  hero: SiteContent['hero']
}

export function Hero({ hero }: HeroProps) {
  return (
    <section
      id="estudio"
      className="hero"
      style={{ '--hero-image': `url("${assetUrl(hero.image)}")` } as CSSProperties}
    >
      <div className="wrap hero-copy">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 className="display hero-title">
          <span>{hero.title}</span>
          <span className="accent italic">{hero.titleAccent}</span>
        </h1>
        <p className="hero-body">{hero.body}</p>
        <a className="more" href={`#${hero.ctaTarget}`}>
          {hero.cta}
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </a>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span className="scroll-word">{hero.scrollLabel}</span>
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>
    </section>
  )
}
