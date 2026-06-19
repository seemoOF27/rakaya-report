import { useCms } from '../store/CmsContext'
import Icon from './Icon'

export default function Testimonials() {
  const { displayData: activeData } = useCms()
  const items = (activeData.testimonials || []).filter((t) => !t.hidden)
  if (!items.length) return null

  return (
    <section id="testimonials" className="section section--alt">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-eyebrow">آراء المستخدمين</span>
          <h2 className="section-title">كلمات شكر للفريق التقني</h2>
          <p className="section-subtitle">
            رسائل وتعليقات من مستخدمي التطبيق خلال الموسم.
          </p>
          <div className="gold-bar" />
        </div>

        <div className="reviews__grid">
          {items.map((t) => (
            <figure key={t.id} className="review reveal">
              <span className="review__quote-mark" aria-hidden="true">”</span>
              <blockquote className="review__text">{t.quote}</blockquote>
              {t.author && (
                <figcaption className="review__author">
                  <span className="review__avatar"><Icon name="users" size={16} /></span>
                  {t.author}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
