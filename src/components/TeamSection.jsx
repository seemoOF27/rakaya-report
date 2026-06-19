import { useState } from 'react'
import { WORK_TYPES } from '../data'
import { useCms } from '../store/CmsContext'

function initials(name) {
  const parts = (name || '').trim().split(/\s+/)
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

export default function TeamSection() {
  const { displayData: activeData } = useCms()
  const TEAM = activeData.team || []
  const [filter, setFilter] = useState('all')

  if (!TEAM.length) return null

  const filtered = filter === 'all' ? TEAM : TEAM.filter((m) => m.type === filter)
  const layout = (activeData.layouts || {}).team || 'grid'

  return (
    <section id="team" className="section">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-eyebrow">شركاء النجاح</span>
          <h2 className="section-title">أعضاء الفريق التقني</h2>
          <p className="section-subtitle">
            الفريق الذي عمل خلال الموسم — مصنّفًا حسب نوع التعاقد.
          </p>
          <div className="gold-bar" />
        </div>

        <div className="team__filters reveal">
          <button
            className={`chip ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            الكل ({TEAM.length})
          </button>
          {Object.entries(WORK_TYPES).map(([key, t]) => (
            <button
              key={key}
              className={`chip ${filter === key ? 'is-active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {t.label} ({TEAM.filter((m) => m.type === key).length})
            </button>
          ))}
        </div>

        <div className="team__grid" data-layout={layout}>
          {filtered.map((m) => {
            const t = WORK_TYPES[m.type] || WORK_TYPES.full
            return (
              <article key={m.id} className="member reveal">
                <div
                  className="member__avatar"
                  style={m.photo ? undefined : { background: `linear-gradient(135deg, ${t.color}, var(--brand-darker))` }}
                >
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} loading="lazy" />
                  ) : m.emoji ? (
                    <span className="member__emoji">{m.emoji}</span>
                  ) : (
                    initials(m.name)
                  )}
                </div>
                <h3 className="member__name">م. {m.name}</h3>
                <p className="member__role">{m.role}</p>
                <div className="member__meta">
                  {m.dept && <span className="member__dept">{m.dept}</span>}
                  <span className="badge" style={{ color: t.color, background: t.bg }}>
                    {t.label}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
