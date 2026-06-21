-- ════════════════════════════════════════════════════════════════
--  إعداد تخزين الفيديو (Supabase Storage) — باكت: rakaya-report-storage
--  Supabase → SQL Editor → New query → الصق هذا كله → Run
-- ════════════════════════════════════════════════════════════════

-- 1) إنشاء الباكت (عام) إن لم يكن موجودًا
insert into storage.buckets (id, name, public)
values ('rakaya-report-storage', 'rakaya-report-storage', true)
on conflict (id) do update set public = true;

-- 2) سياسة القراءة للجميع
drop policy if exists "rakaya storage read" on storage.objects;
create policy "rakaya storage read" on storage.objects
  for select to anon
  using (bucket_id = 'rakaya-report-storage');

-- 3) سياسة الرفع (تتيح رفع الفيديو من لوحة التحكم)
drop policy if exists "rakaya storage upload" on storage.objects;
create policy "rakaya storage upload" on storage.objects
  for insert to anon
  with check (bucket_id = 'rakaya-report-storage');

-- تم ✅
