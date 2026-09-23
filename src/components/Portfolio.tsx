import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Project, SiteContent } from '../types'
import { assetUrl } from '../lib/content'

type PortfolioProps = {
  portfolio: SiteContent['portfolio']
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}

function listenHref(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return parsed.href
  } catch {
    return null
  }
}

type ListenControlProps = {
  href: string | null
  className: string
  announced: boolean
  label: string
  children: ReactNode
}

function ListenControl({ href, className, announced, label, children }: ListenControlProps) {
  if (!href) {
    return (
      <span className={className} aria-hidden="true">
        {children}
      </span>
    )
  }

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={announced ? undefined : -1}
      aria-label={label}
    >
      {children}
    </a>
  )
}

function TrackList({
  projects,
  onClose,
}: {
  projects: Project[]
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="track-list-backdrop" onClick={onClose}>
      <div
        className="track-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="track-list-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="track-window-bar">
          <h3 id="track-list-title">Canciones</h3>
          <button
            ref={closeRef}
            type="button"
            className="track-window-close"
            aria-label="Cerrar lista"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="track-table">
          <div className="track-row track-head">
            <span />
            <span>Título</span>
            <span>Artista</span>
            <span className="track-genre">Género</span>
            <span />
          </div>
          {projects.map((project, index) => {
            const href = listenHref(project.spotify.url)
            const label = `Escuchar ${project.title}`
            return (
              <div className="track-row" key={index}>
                <img src={assetUrl(project.spotify.cover)} alt="" />
                <span className="track-title">{project.title}</span>
                <span className="track-artist">{project.artist}</span>
                <span className="track-genre">{project.genre}</span>
                <ListenControl href={href} className="track-play" announced label={label}>
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path d="M9 7.2v9.6l8.2-4.8L9 7.2z" fill="currentColor" />
                  </svg>
                </ListenControl>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function isPauseTarget(node: EventTarget | null): boolean {
  return node instanceof Element && Boolean(node.closest('.sleeve, .project-meta'))
}

function ProjectCard({
  project,
  announced,
  index,
  count,
}: {
  project: Project
  announced: boolean
  index: number
  count: number
}) {
  const href = listenHref(project.spotify.url)
  const label = `Escuchar ${project.title}`
  const cover = assetUrl(project.spotify.cover)

  return (
    <article
      className="project"
      style={{ '--i': index, '--count': count } as CSSProperties}
      aria-hidden={announced ? undefined : true}
    >
      <div className="sleeve">
        <img className="sleeve-art" src={cover} alt="" />
        <div className="vinyl">
          <ListenControl href={href} className="vinyl-play" announced={announced} label={label}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M9 7.2v9.6l8.2-4.8L9 7.2z" fill="currentColor" />
            </svg>
          </ListenControl>
        </div>
      </div>
      <div className="sleeve-reflect" aria-hidden="true">
        <img src={cover} alt="" />
      </div>
    </article>
  )
}

function captionOpacity(width: number, height: number): number {
  if (height <= 0) return 0
  const facing = Math.min(width / height, 1)
  return Math.max(0, (facing - 0.48) / 0.52)
}

const RING_SLOTS = 8
const RING_SECONDS = 40
const STEP = 360 / RING_SLOTS

function initialSlotIds(count: number): number[] {
  if (count === 0) return []
  return Array.from({ length: RING_SLOTS }, (_, slot) => slot % count)
}

function wrapIndex(index: number, count: number): number {
  return ((index % count) + count) % count
}

function normalize180(degrees: number): number {
  const wrapped = ((degrees % 360) + 360) % 360
  return wrapped > 180 ? wrapped - 360 : wrapped
}

export function Portfolio({ portfolio }: PortfolioProps) {
  const reduced = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const captionsRef = useRef<HTMLDivElement>(null)
  const listButtonRef = useRef<HTMLButtonElement>(null)
  const angleRef = useRef(0)
  const pausedRef = useRef(false)
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const lapsRef = useRef<number[]>(Array.from({ length: RING_SLOTS }, () => 0))
  const worldRef = useRef<number[]>(Array.from({ length: RING_SLOTS }, (_, slot) => normalize180(slot * STEP)))
  const [listOpen, setListOpen] = useState(false)
  const projects = portfolio.projects
  const [slotIds, setSlotIds] = useState(() => initialSlotIds(projects.length))

  const closeList = useCallback(() => {
    setListOpen(false)
    listButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    angleRef.current = 0
    lapsRef.current = Array.from({ length: RING_SLOTS }, () => 0)
    worldRef.current = Array.from({ length: RING_SLOTS }, (_, slot) => normalize180(slot * STEP))
    setSlotIds(initialSlotIds(projects.length))
  }, [projects])

  const total = projects.length === 0 ? 0 : RING_SLOTS

  useEffect(() => {
    const stage = stageRef.current
    const ring = ringRef.current
    const layer = captionsRef.current
    const count = projects.length
    if (!stage || !ring || !layer || total === 0 || count === 0) return
    const cards = [...ring.querySelectorAll<HTMLElement>('.project')]
    const captions = [...layer.querySelectorAll<HTMLElement>('.project-meta')]
    const applyCaptions = () => {
      const stageBox = stage.getBoundingClientRect()
      const depths = cards.map((card) => card.querySelector('.sleeve-art')?.getBoundingClientRect().height ?? 0)
      const nearest = [...depths.keys()].sort((a, b) => depths[b] - depths[a]).slice(0, 3)
      cards.forEach((card, index) => {
        const caption = captions[index]
        const art = card.querySelector('.sleeve-art')
        const reflect = card.querySelector('.sleeve-reflect')
        if (!caption || !art) return
        const box = art.getBoundingClientRect()
        const floor = reflect?.getBoundingClientRect().bottom ?? box.bottom
        const fullyInside = box.left >= stageBox.left - 1 && box.right <= stageBox.right + 1
        const opacity =
          nearest.includes(index) && fullyInside ? captionOpacity(box.width, box.height) : 0
        caption.style.left = `${box.left + box.width / 2 - stageBox.left}px`
        caption.style.top = `${floor - stageBox.top + 10}px`
        caption.style.width = `${Math.max(box.width, 96)}px`
        caption.style.opacity = opacity.toFixed(3)
        caption.style.pointerEvents = opacity < 0.28 ? 'none' : ''
      })
    }
    const applyAngle = (delta: number) => {
      const pointer = pointerRef.current
      if (pausedRef.current && pointer) {
        pausedRef.current = isPauseTarget(document.elementFromPoint(pointer.x, pointer.y))
      }
      if (!reduced && !pausedRef.current) {
        angleRef.current -= (360 / RING_SECONDS) * delta
      }
      ring.style.transform = `rotateY(${angleRef.current}deg)`
    }
    const applySlots = () => {
      if (reduced) return
      let changed = false
      const next = Array.from({ length: RING_SLOTS }, (_, slot) => {
        const world = normalize180(angleRef.current + slot * STEP)
        const prev = worldRef.current[slot]
        worldRef.current[slot] = world
        if (prev < -90 && world > 90) {
          lapsRef.current[slot] += 1
          changed = true
        }
        return wrapIndex(slot + lapsRef.current[slot] * RING_SLOTS, count)
      })
      if (changed) setSlotIds(next)
    }
    applyAngle(0)
    applyCaptions()
    if (reduced) {
      window.addEventListener('resize', applyCaptions)
      return () => window.removeEventListener('resize', applyCaptions)
    }
    const onPointer = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      pausedRef.current = isPauseTarget(document.elementFromPoint(event.clientX, event.clientY))
    }
    window.addEventListener('pointermove', onPointer)
    window.addEventListener('pointerdown', onPointer)
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      applyAngle(Math.min((now - last) / 1000, 0.05))
      applyCaptions()
      applySlots()
      last = now
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [reduced, total, projects])

  return (
    <section id="portfolio" className="portfolio">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">{portfolio.eyebrow}</p>
            <h2 className="display section-title">{portfolio.title}</h2>
          </div>
          <p className="lede">{portfolio.intro}</p>
        </div>
        <hr className="rule" />
      </div>
      <div
        ref={stageRef}
        className={reduced ? 'ring-stage is-static' : 'ring-stage'}
        role="region"
        aria-label={portfolio.title}
      >
        <div className="ring" ref={ringRef}>
          {slotIds.map((projectIndex, index) => {
            const project = projects[projectIndex]
            if (!project) return null
            return (
              <ProjectCard
                key={index}
                project={project}
                announced
                index={index}
                count={total}
              />
            )
          })}
        </div>
        <div className="ring-captions" ref={captionsRef}>
          {slotIds.map((projectIndex, index) => {
            const project = projects[projectIndex]
            if (!project) return null
            const href = listenHref(project.spotify.url)
            const label = `Escuchar ${project.title}`
            return (
              <div className="project-meta" key={index}>
                <h3 className="display project-title">{project.title}</h3>
                <ListenControl href={href} className="listen" announced label={label}>
                  Escuchar
                  <span className="listen-arrow" aria-hidden="true">
                    →
                  </span>
                </ListenControl>
              </div>
            )
          })}
        </div>
      </div>
      <div className="wrap">
        <button
          ref={listButtonRef}
          type="button"
          className="track-list-open"
          onClick={() => setListOpen(true)}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M4 6.5h16M4 12h16M4 17.5h10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
          Ver lista
        </button>
      </div>
      {listOpen && <TrackList projects={projects} onClose={closeList} />}
    </section>
  )
}
