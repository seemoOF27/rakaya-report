import { useCms } from '../store/CmsContext'
import VideoEmbed from './VideoEmbed'

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date)) return d
  return date.toLocaleDateString('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function sortByDate(list) {
  return [...list].sort((a, b) => new Date(a.date) - new Date(b.date))
}

export default function Timeline() {
  const { displayData: activeData } = useCms()
  const events = (activeData.events || []).filter((e) => !e.hidden)
  if (!events.length) return null

  const sorted = sortByDate(events)
  const layout = (activeData.layouts || {}).timeline || 'vertical'

  return (
    <section id="timeline" className="section section--alt">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-eyebrow">المسار الزمني</span>
          <h2 className="section-title">أحداث الموسم</h2>
          <p className="section-subtitle">تسلسل زمني لأبرز ما جرى خلال الموسم.</p>
          <div className="gold-bar" />
        </div>

        <div className="timeline-scroll">
        <div className="timeline" data-layout={layout}>
          {sorted.map((ev, i) => (
            <div key={ev.id || i} className="tl-item reveal" style={{ '--i': i % 2 }}>
              <div className="tl-item__dot">
                <span>{i + 1}</span>
              </div>
              <div className="tl-item__card">
                {ev.date && <span className="tl-item__date">{formatDate(ev.date)}</span>}
                {ev.title && <h3 className="tl-item__title">{ev.title}</h3>}
                {ev.description && <p className="tl-item__desc">{ev.description}</p>}
                {ev.video && <VideoEmbed url={ev.video} />}
                {ev.images?.length > 0 && (
                  <div className="tl-item__images">
                    {ev.images.map((src, idx) => (
                      <a key={idx} href={src} target="_blank" rel="noreferrer">
                        <img src={src} alt={ev.title} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
