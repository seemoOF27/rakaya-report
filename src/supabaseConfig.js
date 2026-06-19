// إعدادات Supabase — عبّئها بقيم مشروعك (آمنة للنشر العلني: مفتاح anon عام بطبيعته).
// تجدها في: Supabase Dashboard → Project Settings → API
//   - Project URL  → SUPABASE_URL
//   - anon public  → SUPABASE_ANON_KEY
// يمكن أيضًا ضبطها كمتغيرات بيئة عند البناء: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://bvmkhkvakbviciwpktfu.supabase.co'

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XSr1iC-039dAbK_M7f_RQg_PabTSo8w'

// هل الإعدادات مكتملة؟ (لو لا، يعمل الموقع بوضع العرض فقط ببيانات افتراضية)
export const SUPABASE_READY =
  !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR-ANON')
