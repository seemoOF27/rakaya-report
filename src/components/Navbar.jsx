import { useEffect, useState } from 'react'
import { ORG } from '../data'
import ThemeToggle from './ThemeToggle'
import YearSwitcher from './YearSwitcher'

const LINKS = [
  { href: '#intro', label: 'المقدمة' },
  { href: '#team', label: 'الفريق' },
  { href: '#stats', label: 'الإحصائيات' },
  { href: '#timeline', label: 'الأحداث' },
  { href: '#challenges', label: 'التحديات' },
  { href: '#recommendations', label: 'التوصيات' },
  { href: '#conclusion', label: 'الخاتمة' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#intro')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scrollspy: تحديد القسم الظاهر حاليًا
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean)
    if (!sections.length || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#intro" className="nav__brand" aria-label={ORG}>
          <span className="nav__logo-mark" role="img" aria-label={ORG} />
          <span className="nav__brand-text">{ORG}</span>
        </a>

        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? 'is-active' : ''}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <YearSwitcher className="nav__years" />
        <ThemeToggle className="nav__theme" />

        <button
          className="nav__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
