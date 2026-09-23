import type { SiteContent } from '../types'
import { Logo } from './Logo'

type FooterProps = {
  siteName: string
  rights: SiteContent['footer']['rights']
}

export function Footer({ siteName, rights }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="wrap footer-bar">
        <a href="#estudio">
          <Logo name={siteName} />
        </a>
        <p>
          © {year} · {rights}
        </p>
      </div>
    </footer>
  )
}
