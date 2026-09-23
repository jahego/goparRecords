import { useId, useState, type FormEvent } from 'react'
import type { SiteContent } from '../types'

type ContactProps = {
  site: SiteContent['site']
  contact: SiteContent['contact']
  services: SiteContent['services']['items']
}

const PLACEHOLDER_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

function isConfigured(key: string): boolean {
  const value = key.trim()
  return value.length > 0 && value !== PLACEHOLDER_KEY
}

export function Contact({ site, contact, services }: ContactProps) {
  const nameId = useId()
  const emailId = useId()
  const serviceId = useId()
  const projectId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')
  const [project, setProject] = useState('')
  const [botcheck, setBotcheck] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [banner, setBanner] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = contact.required
    if (!email.trim()) next.email = contact.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = contact.invalidEmail
    if (services.length > 0 && !service) next.service = contact.required
    if (!project.trim()) next.project = contact.required
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBanner('')
    if (!validate()) {
      setStatus('idle')
      return
    }
    if (botcheck.trim()) {
      setStatus('success')
      return
    }
    if (!isConfigured(site.web3formsAccessKey)) {
      setBanner(contact.missingKey)
      setStatus('error')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: site.web3formsAccessKey.trim(),
          name: name.trim(),
          email: email.trim(),
          subject: `Proyecto Gopar Records — ${service || 'Consulta'}`,
          message: project.trim(),
          servicio: service,
          from_name: name.trim(),
          botcheck,
        }),
      })
      const data = (await response.json()) as { success?: boolean }
      if (!response.ok || !data.success) {
        setBanner(contact.error)
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setBanner(contact.error)
      setStatus('error')
    }
  }

  return (
    <section id="contacto" className="contact">
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2 className="display contact-title">
            <span>{contact.title}</span>
            <span className="accent italic">{contact.titleAccent}</span>
          </h2>
          <p className="contact-intro">{contact.intro}</p>
          <dl className="details">
            <div className="detail">
              <dt>{contact.emailLabel}</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div className="detail">
              <dt>{contact.phoneLabel}</dt>
              <dd>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
              </dd>
            </div>
            <div className="detail">
              <dt>{contact.addressLabel}</dt>
              <dd>{site.address}</dd>
            </div>
          </dl>
        </div>
        {status === 'success' ? (
          <p className="form-success" role="status">
            {contact.success}
          </p>
        ) : (
          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="hp" aria-hidden="true">
              <label>
                No rellenar
                <input
                  type="text"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botcheck}
                  onChange={(event) => setBotcheck(event.target.value)}
                />
              </label>
            </div>
            <div className="field">
              <label htmlFor={nameId}>{contact.nameLabel}</label>
              <input
                id={nameId}
                name="name"
                autoComplete="name"
                placeholder={contact.namePlaceholder}
                value={name}
                aria-invalid={errors.name ? true : undefined}
                onChange={(event) => setName(event.target.value)}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>
            <div className="field">
              <label htmlFor={emailId}>{contact.emailFieldLabel}</label>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                placeholder={contact.emailPlaceholder}
                value={email}
                aria-invalid={errors.email ? true : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>
            {services.length > 0 && (
              <div className="field">
                <label htmlFor={serviceId}>{contact.serviceLabel}</label>
                <select
                  id={serviceId}
                  name="servicio"
                  value={service}
                  required
                  aria-invalid={errors.service ? true : undefined}
                  onChange={(event) => setService(event.target.value)}
                >
                  <option value="" disabled>
                    {contact.servicePlaceholder}
                  </option>
                  {services.map((item) => (
                    <option key={item.title} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="field-error">{errors.service}</p>}
              </div>
            )}
            <div className="field">
              <label htmlFor={projectId}>{contact.projectLabel}</label>
              <textarea
                id={projectId}
                name="message"
                rows={3}
                placeholder={contact.projectPlaceholder}
                value={project}
                aria-invalid={errors.project ? true : undefined}
                onChange={(event) => setProject(event.target.value)}
              />
              {errors.project && <p className="field-error">{errors.project}</p>}
            </div>
            {banner && (
              <p className="form-banner" role="alert">
                {banner}
              </p>
            )}
            <button className="line-link submit" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? contact.sending : contact.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
