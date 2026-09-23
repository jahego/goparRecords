import type { SiteContent } from '../types'

type ServicesProps = {
  services: SiteContent['services']
  lead?: boolean
}

export function Services({ services, lead = false }: ServicesProps) {
  return (
    <section id="servicios" className={lead ? 'services services-lead' : 'services'}>
      <div className="wrap">
        <p className="eyebrow">{services.eyebrow}</p>
        <h2 className="display section-title">{services.title}</h2>
        <div className="service-grid">
          {services.items.map((item, index) => (
            <article className="service" key={item.title}>
              <p className="service-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="display service-title">{item.title}</h3>
              <p className="service-copy">{item.description}</p>
              <p className="service-tags">{item.tags.join(' · ')}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
