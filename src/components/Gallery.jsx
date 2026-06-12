import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

function itemStyle(g) {
  return g.image
    ? { backgroundImage: `url(${g.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(150deg, ${g.color || 'var(--brand)'}, var(--brand-darker))` }
}

function Figure({ g, className = '' }) {
  return (
    <figure className={`gallery__item ${className}`} style={itemStyle(g)}>
      {g.caption && <figcaption>{g.caption}</figcaption>}
    </figure>
  )
}

export default function Gallery({ items, layout = 'carousel' }) {
  const [open, setOpen] = useState(false)
  const [canScroll, setCanScroll] = useState(false)
  const trackRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

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
            {items.map((g) => (
              <Figure key={g.id} g={g} className="carousel__item" />
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
          {items.map((g) => (
            <Figure key={g.id} g={g} />
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
              {items.map((g) => (
                <Figure key={g.id} g={g} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
