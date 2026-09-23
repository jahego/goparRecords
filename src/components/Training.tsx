import { useState } from 'react'
import type { SiteContent } from '../types'

const PAGE_SIZE = 6

type TrainingProps = {
  training: SiteContent['training']
}

export function Training({ training }: TrainingProps) {
  const [courseId, setCourseId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const labels = new Map(training.courses.map((course) => [course.id, course.label]))
  const visible = training.testimonials.filter((item) => courseId === null || item.courseId === courseId)
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const pageIndex = Math.min(page, pageCount - 1)
  const pageItems = visible.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE)

  return (
    <section id="formate" className="training">
      <div className="wrap">
        <div className="training-head">
          <p className="eyebrow">{training.eyebrow}</p>
          <h2 className="display section-title training-title">
            <span className="accent italic">{training.title}</span> {training.titleAccent}
          </h2>
          <p className="center-copy">{training.intro}</p>
        </div>
        {training.courses.length > 0 && (
          <div className="pills" role="group" aria-label="Filtrar por curso">
            {training.courses.map((course) => (
              <button
                key={course.id}
                type="button"
                className={courseId === course.id ? 'pill is-active' : 'pill'}
                aria-pressed={courseId === course.id}
                onClick={() => {
                  setCourseId((current) => (current === course.id ? null : course.id))
                  setPage(0)
                }}
              >
                {course.label}
              </button>
            ))}
          </div>
        )}
        {visible.length === 0 ? (
          <p className="empty">{training.empty}</p>
        ) : (
          <>
            <div className="review-grid" key={pageIndex}>
              {pageItems.map((item, index) => (
                <article className="review" key={`${pageIndex}-${index}-${item.name}`}>
                  <p className="stars" aria-label={`${item.stars} de 5`}>
                    {'★'.repeat(item.stars)}
                  </p>
                  <blockquote>{item.quote}</blockquote>
                  <hr className="review-rule" />
                  <p className="review-name">{item.name}</p>
                  <p className="review-course">{labels.get(item.courseId) ?? item.courseId}</p>
                </article>
              ))}
            </div>
            {pageCount > 1 && (
              <div className="review-pager" role="navigation" aria-label="Más testimonios">
                <button
                  type="button"
                  className="review-page"
                  disabled={pageIndex === 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                >
                  Anterior
                </button>
                <p className="review-page-label">
                  {pageIndex + 1} / {pageCount}
                </p>
                <button
                  type="button"
                  className="review-page"
                  disabled={pageIndex >= pageCount - 1}
                  onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
