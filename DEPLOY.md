# نشر تقرير ركايا مجانًا (GitHub Pages + Supabase)

الموقع يُرفع على **GitHub Pages** (مجاني)، والبيانات تُحفظ في **Supabase** (مجاني ودائم).

---

## 1) إعداد قاعدة البيانات (مرة واحدة)

1. ادخل مشروعك في Supabase → **SQL Editor** → **New query**.
2. الصق كامل محتوى ملف [`supabase-setup.sql`](./supabase-setup.sql) → اضغط **Run**.
3. (مهم) غيّر كلمة المرور: في الملف بدّل `rakaya2026` في الموضعين إلى كلمة مرور خاصة بك قبل التشغيل.

> بياناتك (URL + المفتاح) معبّأة مسبقًا في `src/supabaseConfig.js`. المفتاح من نوع publishable وآمن للنشر العلني.

---

## 2) رفع المشروع على GitHub

```bash
git init
git add -A
git commit -m "Rakaya Hajj report"
git branch -M main
git remote add origin https://github.com/<اسم-حسابك>/<اسم-المستودع>.git
git push -u origin main
```

---

## 3) تفعيل GitHub Pages

1. في صفحة المستودع → **Settings** → **Pages**.
2. تحت **Build and deployment** → **Source** اختر **GitHub Actions**.
3. كل `push` على `main` ينشر الموقع تلقائيًا (يوجد workflow جاهز في `.github/workflows/deploy.yml`).
4. بعد دقيقة، الموقع يكون على:
   `https://<اسم-حسابك>.github.io/<اسم-المستودع>/`

> المسار يُضبط تلقائيًا على اسم المستودع — ما تحتاج تعدّل شيء.

---

## 4) أول استخدام

1. افتح الموقع ثم أضف `/admin` في آخر الرابط.
2. سجّل الدخول بكلمة المرور اللي حطّيتها في الـSQL.
3. عدّل المحتوى — يُحفظ تلقائيًا في Supabase.
4. الزوار يشوفون السنة النشطة من الرابط الرئيسي، وأي سنة من `/r/{slug}`.

---

## تشغيل محلي

```bash
npm install
npm run dev
```

يتصل بنفس قاعدة Supabase. لو ما ضبطت القاعدة بعد، يشتغل بوضع العرض ببيانات افتراضية.
