import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
const API = '/api'
const TOKEN_KEY = 'rakaya_token'

const authHeaders = (token) => (token ? { Authorization: `Bearer ${token}` } : {})

const CmsContext = createContext(null)

export function CmsProvider({ children }) {
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')

  // مرآة للحالة الحالية لاستخدامها داخل المؤقتات
  const storeRef = useRef(store)
  useEffect(() => {
    storeRef.current = store
  }, [store])

  // ---------- التحميل ----------
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`${API}/store`)
      if (!r.ok) throw new Error('failed')
      setStore(await r.json())
      setError(null)
    } catch (e) {
      setError('تعذّر الاتصال بالخادم. تأكد أن الخادم يعمل (npm run dev).')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // ---------- المصادقة ----------
  const login = useCallback(async (password) => {
    try {
      const r = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        return { ok: false, error: j.error || 'فشل تسجيل الدخول' }
      }
      const { token: t } = await r.json()
      localStorage.setItem(TOKEN_KEY, t)
      setToken(t)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: 'تعذّر الاتصال بالخادم' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/logout`, { method: 'POST', headers: authHeaders(token) })
    } catch (e) {
      /* ignore */
    }
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
  }, [token])

  // طلب يتطلب صلاحية — يرمي خطأ عند انتهاء الجلسة
  const authed = useCallback(
    async (path, opts = {}) => {
      const r = await fetch(`${API}${path}`, {
        ...opts,
        headers: { 'Content-Type': 'application/json', ...authHeaders(token), ...(opts.headers || {}) },
      })
      if (r.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        setToken('')
        throw new Error('انتهت الجلسة. سجّل الدخول من جديد.')
      }
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j.error || 'حدث خطأ')
      }
      return r.json()
    },
    [token]
  )

  // ---------- عمليات هيكلية (تُحدّث الحالة من استجابة الخادم) ----------
  const addYear = useCallback(
    (key, label, copyFrom) =>
      authed('/years', { method: 'POST', body: JSON.stringify({ key, label, copyFrom }) }).then(
        setStore
      ),
    [authed]
  )

  const deleteYear = useCallback(
    (key) =>
      authed(`/years/${encodeURIComponent(key)}`, { method: 'DELETE' }).then(setStore),
    [authed]
  )

  const setActiveYear = useCallback(
    (year) => authed('/active', { method: 'PUT', body: JSON.stringify({ year }) }).then(setStore),
    [authed]
  )

  const resetAll = useCallback(
    () => authed('/reset', { method: 'POST' }).then(setStore),
    [authed]
  )

  // ---------- تعديل المحتوى: متفائل + حفظ مؤجّل ----------
  const saveTimers = useRef({})

  const patchYear = useCallback(
    (key, partial) => {
      // تحديث فوري محلي (سلس أثناء الكتابة)
      setStore((prev) => {
        if (!prev || !prev.years[key]) return prev
        return { ...prev, years: { ...prev.years, [key]: { ...prev.years[key], ...partial } } }
      })
      // حفظ مؤجّل للخادم
      clearTimeout(saveTimers.current[key])
      saveTimers.current[key] = setTimeout(async () => {
        const cur = storeRef.current?.years?.[key]
        if (!cur) return
        try {
          await authed(`/years/${encodeURIComponent(key)}`, {
            method: 'PUT',
            body: JSON.stringify(cur),
          })
          setError(null)
        } catch (e) {
          setError(e.message)
        }
      }, 500)
    },
    [authed]
  )

  const renameYear = useCallback((key, label) => patchYear(key, { label }), [patchYear])

  // ---------- مشتقات ----------
  const yearKeys = useMemo(() => (store ? Object.keys(store.years) : []), [store])
  const activeYear = store && store.years[store.activeYear] ? store.activeYear : yearKeys[0]
  const activeData = store ? store.years[activeYear] : null

  // السنة المعروضة في التقرير (من الـURL)، وإلا النشطة
  const [viewYear, setViewYear] = useState(null)
  const displayYear = store && viewYear && store.years[viewYear] ? viewYear : activeYear
  const displayData = store ? store.years[displayYear] : null

  const value = {
    store,
    loading,
    error,
    setError,
    token,
    isAuthed: !!token,
    login,
    logout,
    years: store ? store.years : {},
    yearKeys,
    activeYear,
    activeData,
    viewYear,
    setViewYear,
    displayYear,
    displayData,
    addYear,
    deleteYear,
    renameYear,
    setActiveYear,
    patchYear,
    resetAll,
    reload: load,
  }

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
