import { useEffect } from 'react'
import Icon from './Icon'

// عارض صور منبثق (بوب أب) قابل لإعادة الاستخدام
// images: مصفوفة روابط صور أو كائنات { image, caption }
export default function ImageViewer({ images = [], index, onClose, onIndex }) {
  const count = images.length
  const current = index != null && index >= 0 ? images[index] : null

  useEffect(() => {
    if (current == null) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (count > 1) {
        if (e.key === 'ArrowLeft') onIndex((index + 1) % count)
        if (e.key === 'ArrowRight') onIndex((index - 1 + count) % count)
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, count, current, onClose, onIndex])

  if (current == null) return null

  const src = typeof current === 'string' ? current : current.image
  const caption = typeof current === 'string' ? '' : current.caption
  const prev = () => onIndex((index - 1 + count) % count)
  const next = () => onIndex((index + 1) % count)

  return (
    <div className="viewer" onClick={onClose}>
      <button className="viewer__close" onClick={onClose} aria-label="إغلاق">
        <Icon name="close" size={22} />
      </button>

      {count > 1 && (
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
        <img src={src} alt={caption || 'صورة'} className="viewer__img" />
        {caption && <figcaption className="viewer__caption">{caption}</figcaption>}
      </figure>

      {count > 1 && (
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

      {count > 1 && (
        <span className="viewer__count">
          {index + 1} / {count}
        </span>
      )}
    </div>
  )
}
