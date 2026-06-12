import { useEffect, useState } from 'react'
import Icon from './Icon'

const KEY = 'rakaya_theme'

export function getInitialTheme() {
  try {
    return localStorage.getItem(KEY) || 'light'
  } catch (e) {
    return 'light'
  }
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

// زر التبديل بين النمط الفاتح والليلي
export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(KEY, theme)
    } catch (e) {
      /* ignore */
    }
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggle}
      aria-label={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الليلي'}
      title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الليلي'}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
    </button>
  )
}
