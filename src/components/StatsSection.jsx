import { useEffect, useRef, useState } from 'react'
import { useCms } from '../store/CmsContext'
import Icon from './Icon'
import SectionPattern from './SectionPattern'

function useCountUp(target, run) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf
    const dur = 1400
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run])
  return val
}

function StatCard({ stat, run }) {
  const val = useCountUp(stat.value, run)
  return (
    <div className="stat reveal">
      <div className="stat__icon">
        <Icon name={stat.icon} size={26} />
      </div>
      <div className="stat__value">
        {val.toLocaleString('en-US')}
        <span className="stat__suffix">{stat.suffix}</span>
      </div>
      <div className="stat__label">{stat.label}</div>
    </div>
  )
}

export default function StatsSection() {
  const { displayData: activeData } = useCms()
  const STATS = activeData.stats || []
  const ref = useRef(null)
  const [run, setRun] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (!STATS.length) return null

  const layout = (activeData.layouts || {}).stats || 'cards'

  return (
    <section id="stats" className="section section-stats" ref={ref}>
      <SectionPattern name="rakaya" />
      <div className="container">
        <div className="section-head reveal">
          <span className="section-eyebrow" style={{ color: '#fff', background: 'rgba(255,255,255,.14)' }}>
            بالأرقام
          </span>
          <h2 className="section-title" style={{ color: '#fff' }}>إحصائيات الموسم</h2>
          <div className="gold-bar" />
        </div>

        <div className="stats__grid" data-layout={layout}>
          {STATS.map((s) => (
            <StatCard key={s.id} stat={s} run={run} />
          ))}
        </div>
      </div>
    </section>
  )
}
