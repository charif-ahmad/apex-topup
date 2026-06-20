# Deployment: Supabase + Render

## نظرة عامة

يستخدم المشروع:
- **Supabase** → قاعدة بيانات PostgreSQL مستضافة
- **Render** → استضافة خادم الخلفية (Node.js + Express + Prisma)

---

## المشكلة التي واجهناها

عند محاولة رفع الخادم على Render لأول مرة، فشل البناء بالخطأ التالي:

```
Error: P1001: Can't reach database server at `db.hradpieabmmehmysxzhc.supabase.co:5432`
```

### سبب المشكلة

كان أمر البناء يحتوي على:
```
npm install && npx prisma generate && npx prisma migrate deploy
```

`prisma migrate deploy` يحاول الاتصال بقاعدة البيانات عبر **الاتصال المباشر** (المنفذ 5432)،
وهذا المنفذ **محجوب** على الخطة المجانية في Supabase عند الاتصال من بيئات خارجية مثل Render.

---

## الحل

### 1. تعديل `prisma/schema.prisma`

أضفنا `directUrl` حتى يستطيع Prisma التمييز بين:
- رابط التشغيل العادي → عبر **Connection Pooler** (منفذ 6543)
- رابط الـ Migrations → اتصال مباشر (منفذ 5432)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### 2. تعديل متغيرات البيئة على Render

| المتغير | القيمة | الغرض |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.PROJECT_ID:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` | اتصال التشغيل عبر Pooler |
| `DIRECT_URL` | `postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres` | اتصال مباشر للـ Migrations |

### 3. تعديل Build Command على Render

**قبل الإصلاح:**
```
npm install && npx prisma generate && npx prisma migrate deploy
```

**بعد الإصلاح:**
```
npm install && npx prisma generate
```

> حذفنا `prisma migrate deploy` لأن Render لا يستطيع الوصول إلى المنفذ المباشر لـ Supabase.

---

## ماذا تفعل في المستقبل عند إضافة Migration جديدة؟

### الخطوات:

**1. أنشئ الـ Migration محلياً:**
```bash
cd backend
npx prisma migrate dev --name اسم_التغيير
```

**2. طبّق الـ Migration على Supabase مباشرةً:**

يمكنك تطبيقها يدوياً عبر:
- **Supabase Dashboard** → `SQL Editor` → نسخ محتوى ملف الـ Migration وتشغيله
- أو عبر الـ MCP tool الخاص بـ Supabase مباشرةً من بيئة التطوير

**3. ادفع الكود إلى GitHub:**
```bash
git add .
git commit -m "feat: add migration اسم_التغيير"
git push
```

**4. Render سيقوم بإعادة الرفع تلقائياً** بدون تشغيل الـ Migrations (فقط `prisma generate`).

---

## ملاحظات مهمة

> ⚠️ **لا ترفع ملف `.env` إلى GitHub أبداً.** تأكد من وجوده في `.gitignore`.

> 💡 **على الخطة المجانية في Supabase:** قاعدة البيانات تتوقف تلقائياً بعد أسبوع من عدم الاستخدام. لإعادة تشغيلها اذهب إلى لوحة Supabase واضغط **Restore**.

> 🔑 **JWT_SECRET:** استخدم دائماً مفتاحاً عشوائياً قوياً في بيئة الإنتاج. يمكن إنشاؤه بالأمر:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## ملخص متغيرات البيئة المطلوبة على Render

| المتغير | ملاحظة |
|---|---|
| `DATABASE_URL` | رابط Pooler من Supabase (منفذ 6543) |
| `DIRECT_URL` | رابط مباشر من Supabase (منفذ 5432) |
| `JWT_SECRET` | مفتاح عشوائي قوي (لا تستخدم القيمة التجريبية) |
| `JWT_EXPIRES_IN` | مثال: `1d` |
| `BCRYPT_SALT_ROUNDS` | `10` |
| `PAYMENT_SUCCESS_RATE` | `0.8` |
| `CORS_ORIGIN` | رابط الواجهة الأمامية بعد رفعها |
| `ADMIN_EMAIL` | بريد المسؤول |
| `ADMIN_PASSWORD` | كلمة مرور المسؤول |
| `ADMIN_NAME` | اسم المسؤول |
