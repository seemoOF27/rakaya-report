import { ORG } from '../data'
import { useCms } from '../store/CmsContext'
import Icon from './Icon'

export default function Hero() {
  const { displayData: activeData } = useCms()
  const meta = activeData.meta

  return (
    <section id="intro" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__glow hero__glow--1" />
        <span className="hero__glow hero__glow--2" />
      </div>
      <span className="hero-pattern" aria-hidden="true" />

      <div className="container hero__inner">
        <img className="hero__logo" src="/rakaya-logo-white.png" alt={ORG} />
        {meta.season && <span className="hero__badge">{meta.season}</span>}
        <h1 className="hero__title">
          {meta.title}
          <span className="hero__title-org">{ORG}</span>
        </h1>
        {meta.intro && <p className="hero__intro">{meta.intro}</p>}

        <div className="hero__actions">
          <a href="#timeline" className="btn btn--gold">
            استعراض الأحداث
            <Icon name="arrow" size={18} style={{ transform: 'scaleX(-1)' }} />
          </a>
          <a
            href="#team"
            className="btn btn--ghost"
            style={{ background: 'rgba(255,255,255,.08)', color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}
          >
            تعرّف على الفريق
          </a>
        </div>
      </div>

      <a className="hero__scroll" href="#team" aria-label="مرّر للأسفل" />

      <div className="hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,64 C320,120 520,8 760,40 C1000,72 1200,120 1440,72 L1440,120 L0,120 Z" fill="var(--bg)" />
        </svg>
      </div>
    </section>
  )
}
