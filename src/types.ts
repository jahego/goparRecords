export type SectionKey = 'portfolio' | 'training' | 'services' | 'team'

export type NavItem = {
  id: string
  label: string
  section?: SectionKey
}

export type SpotifyTrack = {
  title: string
  artist: string
  cover: string
  url: string
}

export type Project = {
  genre: string
  title: string
  artist: string
  spotify: SpotifyTrack
}

export type Course = {
  id: string
  label: string
}

export type Testimonial = {
  quote: string
  name: string
  courseId: string
  stars: number
}

export type Service = {
  title: string
  description: string
  tags: string[]
}

export type TeamMember = {
  role: string
  name: string
  bio: string
  image: string
}

export type SiteContent = {
  site: {
    name: string
    email: string
    phone: string
    address: string
    web3formsAccessKey: string
  }
  nav: NavItem[]
  hero: {
    image: string
    eyebrow: string
    title: string
    titleAccent: string
    body: string
    cta: string
    ctaTarget: string
    scrollLabel: string
  }
  portfolio: {
    eyebrow: string
    title: string
    intro: string
    projects: Project[]
  }
  training: {
    eyebrow: string
    title: string
    titleAccent: string
    intro: string
    empty: string
    courses: Course[]
    testimonials: Testimonial[]
  }
  cta: {
    label: string
    target: string
  }
  services: {
    eyebrow: string
    title: string
    items: Service[]
  }
  team: {
    eyebrow: string
    title: string
    members: TeamMember[]
  }
  contact: {
    eyebrow: string
    title: string
    titleAccent: string
    intro: string
    emailLabel: string
    phoneLabel: string
    addressLabel: string
    nameLabel: string
    namePlaceholder: string
    emailFieldLabel: string
    emailPlaceholder: string
    serviceLabel: string
    servicePlaceholder: string
    projectLabel: string
    projectPlaceholder: string
    submit: string
    sending: string
    success: string
    error: string
    missingKey: string
    required: string
    invalidEmail: string
  }
  footer: {
    rights: string
  }
}
