import { useCms } from '../store/CmsContext'
import Icon from './Icon'
import Gallery from './Gallery'

export default function ChallengesGallery() {
  const { displayData: activeData } = useCms()
  const CHALLENGES = activeData.challenges || []
  const GALLERY = activeData.gallery || []

  // صور الأحداث (المفعّلة للمعرض) تُضاف تلقائيًا للمعرض
  const eventImages = (activeData.events || [])
    .filter((e) => e.inGallery !== false)
    .flatMap((e) =>
      (e.images || []).map((src, i) => ({ id: `ev-${e.id}-${i}`, image: src, caption: e.title }))
    )
  const galleryItems = [...GALLERY, ...eventImages]

  if (!CHALLENGES.length && !galleryItems.length) return null

  const layouts = activeData.layouts || {}
  const chLayout = layouts.challenges || 'grid'
  const glLayout = layouts.gallery || 'grid'

  return (
    <section id="challenges" className="section">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-eyebrow">التحديات</span>
          <h2 className="section-title">تحديات الموسم ومعالجتها</h2>
          <p className="section-subtitle">
            أبرز التحديات التي واجهت الفريق والإجراءات المتخذة للتعامل معها.
          </p>
          <div className="gold-bar" />
        </div>

        {CHALLENGES.length > 0 && (
          <div className="challenges__grid" data-layout={chLayout}>
            {CHALLENGES.map((c) => (
              <article key={c.id} className="challenge reveal">
                <div className="challenge__icon">
                  <Icon name="alert" size={22} />
                </div>
                <h3 className="challenge__title">{c.title}</h3>
                <p className="challenge__text">{c.text}</p>
              </article>
            ))}
          </div>
        )}

        {galleryItems.length > 0 && (
          <>
            <div className="gallery__head reveal">
              <h3 className="gallery__title">معرض الصور</h3>
              <span className="gallery__sub">لقطات من الموسم</span>
            </div>

            <Gallery items={galleryItems} layout={glLayout} />
          </>
        )}
      </div>
    </section>
  )
}
