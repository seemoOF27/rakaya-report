import { Link } from 'react-router-dom'
import { useCms } from '../store/CmsContext'

// شريط تنقّل بين السنوات (يظهر فقط عند وجود أكثر من سنة)
export default function YearSwitcher({ className = '' }) {
  const { yearKeys, years, displayYear, activeYear } = useCms()
  if (yearKeys.length <= 1) return null

  return (
    <div className={`year-switcher ${className}`}>
      {yearKeys.map((k) => (
        <Link
          key={k}
          to={k === activeYear ? '/' : `/years/${k}`}
          className={`year-pill ${k === displayYear ? 'is-active' : ''}`}
        >
          {years[k].label}
        </Link>
      ))}
    </div>
  )
}
