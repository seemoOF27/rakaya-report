-- ════════════════════════════════════════════════════════════════
--  إعداد تخزين الفيديو (Supabase Storage) لباكت: rakaya-report-storage
--  Supabase → SQL Editor → New query → الصق هذا → Run
-- ════════════════════════════════════════════════════════════════

-- 1) اجعل الباكت عامًا (قراءة عامة عبر الرابط)
update storage.buckets set public = true where id = 'rakaya-report-storage';

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
