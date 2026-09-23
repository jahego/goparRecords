import { useEffect, useState } from 'react'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Portfolio } from './components/Portfolio'
import { Services } from './components/Services'
import { Team } from './components/Team'
import { Training } from './components/Training'
import { hasSection, loadContent, readInlineContent } from './lib/content'
import type { SiteContent } from './types'

type AppProps = {
  initialContent?: SiteContent | null
}

export default function App({ initialContent = null }: AppProps) {
  const [content, setContent] = useState<SiteContent | null>(
    () => initialContent ?? readInlineContent(),
  )
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (content) return
    loadContent()
      .then(setContent)
      .catch(() => setFailed(true))
  }, [content])

  if (!content) {
    return (
      <div className="boot">
        <p>{failed ? 'No se pudo cargar el contenido.' : 'Gopar Records'}</p>
      </div>
    )
  }

  const showPortfolio = hasSection(content, 'portfolio')
  const showTraining = hasSection(content, 'training')
  const showServices = hasSection(content, 'services')
  const showTeam = hasSection(content, 'team')

  return (
    <>
      <Header content={content} />
      <main>
        <Hero hero={content.hero} />
        {showPortfolio && <Portfolio portfolio={content.portfolio} />}
        {(showTraining || showServices) && (
          <div className="band">
            {showTraining && <Training training={content.training} />}
            {showTraining && (
              <div className="wrap cta-band">
                <a className="line-link" href={`#${content.cta.target}`}>
                  {content.cta.label}
                </a>
              </div>
            )}
            {showServices && <Services services={content.services} lead={!showTraining} />}
          </div>
        )}
        {showTeam && <Team team={content.team} />}
        <Contact site={content.site} contact={content.contact} services={content.services.items} />
      </main>
      <Footer siteName={content.site.name} rights={content.footer.rights} />
    </>
  )
}
