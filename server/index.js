// خادم بسيط يربط المحتوى بقاعدة بيانات SQLite (node:sqlite المدمج)
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync, existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import express from 'express'
import cors from 'cors'

import {
  TEAM,
  STATS,
  SEED_EVENTS,
  CHALLENGES,
  GALLERY,
  RECOMMENDATIONS,
  REPORT_META,
  CONCLUSION,
  DEFAULT_LAYOUTS,
} from '../src/data.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rakaya2026'
const PORT = process.env.PORT || 3001

// ---------- قاعدة البيانات ----------
const db = new DatabaseSync(join(DATA_DIR, 'rakaya.db'))
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS years (
    key TEXT PRIMARY KEY,
    label TEXT,
    data TEXT,
    sort_order INTEGER DEFAULT 0,
    updated_at TEXT
  );
`)

function defaultYear() {
  return {
    label: '1446 هـ',
    meta: {
      title: REPORT_META.title,
      season: REPORT_META.season,
      intro: REPORT_META.intro,
    },
    conclusion: { ...CONCLUSION },
    team: TEAM.map((m) => ({ ...m })),
    stats: STATS.map((s) => ({ ...s })),
    events: SEED_EVENTS.map((e) => ({ ...e })),
    challenges: CHALLENGES.map((c) => ({ ...c })),
    gallery: GALLERY.map((g) => ({ ...g })),
    recommendations: RECOMMENDATIONS.map((r) => ({ ...r })),
    layouts: { ...DEFAULT_LAYOUTS },
  }
}

function seedIfEmpty() {
  const row = db.prepare('SELECT COUNT(*) AS n FROM years').get()
  if (row.n > 0) return
  const y = defaultYear()
  db.prepare(
    'INSERT INTO years (key, label, data, sort_order, updated_at) VALUES (?, ?, ?, ?, ?)'
  ).run('1446', y.label, JSON.stringify(y), 0, new Date().toISOString())
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('active_year', '1446')
}
seedIfEmpty()

function getActiveYear() {
  const row = db.prepare("SELECT value FROM settings WHERE key='active_year'").get()
  return row ? row.value : null
}

function getStore() {
  const rows = db.prepare('SELECT key, label, data FROM years ORDER BY sort_order, key').all()
  const years = {}
  for (const r of rows) {
    const data = JSON.parse(r.data)
    data.label = r.label
    if (!data.layouts) data.layouts = { ...DEFAULT_LAYOUTS }
    years[r.key] = data
  }
  const keys = Object.keys(years)
  let activeYear = getActiveYear()
  if (!activeYear || !years[activeYear]) activeYear = keys[0] || null
  return { activeYear, years }
}

// ---------- المصادقة ----------
const tokens = new Set()

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (token && tokens.has(token)) return next()
  res.status(401).json({ error: 'غير مصرّح' })
}

// ---------- الخادم ----------
const app = express()
app.use(cors())
app.use(express.json({ limit: '25mb' }))

app.post('/api/login', (req, res) => {
  const { password } = req.body || {}
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'كلمة المرور غير صحيحة' })
  }
  const token = randomUUID()
  tokens.add(token)
  res.json({ token })
})

app.post('/api/logout', requireAuth, (req, res) => {
  const token = (req.headers.authorization || '').slice(7)
  tokens.delete(token)
  res.json({ ok: true })
})

// المتجر الكامل (عام — للعرض)
app.get('/api/store', (req, res) => {
  res.json(getStore())
})

// إنشاء سنة
app.post('/api/years', requireAuth, (req, res) => {
  const { key, label, copyFrom } = req.body || {}
  if (!key) return res.status(400).json({ error: 'المعرّف مطلوب' })
  const exists = db.prepare('SELECT key FROM years WHERE key=?').get(String(key))
  if (exists) return res.status(409).json({ error: 'السنة موجودة مسبقًا' })

  let data
  if (copyFrom) {
    const src = db.prepare('SELECT data FROM years WHERE key=?').get(String(copyFrom))
    data = src ? JSON.parse(src.data) : defaultYear()
  } else {
    data = defaultYear()
    data.team = []
    data.stats = []
    data.events = []
    data.challenges = []
    data.gallery = []
    data.recommendations = []
    data.meta = { title: 'تقرير موسم الحج', season: label || String(key), intro: '' }
    data.conclusion = { title: '', text: '', sign: '— فريق ركايا للاستشارات' }
  }
  data.label = label || String(key)
  if (data.meta) data.meta.season = label || data.meta.season || String(key)
  if (!data.layouts) data.layouts = { ...DEFAULT_LAYOUTS }

  const maxRow = db.prepare('SELECT MAX(sort_order) AS m FROM years').get()
  const order = (maxRow.m ?? 0) + 1
  db.prepare(
    'INSERT INTO years (key, label, data, sort_order, updated_at) VALUES (?, ?, ?, ?, ?)'
  ).run(String(key), data.label, JSON.stringify(data), order, new Date().toISOString())
  res.json(getStore())
})

// تحديث سنة (دمج جزئي)
app.put('/api/years/:key', requireAuth, (req, res) => {
  const key = req.params.key
  const row = db.prepare('SELECT data FROM years WHERE key=?').get(key)
  if (!row) return res.status(404).json({ error: 'السنة غير موجودة' })
  const current = JSON.parse(row.data)
  const merged = { ...current, ...(req.body || {}) }
  const label = merged.label || current.label
  db.prepare('UPDATE years SET label=?, data=?, updated_at=? WHERE key=?').run(
    label,
    JSON.stringify(merged),
    new Date().toISOString(),
    key
  )
  res.json(getStore())
})

// حذف سنة
app.delete('/api/years/:key', requireAuth, (req, res) => {
  const count = db.prepare('SELECT COUNT(*) AS n FROM years').get()
  if (count.n <= 1) return res.status(400).json({ error: 'لا يمكن حذف آخر سنة' })
  db.prepare('DELETE FROM years WHERE key=?').run(req.params.key)
  const active = getActiveYear()
  if (active === req.params.key) {
    const first = db.prepare('SELECT key FROM years ORDER BY sort_order, key LIMIT 1').get()
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(
      'active_year',
      first.key
    )
  }
  res.json(getStore())
})

// تعيين السنة النشطة
app.put('/api/active', requireAuth, (req, res) => {
  const { year } = req.body || {}
  const row = db.prepare('SELECT key FROM years WHERE key=?').get(String(year))
  if (!row) return res.status(404).json({ error: 'السنة غير موجودة' })
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(
    'active_year',
    String(year)
  )
  res.json(getStore())
})

// إعادة التعيين الكامل
app.post('/api/reset', requireAuth, (req, res) => {
  db.exec('DELETE FROM years; DELETE FROM settings;')
  seedIfEmpty()
  res.json(getStore())
})

app.listen(PORT, () => {
  console.log(`✓ خادم ركايا يعمل على http://localhost:${PORT}`)
})
