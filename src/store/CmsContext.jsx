import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SUPABASE_READY, fetchStore, saveStoreRemote, checkPassword } from './supabaseClient'
import {
  buildDefaultStore,
  normalizeStore,
  withNewYear,
  withoutYear,
} from './defaults'

const PW_KEY = 'rakaya_pw'

const CmsContext = createContext(null)

export function CmsProvider({ children }) {
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [password, setPassword] = useState(() => localStorage.getItem(PW_KEY) || '')
  const [viewYear, setViewYear] = useState(null)

  const storeRef = useRef(store)
  useEffect(() => {
    storeRef.current = store
  }, [store])

  // ---------- التحميل ----------
  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (!SUPABASE_READY) {
        setStore(buildDefaultStore())
        setError(null)
        return
      }
      const remote = await fetchStore()
      setStore(remote ? normalizeStore(remote) : buildDefaultStore())
      setError(null)
    } catch (e) {
      setStore(buildDefaultStore())
      setError('تعذّر الاتصال بقاعدة البيانات — يُعرض المحتوى الافتراضي.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // ---------- الحفظ ----------
  const saveTimer = useRef(null)
  const persist = useCallback(
    (nextStore, { immediate = false } = {}) => {
      setStore(nextStore)
      storeRef.current = nextStore
      const doSave = async () => {
        if (!SUPABASE_READY || !password) return
        try {
          await saveStoreRemote(password, storeRef.current)
          setError(null)
        } catch (e) {
          setError('فشل الحفظ. تأكد من كلمة المرور والاتصال.')
        }
      }
      clearTimeout(saveTimer.current)
      if (immediate) return doSave()
      saveTimer.current = setTimeout(doSave, 500)
    },
    [password]
  )

  // ---------- المصادقة ----------
  const login = useCallback(async (pw) => {
    if (!SUPABASE_READY) return { ok: false, error: 'قاعدة البيانات غير مُهيّأة بعد.' }
    try {
      const ok = await checkPassword(pw)
      if (!ok) return { ok: false, error: 'كلمة المرور غير صحيحة' }
      localStorage.setItem(PW_KEY, pw)
      setPassword(pw)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: 'تعذّر الاتصال بقاعدة البيانات' }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(PW_KEY)
    setPassword('')
  }, [])

  // ---------- عمليات السنوات ----------
  const setActiveYear = useCallback(
    (year) => persist({ ...storeRef.current, activeYear: String(year) }, { immediate: true }),
    [persist]
  )

  const addYear = useCallback(
    (key, label, copyFrom) =>
      persist(withNewYear(storeRef.current, key, label, copyFrom), { immediate: true }),
    [persist]
  )

  const deleteYear = useCallback(
    (key) => persist(withoutYear(storeRef.current, key), { immediate: true }),
    [persist]
  )

  const resetAll = useCallback(
    () => persist(buildDefaultStore(), { immediate: true }),
    [persist]
  )

  // دمج جزئي على سنة (متفائل + حفظ مؤجّل)
  const patchYear = useCallback(
    (key, partial) => {
      const cur = storeRef.current
      if (!cur || !cur.years[key]) return
      persist({
        ...cur,
        years: { ...cur.years, [key]: { ...cur.years[key], ...partial } },
      })
    },
    [persist]
  )

  const renameYear = useCallback((key, label) => patchYear(key, { label }), [patchYear])

  // ---------- مشتقات ----------
  const yearKeys = useMemo(() => (store ? Object.keys(store.years) : []), [store])
  const activeYear = store && store.years[store.activeYear] ? store.activeYear : yearKeys[0]
  const activeData = store ? store.years[activeYear] : null
  const displayYear = store && viewYear && store.years[viewYear] ? viewYear : activeYear
  const displayData = store ? store.years[displayYear] : null

  const value = {
    store,
    loading,
    error,
    setError,
    isAuthed: !!password,
    canSave: SUPABASE_READY,
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
