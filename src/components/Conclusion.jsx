import { useCms } from '../store/CmsContext'
import Icon from './Icon'

export default function Conclusion() {
  const { displayData: activeData } = useCms()
  const c = activeData.conclusion || {}
  if (!c.title && !c.text) return null

  return (
    <section id="conclusion" className="section section-conclusion">
      <div className="container">
        <div className="conclusion__card reveal">
          <div className="conclusion__icon">
            <Icon name="check" size={30} />
          </div>
          <span className="section-eyebrow" style={{ color: '#fff', background: 'rgba(255,255,255,.14)' }}>
            الخاتمة
          </span>
          {c.title && <h2 className="conclusion__title">{c.title}</h2>}
          {c.text && <p className="conclusion__text">{c.text}</p>}
          {c.sign && <p className="conclusion__sign">{c.sign}</p>}
        </div>
      </div>
    </section>
  )
}
