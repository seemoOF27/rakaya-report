import * as XLSX from 'xlsx'

// أسماء الأعمدة المقبولة (عربي/إنجليزي) لكل حقل
const FIELD_ALIASES = {
  title: ['العنوان', 'الحدث', 'الحادثة', 'اسم الحدث', 'title', 'event', 'name'],
  date: ['التاريخ', 'تاريخ', 'date', 'day'],
  description: ['الوصف', 'التفاصيل', 'description', 'details', 'desc', 'notes'],
  images: ['الصور', 'صور', 'الصورة', 'images', 'image', 'photos', 'photo', 'links'],
}

function matchField(header) {
  const h = String(header || '').trim().toLowerCase()
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    if (aliases.some((a) => a.toLowerCase() === h)) return field
  }
  return null
}

// يحوّل قيمة تاريخ اكسل (رقم تسلسلي أو نص) إلى YYYY-MM-DD
function normalizeDate(value) {
  if (value == null || value === '') return ''
  if (typeof value === 'number') {
    const d = XLSX.SSF.parse_date_code(value)
    if (d) {
      const mm = String(d.m).padStart(2, '0')
      const dd = String(d.d).padStart(2, '0')
      return `${d.y}-${mm}-${dd}`
    }
  }
  const parsed = new Date(value)
  if (!isNaN(parsed)) return parsed.toISOString().slice(0, 10)
  return String(value)
}

function splitImages(value) {
  if (!value) return []
  return String(value)
    .split(/[\n,،|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

let idCounter = 0
function uid() {
  idCounter += 1
  return `xlsx-${Date.now()}-${idCounter}`
}

// يقرأ ملف اكسل ويرجّع مصفوفة أحداث
export async function parseEventsFromExcel(file) {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false })
  if (!rows.length) return []

  // الصف الأول = العناوين
  const headerRow = rows[0]
  const colMap = {}
  headerRow.forEach((h, i) => {
    const field = matchField(h)
    if (field) colMap[field] = i
  })

  // لو ما لقينا أعمدة معروفة، نفترض ترتيب: عنوان، تاريخ، وصف، صور
  if (Object.keys(colMap).length === 0) {
    colMap.title = 0
    colMap.date = 1
    colMap.description = 2
    colMap.images = 3
  }

  const events = []
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    if (!row || row.every((c) => c === '' || c == null)) continue
    const title = colMap.title != null ? row[colMap.title] : ''
    if (!title) continue
    events.push({
      id: uid(),
      title: String(title).trim(),
      date: normalizeDate(colMap.date != null ? row[colMap.date] : ''),
      description: colMap.description != null ? String(row[colMap.description] || '').trim() : '',
      images: splitImages(colMap.images != null ? row[colMap.images] : ''),
    })
  }
  return events
}

// ينشئ ملف اكسل قالب جاهز للتعبئة
export function downloadTemplate() {
  const data = [
    ['العنوان', 'التاريخ', 'الوصف', 'الصور (روابط مفصولة بفاصلة)'],
    ['انطلاق الموسم', '2025-06-01', 'بدء الأعمال الميدانية', 'https://example.com/1.jpg'],
    ['يوم الذروة', '2025-06-06', 'أعلى معدل خدمة', ''],
  ]
  const ws = XLSX.utils.aoa_to_sheet(data)
  ws['!cols'] = [{ wch: 24 }, { wch: 14 }, { wch: 40 }, { wch: 40 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'الأحداث')
  XLSX.writeFile(wb, 'قالب-الأحداث.xlsx')
}
