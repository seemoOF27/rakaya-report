import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ORG, WORK_TYPES, LAYOUTS, LAYOUT_SECTIONS, DEFAULT_LAYOUTS } from '../data'
import { useCms } from '../store/CmsContext'
import { parseEventsFromExcel, downloadTemplate } from '../utils/excel'
import Icon from '../components/Icon'
import Loader from '../components/Loader'

const genId = () => `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`

const ICON_OPTIONS = ['users', 'calendar', 'flag', 'star', 'check', 'bulb', 'alert', 'download']

const TABS = [
  { key: 'meta', label: 'المعلومات العامة' },
  { key: 'team', label: 'الفريق' },
  { key: 'stats', label: 'الإحصائيات' },
  { key: 'events', label: 'الأحداث' },
  { key: 'challenges', label: 'التحديات' },
  { key: 'gallery', label: 'المعرض' },
  { key: 'recommendations', label: 'التوصيات' },
  { key: 'layouts', label: 'العرض والتخطيط' },
]

function fileToDataUrl(file) {
  return new Promise((res) => {
    const reader = new FileReader()
    reader.onload = () => res(reader.result)
    reader.readAsDataURL(file)
  })
}

/* ============ البوابة: تحميل / تسجيل دخول / المحرر ============ */
export default function AdminPage() {
  const { loading, isAuthed } = useCms()
  if (loading) return <Loader />
  if (!isAuthed) return <Login />
  return <AdminApp />
}

/* ============ تسجيل الدخول ============ */
function Login() {
  const { login } = useCms()
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const r = await login(password)
    setBusy(false)
    if (!r.ok) setErr(r.error)
  }

  return (
    <div className="login" data-theme="light">
      <form className="login__card" onSubmit={submit}>
        <img className="login__logo" src={`${import.meta.env.BASE_URL}rakaya-logo-black.png`} alt={ORG} />
        <h1 className="login__title">لوحة التحكم</h1>
        <p className="login__sub">سجّل الدخول لإدارة محتوى التقرير</p>
        <label className="fld">
          <span>كلمة المرور</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
          />
        </label>
        {err && <div className="login__err">{err}</div>}
        <button type="submit" className="btn btn--primary" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
          {busy ? 'جارٍ الدخول…' : 'دخول'}
        </button>
        <Link to="/" className="login__back">العودة للتقرير</Link>
      </form>
    </div>
  )
}

/* ============ المحرر ============ */
function AdminApp() {
  const cms = useCms()
  const { years, yearKeys, activeYear, setActiveYear, addYear, deleteYear, renameYear, patchYear, resetAll, logout } = cms

  const [editingYear, setEditingYear] = useState(activeYear)
  const [tab, setTab] = useState('meta')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!years[editingYear]) setEditingYear(yearKeys[0])
  }, [years, editingYear, yearKeys])

  const data = years[editingYear]

  const flash = (text) => {
    setToast(text)
    setTimeout(() => setToast(null), 2600)
  }

  // ---- مساعدات تعديل القوائم ----
  const setList = (key, arr) => patchYear(editingYear, { [key]: arr })
  const updateItem = (key, idx, field, value) => {
    const arr = data[key].map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    setList(key, arr)
  }
  const addItem = (key, template) => setList(key, [...data[key], { ...template, id: genId() }])
  const removeItem = (key, idx) => setList(key, data[key].filter((_, i) => i !== idx))
  const moveItem = (key, idx, dir) => {
    const arr = [...data[key]]
    const j = idx + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[idx], arr[j]] = [arr[j], arr[idx]]
    setList(key, arr)
  }

  const updateMeta = (field, value) =>
    patchYear(editingYear, { meta: { ...data.meta, [field]: value } })
  const updateConclusion = (field, value) =>
    patchYear(editingYear, { conclusion: { ...data.conclusion, [field]: value } })
  const setLayout = (section, value) =>
    patchYear(editingYear, { layouts: { ...(data.layouts || {}), [section]: value } })

  if (!data) return <Loader />

  return (
    <div className="admin" data-theme="light">
      <header className="admin__topbar">
        <div className="admin__topbar-inner">
          <div className="admin__brand">
            <img src={`${import.meta.env.BASE_URL}rakaya-logo-white.png`} alt={ORG} />
            <div>
              <strong>لوحة التحكم</strong>
              <span>إدارة محتوى تقرير الحج</span>
            </div>
          </div>
          <div className="admin__topbar-actions">
            <Link to="/" className="btn btn--ghost btn--sm">عرض التقرير</Link>
            <button className="btn btn--ghost btn--sm" onClick={logout}>تسجيل الخروج</button>
          </div>
        </div>
      </header>

      <div className="admin__body container">
        <YearManager
          years={years}
          yearKeys={yearKeys}
          activeYear={activeYear}
          editingYear={editingYear}
          setEditingYear={setEditingYear}
          setActiveYear={async (y) => {
            try { await setActiveYear(y); flash('تم تعيين السنة النشطة') } catch (e) { flash(e.message) }
          }}
          addYear={async (k, l, copy) => {
            try { await addYear(k, l, copy); setEditingYear(String(k)); flash('تمت إضافة السنة') } catch (e) { flash(e.message) }
          }}
          deleteYear={async (y) => {
            try { await deleteYear(y); flash('تم حذف السنة') } catch (e) { flash(e.message) }
          }}
          renameYear={renameYear}
          patchYear={patchYear}
        />

        <div className="admin__tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin__tab ${tab === t.key ? 'is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="admin__panel">
          {tab === 'meta' && <MetaEditor data={data} updateMeta={updateMeta} updateConclusion={updateConclusion} />}
          {tab === 'team' && <TeamEditor data={data} updateItem={updateItem} addItem={addItem} removeItem={removeItem} moveItem={moveItem} />}
          {tab === 'stats' && <StatsEditor data={data} updateItem={updateItem} addItem={addItem} removeItem={removeItem} moveItem={moveItem} />}
          {tab === 'events' && <EventsEditor data={data} setList={setList} updateItem={updateItem} addItem={addItem} removeItem={removeItem} moveItem={moveItem} flash={flash} />}
          {tab === 'challenges' && <ChallengesEditor data={data} updateItem={updateItem} addItem={addItem} removeItem={removeItem} moveItem={moveItem} />}
          {tab === 'gallery' && <GalleryEditor data={data} updateItem={updateItem} addItem={addItem} removeItem={removeItem} moveItem={moveItem} />}
          {tab === 'recommendations' && <RecommendationsEditor data={data} updateItem={updateItem} addItem={addItem} removeItem={removeItem} moveItem={moveItem} />}
          {tab === 'layouts' && <LayoutsEditor data={data} setLayout={setLayout} />}
        </div>

        <div className="admin__footer-note">
          <span>التعديلات تُحفظ تلقائيًا في قاعدة البيانات.</span>
          <button
            className="btn btn--ghost btn--sm"
            onClick={async () => {
              if (confirm('سيتم استرجاع البيانات الافتراضية وحذف كل التعديلات. متأكد؟')) {
                try { await resetAll(); flash('تمت إعادة التعيين') } catch (e) { flash(e.message) }
              }
            }}
          >
            إعادة تعيين كل البيانات
          </button>
        </div>
      </div>

      {toast && (
        <div className="admin__toast">
          <Icon name="check" size={18} /> {toast}
        </div>
      )}
    </div>
  )
}

/* ============ إدارة السنوات ============ */
function YearManager({ years, yearKeys, activeYear, editingYear, setEditingYear, setActiveYear, addYear, deleteYear, renameYear, patchYear }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [copyFrom, setCopyFrom] = useState('')

  const submitAdd = (e) => {
    e.preventDefault()
    const key = newKey.trim()
    if (!key) return
    if (years[key]) { alert('هذه السنة موجودة مسبقًا'); return }
    addYear(key, newLabel.trim() || key, copyFrom || undefined)
    setNewKey('')
    setNewLabel('')
    setCopyFrom('')
    setShowAdd(false)
  }

  const isActive = editingYear === activeYear

  return (
    <section className="ym">
      <div className="ym__row">
        <div className="ym__field">
          <label>السنة الجاري تحريرها</label>
          <select value={editingYear} onChange={(e) => setEditingYear(e.target.value)}>
            {yearKeys.map((k) => (
              <option key={k} value={k}>
                {years[k].label} {k === activeYear ? '• (النشطة)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="ym__field">
          <label>اسم/عنوان السنة</label>
          <input
            type="text"
            value={years[editingYear]?.label || ''}
            onChange={(e) => renameYear(editingYear, e.target.value)}
            placeholder="مثال: 1446 هـ"
          />
        </div>

        <div className="ym__field ym__field--grow">
          <label>الرابط المخصّص (slug)</label>
          <input
            type="text"
            value={years[editingYear]?.slug || ''}
            onChange={(e) =>
              patchYear(editingYear, {
                slug: e.target.value.trim().replace(/\s+/g, '-'),
              })
            }
            placeholder={editingYear}
            dir="ltr"
          />
          <span className="ym__url">
            {editingYear === activeYear
              ? `النشطة — تُفتح من /  (ورابطها أيضًا /r/${years[editingYear]?.slug || editingYear})`
              : `تُفتح من: /r/${years[editingYear]?.slug || editingYear}`}
          </span>
        </div>

        <div className="ym__actions">
          {isActive ? (
            <span className="ym__active-badge">
              <Icon name="check" size={16} /> هذه هي السنة النشطة
            </span>
          ) : (
            <button className="btn btn--primary btn--sm" onClick={() => setActiveYear(editingYear)}>
              تعيين كسنة نشطة
            </button>
          )}
          <button className="btn btn--gold btn--sm" onClick={() => setShowAdd((v) => !v)}>
            <Icon name="plus" size={16} /> سنة جديدة
          </button>
          <button
            className="btn btn--ghost btn--sm ym__del"
            disabled={yearKeys.length <= 1}
            onClick={() => {
              if (confirm(`حذف سنة "${years[editingYear].label}" وكل بياناتها؟`)) deleteYear(editingYear)
            }}
          >
            <Icon name="trash" size={16} /> حذف السنة
          </button>
        </div>
      </div>

      {showAdd && (
        <form className="ym__add" onSubmit={submitAdd}>
          <div className="ym__field">
            <label>معرّف السنة *</label>
            <input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="1447" required />
          </div>
          <div className="ym__field">
            <label>العنوان الظاهر</label>
            <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="1447 هـ" />
          </div>
          <div className="ym__field">
            <label>نسخ المحتوى من</label>
            <select value={copyFrom} onChange={(e) => setCopyFrom(e.target.value)}>
              <option value="">بدون (سنة فارغة)</option>
              {yearKeys.map((k) => (
                <option key={k} value={k}>{years[k].label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn--primary btn--sm">إضافة</button>
        </form>
      )}
    </section>
  )
}

/* ============ مكوّنات مساعدة ============ */
function Field({ label, children }) {
  return (
    <label className="fld">
      <span>{label}</span>
      {children}
    </label>
  )
}

function CardHead({ index, onUp, onDown, onRemove }) {
  return (
    <div className="ed-card__head">
      <span className="ed-card__num">{index + 1}</span>
      <div className="ed-card__tools">
        <button type="button" onClick={onUp} title="أعلى">↑</button>
        <button type="button" onClick={onDown} title="أسفل">↓</button>
        <button type="button" className="ed-card__del" onClick={onRemove} title="حذف">
          <Icon name="trash" size={15} />
        </button>
      </div>
    </div>
  )
}

function AddBtn({ onClick, label }) {
  return (
    <button type="button" className="ed-add" onClick={onClick}>
      <Icon name="plus" size={18} /> {label}
    </button>
  )
}

/* ============ المحرّرات ============ */
function MetaEditor({ data, updateMeta, updateConclusion }) {
  return (
    <div className="ed-stack">
      <h3 className="ed-title">المعلومات العامة</h3>
      <Field label="عنوان التقرير">
        <input type="text" value={data.meta.title} onChange={(e) => updateMeta('title', e.target.value)} />
      </Field>
      <Field label="الموسم / السنة (يظهر في الغلاف)">
        <input type="text" value={data.meta.season} onChange={(e) => updateMeta('season', e.target.value)} />
      </Field>
      <Field label="المقدمة">
        <textarea rows={3} value={data.meta.intro} onChange={(e) => updateMeta('intro', e.target.value)} />
      </Field>

      <h3 className="ed-title" style={{ marginTop: 18 }}>الخاتمة</h3>
      <Field label="عنوان الخاتمة">
        <input type="text" value={data.conclusion.title} onChange={(e) => updateConclusion('title', e.target.value)} />
      </Field>
      <Field label="نص الخاتمة">
        <textarea rows={4} value={data.conclusion.text} onChange={(e) => updateConclusion('text', e.target.value)} />
      </Field>
      <Field label="التوقيع">
        <input type="text" value={data.conclusion.sign} onChange={(e) => updateConclusion('sign', e.target.value)} />
      </Field>
    </div>
  )
}

function TeamEditor({ data, updateItem, addItem, removeItem, moveItem }) {
  return (
    <div className="ed-stack">
      <h3 className="ed-title">أعضاء الفريق ({data.team.length})</h3>
      <div className="ed-grid">
        {data.team.map((m, i) => (
          <div className="ed-card" key={m.id || i}>
            <CardHead index={i} onUp={() => moveItem('team', i, -1)} onDown={() => moveItem('team', i, 1)} onRemove={() => removeItem('team', i)} />
            <Field label="الاسم">
              <input type="text" value={m.name || ''} onChange={(e) => updateItem('team', i, 'name', e.target.value)} />
            </Field>
            <Field label="الدور">
              <input type="text" value={m.role || ''} onChange={(e) => updateItem('team', i, 'role', e.target.value)} />
            </Field>
            <div className="ed-row2">
              <Field label="القسم">
                <input type="text" value={m.dept || ''} onChange={(e) => updateItem('team', i, 'dept', e.target.value)} />
              </Field>
              <Field label="نوع العمل">
                <select value={m.type || 'full'} onChange={(e) => updateItem('team', i, 'type', e.target.value)}>
                  {Object.entries(WORK_TYPES).map(([k, t]) => (
                    <option key={k} value={k}>{t.label}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        ))}
      </div>
      <AddBtn label="إضافة عضو" onClick={() => addItem('team', { name: '', role: '', dept: '', type: 'full' })} />
    </div>
  )
}

function StatsEditor({ data, updateItem, addItem, removeItem, moveItem }) {
  return (
    <div className="ed-stack">
      <h3 className="ed-title">الإحصائيات ({data.stats.length})</h3>
      <div className="ed-grid">
        {data.stats.map((s, i) => (
          <div className="ed-card" key={s.id || i}>
            <CardHead index={i} onUp={() => moveItem('stats', i, -1)} onDown={() => moveItem('stats', i, 1)} onRemove={() => removeItem('stats', i)} />
            <div className="ed-row2">
              <Field label="الرقم">
                <input type="number" value={s.value ?? ''} onChange={(e) => updateItem('stats', i, 'value', Number(e.target.value))} />
              </Field>
              <Field label="اللاحقة (% أو +)">
                <input type="text" value={s.suffix || ''} onChange={(e) => updateItem('stats', i, 'suffix', e.target.value)} />
              </Field>
            </div>
            <Field label="الوصف">
              <input type="text" value={s.label || ''} onChange={(e) => updateItem('stats', i, 'label', e.target.value)} />
            </Field>
            <Field label="الأيقونة">
              <select value={s.icon || 'star'} onChange={(e) => updateItem('stats', i, 'icon', e.target.value)}>
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </Field>
          </div>
        ))}
      </div>
      <AddBtn label="إضافة إحصائية" onClick={() => addItem('stats', { value: 0, suffix: '', label: '', icon: 'star' })} />
    </div>
  )
}

function EventsEditor({ data, setList, updateItem, addItem, removeItem, moveItem, flash }) {
  const fileRef = useRef(null)

  const onExcel = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const parsed = await parseEventsFromExcel(file)
      if (!parsed.length) flash('لم يتم العثور على أحداث في الملف')
      else {
        setList('events', [...data.events, ...parsed])
        flash(`تم استيراد ${parsed.length} حدث`)
      }
    } catch (err) {
      flash('تعذّر قراءة الملف')
    } finally {
      e.target.value = ''
    }
  }

  const onImages = async (i, files) => {
    const urls = await Promise.all(Array.from(files).map(fileToDataUrl))
    updateItem('events', i, 'images', [...(data.events[i].images || []), ...urls])
  }

  const removeImage = (i, idx) => {
    updateItem('events', i, 'images', data.events[i].images.filter((_, k) => k !== idx))
  }

  return (
    <div className="ed-stack">
      <div className="ed-toolbar">
        <button className="btn btn--primary btn--sm" onClick={() => fileRef.current?.click()}>
          <Icon name="upload" size={16} /> استيراد من Excel
        </button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={onExcel} />
        <button className="btn btn--ghost btn--sm" onClick={downloadTemplate}>
          <Icon name="download" size={16} /> تحميل قالب Excel
        </button>
      </div>

      <h3 className="ed-title">الأحداث ({data.events.length})</h3>
      <div className="ed-stack">
        {data.events.map((ev, i) => (
          <div className={`ed-card ed-card--wide ${ev.hidden ? 'ed-card--hidden' : ''}`} key={ev.id || i}>
            <CardHead index={i} onUp={() => moveItem('events', i, -1)} onDown={() => moveItem('events', i, 1)} onRemove={() => removeItem('events', i)} />
            <div className="ev-toggles">
              <button
                type="button"
                className={`ev-vis ${ev.hidden ? 'is-hidden' : ''}`}
                onClick={() => updateItem('events', i, 'hidden', !ev.hidden)}
              >
                <Icon name={ev.hidden ? 'eye-off' : 'eye'} size={15} />
                {ev.hidden ? 'مخفي — لا يظهر في التقرير' : 'مرئي في التقرير'}
              </button>
              {(ev.images || []).length > 0 && (
                <button
                  type="button"
                  className={`ev-vis ev-vis--gallery ${ev.inGallery === false ? 'is-off' : ''}`}
                  onClick={() => updateItem('events', i, 'inGallery', ev.inGallery === false)}
                >
                  <Icon name="qr" size={15} />
                  {ev.inGallery === false ? 'صوره خارج المعرض' : 'صوره تظهر في المعرض'}
                </button>
              )}
            </div>
            <div className="ed-row2">
              <Field label="عنوان الحدث">
                <input type="text" value={ev.title || ''} onChange={(e) => updateItem('events', i, 'title', e.target.value)} />
              </Field>
              <Field label="التاريخ">
                <input type="date" value={ev.date || ''} onChange={(e) => updateItem('events', i, 'date', e.target.value)} />
              </Field>
            </div>
            <Field label="الوصف">
              <textarea rows={2} value={ev.description || ''} onChange={(e) => updateItem('events', i, 'description', e.target.value)} />
            </Field>
            <div className="fld">
              <span>الصور</span>
              <div className="ev-images">
                {(ev.images || []).map((src, idx) => (
                  <div className="ev-thumb" key={idx}>
                    <img src={src} alt="" />
                    <button type="button" onClick={() => removeImage(i, idx)}>×</button>
                  </div>
                ))}
                <label className="ev-upload">
                  <Icon name="plus" size={18} />
                  <input type="file" accept="image/*" multiple hidden onChange={(e) => onImages(i, e.target.files)} />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddBtn label="إضافة حدث" onClick={() => addItem('events', { title: '', date: '', description: '', images: [] })} />
    </div>
  )
}

function ChallengesEditor({ data, updateItem, addItem, removeItem, moveItem }) {
  return (
    <div className="ed-stack">
      <h3 className="ed-title">التحديات ({data.challenges.length})</h3>
      <div className="ed-grid">
        {data.challenges.map((c, i) => (
          <div className="ed-card" key={c.id || i}>
            <CardHead index={i} onUp={() => moveItem('challenges', i, -1)} onDown={() => moveItem('challenges', i, 1)} onRemove={() => removeItem('challenges', i)} />
            <Field label="العنوان">
              <input type="text" value={c.title || ''} onChange={(e) => updateItem('challenges', i, 'title', e.target.value)} />
            </Field>
            <Field label="التفاصيل">
              <textarea rows={3} value={c.text || ''} onChange={(e) => updateItem('challenges', i, 'text', e.target.value)} />
            </Field>
          </div>
        ))}
      </div>
      <AddBtn label="إضافة تحدٍ" onClick={() => addItem('challenges', { title: '', text: '' })} />
    </div>
  )
}

function GalleryEditor({ data, updateItem, addItem, removeItem, moveItem }) {
  const onImage = async (i, file) => {
    if (!file) return
    const url = await fileToDataUrl(file)
    updateItem('gallery', i, 'image', url)
  }
  return (
    <div className="ed-stack">
      <h3 className="ed-title">معرض الصور ({data.gallery.length})</h3>
      <div className="ed-grid">
        {data.gallery.map((g, i) => (
          <div className="ed-card" key={g.id || i}>
            <CardHead index={i} onUp={() => moveItem('gallery', i, -1)} onDown={() => moveItem('gallery', i, 1)} onRemove={() => removeItem('gallery', i)} />
            <div className="gl-preview" style={g.image ? { backgroundImage: `url(${g.image})` } : { background: `linear-gradient(150deg, ${g.color || '#064a51'}, var(--brand-darker))` }}>
              {!g.image && <span>بدون صورة</span>}
            </div>
            <Field label="التعليق">
              <input type="text" value={g.caption || ''} onChange={(e) => updateItem('gallery', i, 'caption', e.target.value)} />
            </Field>
            <div className="ed-row2">
              <label className="btn btn--ghost btn--sm" style={{ cursor: 'pointer' }}>
                <Icon name="upload" size={15} /> رفع صورة
                <input type="file" accept="image/*" hidden onChange={(e) => onImage(i, e.target.files?.[0])} />
              </label>
              {g.image && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => updateItem('gallery', i, 'image', '')}>
                  إزالة الصورة
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <AddBtn label="إضافة صورة" onClick={() => addItem('gallery', { caption: '', image: '', color: '#064a51' })} />
    </div>
  )
}

function RecommendationsEditor({ data, updateItem, addItem, removeItem, moveItem }) {
  return (
    <div className="ed-stack">
      <h3 className="ed-title">التوصيات ({data.recommendations.length})</h3>
      <div className="ed-grid">
        {data.recommendations.map((r, i) => (
          <div className="ed-card" key={r.id || i}>
            <CardHead index={i} onUp={() => moveItem('recommendations', i, -1)} onDown={() => moveItem('recommendations', i, 1)} onRemove={() => removeItem('recommendations', i)} />
            <Field label="العنوان">
              <input type="text" value={r.title || ''} onChange={(e) => updateItem('recommendations', i, 'title', e.target.value)} />
            </Field>
            <Field label="التفاصيل">
              <textarea rows={3} value={r.text || ''} onChange={(e) => updateItem('recommendations', i, 'text', e.target.value)} />
            </Field>
          </div>
        ))}
      </div>
      <AddBtn label="إضافة توصية" onClick={() => addItem('recommendations', { title: '', text: '' })} />
    </div>
  )
}

function LayoutsEditor({ data, setLayout }) {
  const layouts = data.layouts || {}
  return (
    <div className="ed-stack">
      <h3 className="ed-title">طريقة عرض وترتيب العناصر</h3>
      <p className="ed-hint">اختر كيف تظهر عناصر كل قسم في صفحة التقرير (شبكة، قائمة، متناوب…).</p>
      <div className="ed-grid">
        {LAYOUT_SECTIONS.map((s) => {
          const current = layouts[s.key] || DEFAULT_LAYOUTS[s.key]
          return (
            <div className="ed-card" key={s.key}>
              <Field label={s.label}>
                <select value={current} onChange={(e) => setLayout(s.key, e.target.value)}>
                  {LAYOUTS[s.key].map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <div className="layout-options">
                {LAYOUTS[s.key].map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    className={`layout-chip ${current === o.key ? 'is-active' : ''}`}
                    onClick={() => setLayout(s.key, o.key)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
