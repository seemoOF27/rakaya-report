import { useCms } from '../store/CmsContext'
import Icon from './Icon'

export default function Recommendations() {
  const { displayData: activeData } = useCms()
  const RECOMMENDATIONS = activeData.recommendations || []
  if (!RECOMMENDATIONS.length) return null

  const layout = (activeData.layouts || {}).recommendations || 'cards'

  return (
    <section id="recommendations" className="section section--alt">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-eyebrow">نحو موسم أفضل</span>
          <h2 className="section-title">التوصيات والاقتراحات</h2>
          <p className="section-subtitle">
            مقترحات عملية مبنية على نتائج الموسم لرفع الجاهزية وتحسين الأداء مستقبلًا.
          </p>
          <div className="gold-bar" />
        </div>

        <div className="recs__grid" data-layout={layout}>
          {RECOMMENDATIONS.map((r, i) => (
            <article key={r.id} className="rec reveal">
              <div className="rec__num">{String(i + 1).padStart(2, '0')}</div>
              <div className="rec__body">
                <div className="rec__head">
                  <Icon name="bulb" size={20} />
                  <h3 className="rec__title">{r.title}</h3>
                </div>
                <p className="rec__text">{r.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
