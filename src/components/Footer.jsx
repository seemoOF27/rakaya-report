import { Link } from 'react-router-dom'
import { ORG } from '../data'
import { useCms } from '../store/CmsContext'

export default function Footer() {
  const { displayData: activeData } = useCms()
  const meta = activeData.meta

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo" role="img" aria-label={ORG} />
        </div>
        <p className="footer__copy">
          {meta.title} — {meta.season} · جميع الحقوق محفوظة
        </p>
        {/* <Link to="/admin" className="footer__admin">
          لوحة التحكم
        </Link> */}
      </div>
    </footer>
  )
}
