// بناء المتجر الافتراضي ومنطق السنوات (يعمل في المتصفح — بديل منطق السيرفر السابق)
import {
  TEAM,
  STATS,
  SEED_EVENTS,
  CHALLENGES,
  GALLERY,
  RECOMMENDATIONS,
  SEED_TESTIMONIALS,
  REPORT_META,
  CONCLUSION,
  DEFAULT_LAYOUTS,
} from '../data'

const clone = (v) => JSON.parse(JSON.stringify(v))

export function buildDefaultStore() {
  return {
    activeYear: '1446',
    years: {
      1446: {
        label: '1446 هـ',
        slug: '1446',
        meta: {
          title: REPORT_META.title,
          season: REPORT_META.season,
          intro: REPORT_META.intro,
        },
        conclusion: { ...CONCLUSION },
        team: clone(TEAM),
        stats: clone(STATS),
        events: clone(SEED_EVENTS),
        challenges: clone(CHALLENGES),
        gallery: clone(GALLERY),
        recommendations: clone(RECOMMENDATIONS),
        testimonials: clone(SEED_TESTIMONIALS),
        layouts: { ...DEFAULT_LAYOUTS },
      },
    },
  }
}

export function emptyYear(label, key) {
  return {
    label: label || key,
    slug: String(key),
    meta: { title: 'تقرير موسم الحج', season: label || String(key), intro: '' },
    conclusion: { title: '', text: '', sign: '— فريق ركايا للاستشارات' },
    team: [],
    stats: [],
    events: [],
    challenges: [],
    gallery: [],
    recommendations: [],
    testimonials: [],
    layouts: { ...DEFAULT_LAYOUTS },
  }
}

// إنشاء سنة جديدة داخل نسخة جديدة من المتجر
export function withNewYear(store, key, label, copyFrom) {
  const id = String(key)
  if (store.years[id]) return store
  const base =
    copyFrom && store.years[copyFrom] ? clone(store.years[copyFrom]) : emptyYear(label, id)
  base.label = label || id
  base.slug = id
  if (base.meta) base.meta.season = label || base.meta.season || id
  if (!base.layouts) base.layouts = { ...DEFAULT_LAYOUTS }
  return { ...store, years: { ...store.years, [id]: base } }
}

export function withoutYear(store, key) {
  const id = String(key)
  const years = { ...store.years }
  delete years[id]
  const remaining = Object.keys(years)
  if (!remaining.length) return store // لا نحذف آخر سنة
  const activeYear = store.activeYear === id ? remaining[0] : store.activeYear
  return { ...store, years, activeYear }
}

// ضمان اكتمال الحقول لأي متجر قادم من قاعدة البيانات
export function normalizeStore(store) {
  if (!store || !store.years || !Object.keys(store.years).length) return buildDefaultStore()
  const years = {}
  for (const [k, y] of Object.entries(store.years)) {
    years[k] = { ...y }
    if (!years[k].layouts) years[k].layouts = { ...DEFAULT_LAYOUTS }
    if (!years[k].slug) years[k].slug = k
    if (!years[k].testimonials) years[k].testimonials = []
  }
  let activeYear = store.activeYear
  if (!activeYear || !years[activeYear]) activeYear = Object.keys(years)[0]
  return { activeYear, years }
}
