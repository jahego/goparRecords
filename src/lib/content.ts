import type { SectionKey, SiteContent } from '../types'

export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const normalized = path.replace(/^\//, '')
  return `${base}${normalized}`
}

export async function loadContent(): Promise<SiteContent> {
  const response = await fetch(`${import.meta.env.BASE_URL}content.json`)
  if (!response.ok) {
    throw new Error('content')
  }
  return response.json() as Promise<SiteContent>
}

export function hasSection(content: SiteContent, section: SectionKey | undefined): boolean {
  if (section === 'portfolio') return content.portfolio.projects.length > 0
  if (section === 'training') return content.training.testimonials.length > 0
  if (section === 'services') return content.services.items.length > 0
  if (section === 'team') return content.team.members.length > 0
  return true
}
