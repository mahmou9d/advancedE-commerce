# 🛒 PrimeEcom — متجر إلكتروني متكامل

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-11.10-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Stripe-Payment-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</div>

---

## 📖 نبذة عن المشروع

**PrimeEcom** هو تطبيق ويب متكامل لمتجر إلكتروني (E-Commerce) مبني بتقنيات حديثة. يتيح للمستخدمين تصفح المنتجات وإضافتها للسلة أو قائمة الأمنيات، وإتمام الطلبات بالدفع عبر **Stripe** أو الكاش — كل ذلك من خلال واجهة مستخدم داكنة بـ Glassmorphism Design سريعة الاستجابة.

يحتوي المشروع كذلك على **لوحة تحكم للأدمن** تتيح إضافة المنتجات وتعديلها وحذفها بشكل مباشر، وعلى نظام **تقييمات حقيقي** مرتبط بـ Firebase ومقيّد بالمشترين الموثّقين.

---

## ✨ المميزات الرئيسية

### 🛍️ للمستخدم العادي
| الميزة | الوصف |
|---|---|
| 🏠 **الصفحة الرئيسية** | Hero Section مع إحصائيات وبطاقات مميزات الموقع ومنتجات Trending |
| 📦 **تصفح المنتجات** | عرض منتجات مصنّفة حسب الفئات (أحذية، إلكترونيات، رياضة، أطفال، نساء، رجال) |
| 🔍 **البحث** | البحث عن المنتجات بالاسم في الوقت الفعلي |
| 🎁 **العروض** | صفحة مخصصة لعرض المنتجات المخفّضة مع Pagination |
| 🛒 **سلة المشتريات** | إضافة/إزالة منتجات، تحديث الكميات، عرض الإجمالي |
| ❤️ **قائمة الأمنيات** | حفظ المنتجات المفضلة للرجوع إليها لاحقاً |
| 👤 **الحساب الشخصي** | عرض بيانات المستخدم وإدارة الحساب |
| 📋 **الطلبات** | عرض سجل الطلبات مع Tabs (الكل / قيد المعالجة / مكتمل / معلّق / ملغي) وطباعة الإيصالات |
| 🔎 **صفحة المنتج** | معرض صور، اختيار الكمية، تبويبات Overview / Specs / Shipping / Reviews |
| ⭐ **التقييمات** | مراجعات حقيقية من Firebase RTDB — المشترون الموثّقون فقط يقدرون يكتبوا |

### 💳 الدفع
- **Stripe Visa/Card** — تكامل حقيقي مع Stripe Elements (`CardElement`)
- **Cash on Delivery** — الدفع عند الاستلام
- يظهر modal آمن بـ `createPortal` فوق كل العناصر بـ `z-[9999]`

### 🔐 المصادقة (Authentication)
- تسجيل حساب جديد (Register) مع التحقق من البيانات عبر **Zod + React Hook Form**
- تسجيل الدخول (Login) مع زر **"Use Admin Credentials"** يملأ الفورم تلقائياً
- حماية الصفحات الخاصة عبر `ProtectedRoute`

### 🛠️ لوحة تحكم الأدمن
- إضافة منتج جديد مع رفع الصورة عبر **ImgBB API**
- تعديل بيانات منتج موجود
- حذف منتج بتأكيد

### 📄 صفحات ثابتة
- `/privacy` — سياسة الخصوصية
- `/terms` — الشروط والأحكام
- `/contact` — تواصل معنا

---

## 🗂️ هيكل المشروع

```
src/
├── assets/            # الصور والأصول الثابتة
├── components/        # المكوّنات المشتركة وقابلة إعادة الاستخدام
│   ├── Auth/          # مكوّنات المصادقة (ProtectedRoute)
│   ├── common/        # مكوّنات عامة (Header, Footer, ...)
│   ├── eCommerce/     # مكوّنات المتجر (Product, Cart, Wishlist, ...)
│   ├── feedback/      # مكوّنات التغذية الراجعة (Loading, Skeleton, PageSuspenseFallback)
│   └── form/          # مكوّنات النماذج
├── hooks/             # Custom Hooks مخصصة
├── layouts/           # تخطيطات الصفحات (MainLayout, ProfileLayout)
├── pages/             # صفحات التطبيق
│   ├── home/          # الصفحة الرئيسية
│   ├── category/      # صفحة الفئات
│   ├── productDetails/# صفحة المنتج + ProductReviews
│   ├── offers/        # صفحة العروض
│   ├── cart/          # سلة المشتريات
│   ├── wishlist/      # قائمة الأمنيات
│   ├── orders/        # الطلبات
│   ├── account/       # الحساب الشخصي
│   ├── search/        # البحث
│   ├── login/         # تسجيل الدخول
│   ├── signup/        # إنشاء حساب
│   ├── privacy/       # سياسة الخصوصية
│   ├── terms/         # الشروط والأحكام
│   ├── contact/       # تواصل معنا
│   └── admin/         # لوحة التحكم
├── routes/            # إعداد التوجيه (AppRouter)
├── services/          # إعداد Axios + Stripe
├── store/             # Redux Store والـ Slices
│   ├── auth/          # حالة المصادقة
│   ├── cart/          # حالة السلة
│   ├── categories/    # حالة الفئات
│   ├── products/      # حالة المنتجات
│   ├── wishlist/      # حالة الأمنيات
│   ├── orders/        # حالة الطلبات
│   ├── offers/        # حالة العروض
│   ├── search/        # حالة البحث
│   └── toasts/        # حالة الإشعارات
├── styles/            # الملفات العامة للتنسيق
├── types/             # TypeScript types و interfaces
├── util/              # دوال مساعدة
└── validations/       # مخططات التحقق (Zod Schemas)
```

---

## 🚀 التقنيات المستخدمة

### ⚛️ الواجهة الأمامية (Frontend)
| التقنية | الإصدار | الغرض |
|---|---|---|
| **React** | 18.2 | بناء واجهة المستخدم |
| **TypeScript** | 5.2 | الكتابة الصارمة وسلامة الأنواع |
| **Vite** | 5.0 | بيئة التطوير وبناء المشروع |
| **React Router DOM** | 6.21 | التوجيه بين الصفحات |
| **TailwindCSS** | 3.4 | التنسيق بـ Utility Classes |

### 🗄️ إدارة الحالة (State Management)
| التقنية | الإصدار | الغرض |
|---|---|---|
| **Redux Toolkit** | 2.0 | إدارة الحالة العامة للتطبيق |
| **React Redux** | 9.1 | ربط Redux مع React |
| **Redux Persist** | 6.0 | الاحتفاظ ببيانات السلة والمصادقة في LocalStorage |

### 🔥 الخلفية والخدمات (Backend & Services)
| التقنية | الإصدار | الغرض |
|---|---|---|
| **Firebase Realtime DB** | 11.10 | قاعدة البيانات (المنتجات، الطلبات، التقييمات) |
| **Firebase Auth** | 11.10 | المصادقة وإدارة المستخدمين |
| **Stripe** | — | بوابة الدفع بالبطاقة (Visa/Mastercard/Amex) |
| **Axios** | 1.6 | طلبات HTTP |
| **ImgBB API** | — | رفع صور المنتجات للسحابة |

### 📝 النماذج والتحقق (Forms & Validation)
| التقنية | الإصدار | الغرض |
|---|---|---|
| **React Hook Form** | 7.60 | إدارة النماذج بأداء عالٍ |
| **Zod** | 3.25 | التحقق من صحة البيانات (Schema Validation) |
| **@hookform/resolvers** | 5.1 | ربط Zod مع React Hook Form |

---

## ⚙️ طريقة تشغيل المشروع

### المتطلبات المسبقة
- Node.js (النسخة 18 أو أحدث)
- npm أو yarn
- حساب Firebase مع Realtime Database مفعّل
- حساب Stripe (Publishable Key)

### خطوات التشغيل

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd advancedE-commerce

# 2. تثبيت الاعتماديات
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env
# ثم عدّل القيم في ملف .env

# 4. تشغيل سيرفر التطوير
npm run dev
```

### متغيرات البيئة `.env`

```env
# Firebase Realtime Database URL
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# Stripe Publishable Key (pk_test_... أو pk_live_...)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
```

> **⚠️ تنبيه:** لا تشارك ملف `.env` أو تضيفه إلى Git. المشروع يتضمن `.env.example` كمرجع.

### السكريبتات المتاحة
```bash
npm run dev      # تشغيل بيئة التطوير
npm run build    # بناء المشروع للإنتاج
npm run preview  # معاينة نسخة الإنتاج
npm run lint     # فحص جودة الكود
```

---

## 🔗 صفحات التطبيق (Routes)

| المسار | الصفحة | الحماية |
|---|---|---|
| `/` | الصفحة الرئيسية | عام |
| `/categories` | جميع الفئات | عام |
| `/categories/products/:prefix` | منتجات فئة معينة | عام |
| `/product/:id` | تفاصيل المنتج + التقييمات | عام |
| `/offers` | العروض والخصومات | عام |
| `/cart` | سلة المشتريات | عام |
| `/wishlist` | قائمة الأمنيات | عام |
| `/search` | البحث | عام |
| `/login` | تسجيل الدخول | عام |
| `/register` | إنشاء حساب | عام |
| `/privacy` | سياسة الخصوصية | عام |
| `/terms` | الشروط والأحكام | عام |
| `/contact` | تواصل معنا | عام |
| `/profile` | الحساب الشخصي | 🔒 مسجّل دخول |
| `/profile/orders` | سجل الطلبات | 🔒 مسجّل دخول |
| `/admin` | لوحة التحكم | 🔒 أدمن فقط |

---

## 🏗️ النقاط المعمارية المميزة

- **Lazy Loading**: جميع الصفحات محمّلة بشكل كسول (`React.lazy`) لتحسين الأداء.
- **Code Splitting**: تقسيم الكود تلقائياً عبر Vite.
- **Path Aliases**: استخدام `@pages`, `@components`, `@store`, إلخ بدلاً من المسارات النسبية.
- **Persistence**: بيانات السلة وقائمة الأمنيات وبيانات تسجيل الدخول محفوظة في المتصفح حتى بعد الإغلاق.
- **Protected Routes**: حماية الصفحات الحساسة من الوصول غير المصرح به.
- **Firebase Reviews**: نظام تقييمات حقيقي — يتحقق من سجل الطلبات قبل السماح بالكتابة.
- **Stripe createPortal**: نافذة الدفع تُعرض فوق جميع العناصر بـ `z-[9999]` لتجنب تعارض z-index.
- **ENV Variables**: جميع المفاتيح الحساسة (Firebase, Stripe) محفوظة في `.env` ومحمية من Git.

---

## 🔑 حساب الأدمن التجريبي

في صفحة تسجيل الدخول يوجد زر **"Use Admin Credentials"** يملأ الفورم تلقائياً:

| | |
|---|---|
| **Email** | `monud0987a@gmail.com` |
| **Password** | `Qqwe123!@#` |

---

## 👤 صاحب المشروع

تم بناء هذا المشروع كمشروع تعليمي متقدم لإتقان بناء تطبيقات React الكاملة مع Redux Toolkit وFirebase وStripe.

---

<div align="center">
  صُنع بـ ❤️ باستخدام React + TypeScript + Redux Toolkit + TailwindCSS + Firebase + Stripe
</div>
