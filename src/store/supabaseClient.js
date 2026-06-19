import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_READY } from '../supabaseConfig'

export const supabase = SUPABASE_READY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null
export { SUPABASE_READY }

const STORE_ID = 'store'

// قراءة المتجر (عام)
export async function fetchStore() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('app_state')
    .select('data')
    .eq('id', STORE_ID)
    .maybeSingle()
  if (error) throw error
  return data ? data.data : null
}

// حفظ المتجر (محمي بكلمة المرور عبر دالة RPC)
export async function saveStoreRemote(password, store) {
  if (!supabase) throw new Error('Supabase غير مُهيّأ')
  const { error } = await supabase.rpc('save_store', { p_password: password, p_data: store })
  if (error) throw error
}

// التحقق من كلمة المرور
export async function checkPassword(password) {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('check_password', { p_password: password })
  if (error) return false
  return !!data
}
