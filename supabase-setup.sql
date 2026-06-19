-- ════════════════════════════════════════════════════════════════
--  إعداد قاعدة بيانات Supabase لتقرير ركايا
--  افتح: Supabase Dashboard → SQL Editor → New query → الصق هذا كله → Run
-- ════════════════════════════════════════════════════════════════

-- 1) جدول يحفظ كامل المحتوى كـ JSON (صف واحد)
create table if not exists app_state (
  id   text primary key,
  data jsonb not null
);

-- 2) تفعيل الحماية (RLS)
alter table app_state enable row level security;

-- 3) القراءة متاحة للجميع (التقرير عام)
drop policy if exists "public read" on app_state;
create policy "public read" on app_state for select using (true);

-- (لا توجد سياسة كتابة للعامة — الكتابة تتم فقط عبر الدالة المحمية أدناه)

-- 4) دالة الحفظ المحمية بكلمة المرور
--    ⚠️ غيّر 'rakaya2026' إلى كلمة مرور قوية خاصة بك
create or replace function save_store(p_password text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_password <> 'rakaya2026' then
    raise exception 'unauthorized';
  end if;
  insert into app_state (id, data) values ('store', p_data)
  on conflict (id) do update set data = excluded.data;
end;
$$;

-- 5) دالة التحقق من كلمة المرور (لتسجيل الدخول)
create or replace function check_password(p_password text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select p_password = 'rakaya2026';
$$;

-- 6) السماح باستدعاء الدوال من المتصفح (مفتاح anon)
grant execute on function save_store(text, jsonb) to anon;
grant execute on function check_password(text) to anon;

-- تم ✅  (البيانات الافتراضية تُنشأ تلقائيًا عند أول حفظ من لوحة التحكم)
