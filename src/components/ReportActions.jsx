import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { ORG } from '../data'
import { useCms } from '../store/CmsContext'
import Icon from './Icon'

// أزرار عائمة: تحميل التقرير PDF + رمز QR يودّي لهذه الصفحة
export default function ReportActions() {
  const { displayData: activeData } = useCms()
  const [qr, setQr] = useState('')
  const [open, setOpen] = useState(false)

  const url =
    typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : ''

  useEffect(() => {
    if (!url) return
    QRCode.toDataURL(url, {
      margin: 1,
      width: 280,
      color: { dark: '#033a40', light: '#ffffff' },
    })
      .then(setQr)
      .catch(() => {})
  }, [url])

  const title = activeData?.meta?.title || 'تقرير الحج'

  return (
    <>
      <div className="report-actions">
        {open && qr && (
          <div className="ra-qr">
            <button className="ra-qr__close" onClick={() => setOpen(false)} aria-label="إغلاق">
              <Icon name="close" size={16} />
            </button>
            <img src={qr} alt="QR" />
            <span className="ra-qr__hint">امسح الكود للوصول إلى التقرير</span>
            <code className="ra-qr__url">{url}</code>
          </div>
        )}
        <button className="ra-btn" onClick={() => setOpen((v) => !v)} title="مشاركة عبر QR">
          <Icon name="qr" size={20} />
        </button>
        <button className="ra-btn ra-btn--gold" onClick={() => window.print()} title="تحميل PDF">
          <Icon name="download" size={20} />
          <span className="ra-btn__label">تحميل PDF</span>
        </button>
      </div>

      {/* كتلة تظهر فقط داخل ملف الـ PDF */}
      {qr && (
        <div className="print-qr">
          <img src={qr} alt="QR" />
          <div className="print-qr__text">
            <strong>{title} — {ORG}</strong>
            <span>امسح الكود للوصول إلى نسخة الويب من التقرير</span>
            <code>{url}</code>
          </div>
        </div>
      )}
    </>
  )
}
