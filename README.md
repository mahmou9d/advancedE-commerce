# 🛒 PrimeEcom — متجر إلكتروني متكامل

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-11.10-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</div>

---

## 📖 نبذة عن المشروع

**PrimeEcom** هو تطبيق ويب متكامل لمتجر إلكتروني (E-Commerce) مبني بتقنيات حديثة. يتيح للمستخدمين تصفح المنتجات وإضافتها للسلة أو قائمة الأمنيات، وإتمام الطلبات — كل ذلك من خلال واجهة مستخدم سلسة وسريعة الاستجابة.

يحتوي المشروع كذلك على **لوحة تحكم للأدمن** تتيح إضافة المنتجات وتعديلها وحذفها بشكل مباشر.

---

## ✨ المميزات الرئيسية

### 🛍️ للمستخدم العادي
| الميزة | الوصف |
|---|---|
| 🏠 **الصفحة الرئيسية** | Hero Section مع إحصائيات وبطاقات مميزات الموقع |
| 📦 **تصفح المنتجات** | عرض منتجات مصنّفة حسب الفئات (أحذية، إلكترونيات، رياضة، أطفال، نساء، رجال) |
| 🔍 **البحث** | البحث عن المنتجات بالاسم في الوقت الفعلي |
| 🎁 **العروض** | صفحة مخصصة لعرض المنتجات المخفّضة |
| 🛒 **سلة المشتريات** | إضافة/إزالة منتجات، تحديث الكميات، عرض الإجمالي |
| ❤️ **قائمة الأمنيات** | حفظ المنتجات المفضلة للرجوع إليها لاحقاً |
| 👤 **الحساب الشخصي** | عرض بيانات المستخدم وإدارة الحساب |
| 📋 **الطلبات** | عرض سجل الطلبات السابقة |

### 🔐 المصادقة (Authentication)
- تسجيل حساب جديد (Register) مع التحقق من البيانات عبر **Zod + React Hook Form**
- تسجيل الدخول (Login)
- حماية الصفحات الخاصة عبر `ProtectedRoute`

### 🛠️ لوحة تحكم الأدمن
- إضافة منتج جديد مع رفع الصورة عبر **ImgBB API**
- تعديل بيانات منتج موجود
- حذف منتج بتأكيد

---

## 🗂️ هيكل المشروع

```
src/
├── assets/          # الصور والأصول الثابتة
├── components/      # المكوّنات المشتركة وقابلة إعادة الاستخدام
│   ├── Auth/        # مكوّنات المصادقة (ProtectedRoute)
│   ├── common/      # مكوّنات عامة (Navbar, Footer, ...)
│   ├── eCommerce/   # مكوّنات المتجر (Product, Cart, Wishlist, ...)
│   ├── feedback/    # مكوّنات التغذية الراجعة (Loading, Skeleton, ...)
│   └── form/        # مكوّنات النماذج
├── hooks/           # Custom Hooks مخصصة
├── layouts/         # تخطيطات الصفحات (MainLayout, ProfileLayout)
├── pages/           # صفحات التطبيق
│   ├── home/        # الصفحة الرئيسية
│   ├── category/    # صفحة الفئات
│   ├── products/    # صفحة المنتجات
│   ├── offers/      # صفحة العروض
│   ├── cart/        # سلة المشتريات
│   ├── wishlist/    # قائمة الأمنيات
│   ├── orders/      # الطلبات
│   ├── account/     # الحساب الشخصي
│   ├── search/      # البحث
│   ├── login/       # تسجيل الدخول
│   ├── signup/      # إنشاء حساب
│   └── admin/       # لوحة التحكم
├── routes/          # إعداد التوجيه (AppRouter)
├── services/        # إعداد Axios
├── store/           # Redux Store والـ Slices
│   ├── auth/        # حالة المصادقة
│   ├── cart/        # حالة السلة
│   ├── categories/  # حالة الفئات
│   ├── products/    # حالة المنتجات
│   ├── wishlist/    # حالة الأمنيات
│   ├── orders/      # حالة الطلبات
│   ├── offers/      # حالة العروض
│   ├── search/      # حالة البحث
│   └── toasts/      # حالة الإشعارات
├── styles/          # الملفات العامة للتنسيق
├── types/           # TypeScript types و interfaces
├── util/            # دوال مساعدة
└── validations/     # مخططات التحقق (Zod Schemas)
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

### 🗄️ إدارة الحالة (State Management)
| التقنية | الإصدار | الغرض |
|---|---|---|
| **Redux Toolkit** | 2.0 | إدارة الحالة العامة للتطبيق |
| **React Redux** | 9.1 | ربط Redux مع React |
| **Redux Persist** | 6.0 | الاحتفاظ ببيانات السلة والمصادقة في LocalStorage |
| **Immer** | 10.1 | تسهيل تعديل الحالة |

### 🔥 الخلفية والخدمات (Backend & Services)
| التقنية | الإصدار | الغرض |
|---|---|---|
| **Firebase** | 11.10 | المصادقة، قاعدة البيانات (Firestore/Realtime DB)، التخزين |
| **Axios** | 1.6 | طلبات HTTP |
| **JSON Server** | 0.17 | بيئة API تجريبية محلية |
| **ImgBB API** | — | رفع الصور المنتجات للسحابة |

### 📝 النماذج والتحقق (Forms & Validation)
| التقنية | الإصدار | الغرض |
|---|---|---|
| **React Hook Form** | 7.60 | إدارة النماذج بأداء عالٍ |
| **Zod** | 3.25 | التحقق من صحة البيانات (Schema Validation) |
| **@hookform/resolvers** | 5.1 | ربط Zod مع React Hook Form |

### 🎨 التنسيق والواجهة (UI & Styling)
| التقنية | الإصدار | الغرض |
|---|---|---|
| **Bootstrap** | 5.3 | نظام الشبكة والمكوّنات الأساسية |
| **React Bootstrap** | 2.10 | مكوّنات Bootstrap كـ React Components |
| **React Icons** | 5.5 | مكتبة الأيقونات |
| **Motion** | 12.23 | الأنيميشن والحركات |
| **React Content Loader** | 7.0 | Skeleton Loading |
| **Lottie Files** | 0.14 | الأنيميشن من ملفات Lottie |

---

## ⚙️ طريقة تشغيل المشروع

### المتطلبات المسبقة
- Node.js (النسخة 18 أو أحدث)
- npm أو yarn

### خطوات التشغيل

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd advancedE-commerce

# 2. تثبيت الاعتماديات
npm install

# 3. تشغيل سيرفر التطوير
npm run dev

# 4. (اختياري) تشغيل JSON Server كـ API محلية
npx json-server --watch db.json --port 5005
```

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
| `/offers` | العروض والخصومات | عام |
| `/cart` | سلة المشتريات | عام |
| `/wishlist` | قائمة الأمنيات | عام |
| `/search` | البحث | عام |
| `/login` | تسجيل الدخول | عام |
| `/register` | إنشاء حساب | عام |
| `/profile` | الحساب الشخصي | 🔒 مسجّل دخول |
| `/profile/orders` | الطلبات | 🔒 مسجّل دخول |
| `/admin` | لوحة التحكم | 🔒 أدمن |

---

## 🏗️ النقاط المعمارية المميزة

- **Lazy Loading**: جميع الصفحات محمّلة بشكل كسول (`React.lazy`) لتحسين الأداء.
- **Code Splitting**: تقسيم الكود تلقائياً عبر Vite.
- **Path Aliases**: استخدام `@pages`, `@components`, `@store`, إلخ بدلاً من المسارات النسبية.
- **Persistence**: بيانات السلة وقائمة الأمنيات وبيانات تسجيل الدخول محفوظة في المتصفح حتى بعد الإغلاق.
- **Protected Routes**: حماية الصفحات الحساسة من الوصول غير المصرح به.

---

## 👤 صاحب المشروع

تم بناء هذا المشروع كمشروع تعليمي متقدم لإتقان بناء تطبيقات React الكاملة مع Redux Toolkit وFirebase.

---

<div align="center">
  صُنع بـ ❤️ باستخدام React + TypeScript + Redux Toolkit
</div>