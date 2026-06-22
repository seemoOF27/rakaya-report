import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

function itemStyle(g) {
  return g.image
    ? { backgroundImage: `url(${g.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(150deg, ${g.color || 'var(--brand)'}, var(--brand-darker))` }
}

function Figure({ g, className = '', onOpen }) {
  return (
    <figure
      className={`gallery__item ${className}`}
      style={itemStyle(g)}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen?.()}
    >
      <span className="gallery__zoom" aria-hidden="true">
        <Icon name="eye" size={18} />
      </span>
      {g.caption && <figcaption>{g.caption}</figcaption>}
    </figure>
  )
}

export default function Gallery({ items, layout = 'carousel' }) {
  const [open, setOpen] = useState(false) // نافذة "كل الصور"
  const [active, setActive] = useState(null) // فهرس الصورة المفتوحة بالحجم الكامل
  const [canScroll, setCanScroll] = useState(false)
  const trackRef = useRef(null)

  const close = () => setActive(null)
  const next = () => setActive((a) => (a + 1) % items.length)
  const prev = () => setActive((a) => (a - 1 + items.length) % items.length)

  // قفل التمرير + اختصارات الكيبورد عند فتح أي نافذة
  useEffect(() => {
    const anyOpen = open || active !== null
    if (!anyOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setActive(null)
        setOpen(false)
      } else if (active !== null && items.length > 1) {
        if (e.key === 'ArrowLeft') next()
        if (e.key === 'ArrowRight') prev()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, active, items.length])

  // إظهار الأسهم فقط عند الحاجة (الصور أكثر من عرض الشاشة)
  useEffect(() => {
    const el = trackRef.current
    if (layout !== 'carousel' || !el) {
      setCanScroll(false)
      return
    }
    const check = () => setCanScroll(el.scrollWidth > el.clientWidth + 8)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [layout, items.length])

  if (!items.length) return null

  const scroll = (dir) => trackRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  const isCarousel = layout === 'carousel'
  const current = active !== null ? items[active] : null

  return (
    <div className="reveal">
      {isCarousel ? (
        <div className="carousel">
          {canScroll && (
            <button className="carousel__nav carousel__nav--prev" onClick={() => scroll(-1)} aria-label="السابق">
              <Icon name="arrow" size={20} />
            </button>
          )}
          <div className="carousel__track" ref={trackRef}>
            {items.map((g, i) => (
              <Figure key={g.id} g={g} className="carousel__item" onOpen={() => setActive(i)} />
            ))}
          </div>
          {canScroll && (
            <button className="carousel__nav carousel__nav--next" onClick={() => scroll(1)} aria-label="التالي">
              <Icon name="arrow" size={20} style={{ transform: 'scaleX(-1)' }} />
            </button>
          )}
        </div>
      ) : (
        <div className="gallery__grid" data-layout={layout}>
          {items.map((g, i) => (
            <Figure key={g.id} g={g} onOpen={() => setActive(i)} />
          ))}
        </div>
      )}

      <div className="gallery__more">
        <button className="btn btn--ghost" onClick={() => setOpen(true)}>
          مشاهدة المزيد ({items.length})
        </button>
      </div>

      {open && (
        <div className="lightbox" onClick={() => setOpen(false)}>
          <div className="lightbox__panel" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox__head">
              <h3>معرض الصور ({items.length})</h3>
              <button className="lightbox__close" onClick={() => setOpen(false)} aria-label="إغلاق">
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="lightbox__grid">
              {items.map((g, i) => (
                <Figure key={g.id} g={g} onOpen={() => setActive(i)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {current && (
        <div className="viewer" onClick={close}>
          <button className="viewer__close" onClick={close} aria-label="إغلاق">
            <Icon name="close" size={22} />
          </button>

          {items.length > 1 && (
            <button
              className="viewer__nav viewer__nav--prev"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="السابق"
            >
              <Icon name="arrow" size={24} />
            </button>
          )}

          <figure className="viewer__stage" onClick={(e) => e.stopPropagation()}>
            {current.image ? (
              <img src={current.image} alt={current.caption || 'صورة'} className="viewer__img" />
            ) : (
              <div className="viewer__placeholder" style={itemStyle(current)} />
            )}
            {current.caption && <figcaption className="viewer__caption">{current.caption}</figcaption>}
          </figure>

          {items.length > 1 && (
            <button
              className="viewer__nav viewer__nav--next"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="التالي"
            >
              <Icon name="arrow" size={24} style={{ transform: 'scaleX(-1)' }} />
            </button>
          )}

          {items.length > 1 && (
            <span className="viewer__count">
              {active + 1} / {items.length}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
