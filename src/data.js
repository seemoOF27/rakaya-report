// بيانات أولية (Seed data) — أول تعبئة فقط، بعدها التحكم يصير من لوحة التحكم

// اسم المؤسسة (ثابت)
export const ORG = 'ركايا للاستشارات'

export const REPORT_META = {
  org: ORG,
  title: 'تقرير موسم الحج',
  season: '1446 هـ - 2025 م',
  intro:
    'تقرير شامل يستعرض أعمال الفريق خلال موسم الحج، من الإعداد والتنظيم حتى التنفيذ الميداني، مرورًا بأبرز الأحداث والإنجازات والتحديات والتوصيات.',
}

export const CONCLUSION = {
  title: 'شكرًا لكل من أسهم في إنجاح الموسم',
  text:
    'بفضل تكامل جهود الفريق وتفاني الأعضاء، تمكنّا من تقديم خدمة تليق بضيوف الرحمن خلال موسم الحج. حقق الفريق نتائج مميزة على مستوى الجاهزية والتنفيذ ورضا المستفيدين، وما رُصد من تحديات وتوصيات يشكّل أساسًا متينًا لمواسم أكثر تميزًا بإذن الله.',
  sign: '— فريق ركايا للاستشارات',
}

// الأقسام التي يمكن اختيار طريقة عرض/ترتيب عناصرها
export const LAYOUT_SECTIONS = [
  { key: 'team', label: 'الفريق' },
  { key: 'stats', label: 'الإحصائيات' },
  { key: 'timeline', label: 'الأحداث' },
  { key: 'challenges', label: 'التحديات' },
  { key: 'gallery', label: 'المعرض' },
  { key: 'recommendations', label: 'التوصيات' },
]

// خيارات التخطيط (شكل عرض العناصر) لكل قسم
export const LAYOUTS = {
  team: [
    { key: 'grid', label: 'شبكة كروت' },
    { key: 'list', label: 'قائمة صفوف' },
    { key: 'compact', label: 'مدمج' },
  ],
  stats: [
    { key: 'cards', label: 'كروت' },
    { key: 'strip', label: 'شريط أفقي' },
  ],
  timeline: [
    { key: 'vertical', label: 'عمودي' },
    { key: 'alternating', label: 'متناوب (يمين/يسار)' },
    { key: 'cards', label: 'كروت بدون خط' },
  ],
  challenges: [
    { key: 'grid', label: 'شبكة' },
    { key: 'list', label: 'قائمة' },
  ],
  gallery: [
    { key: 'carousel', label: 'كاروسيل' },
    { key: 'grid', label: 'شبكة منتظمة' },
    { key: 'masonry', label: 'متداخل (Masonry)' },
  ],
  recommendations: [
    { key: 'cards', label: 'كروت مرقّمة' },
    { key: 'list', label: 'قائمة' },
  ],
}

export const DEFAULT_LAYOUTS = {
  team: 'grid',
  stats: 'cards',
  timeline: 'vertical',
  challenges: 'grid',
  gallery: 'carousel',
  recommendations: 'cards',
}

export const TEAM = [
  { id: 1, name: 'عبدالله الحربي', role: 'مدير المشروع', type: 'full', dept: 'الإدارة' },
  { id: 2, name: 'سارة القحطاني', role: 'منسقة العمليات الميدانية', type: 'full', dept: 'العمليات' },
  { id: 3, name: 'محمد العتيبي', role: 'مشرف ميداني', type: 'season', dept: 'الميدان' },
  { id: 4, name: 'نورة الزهراني', role: 'مسؤولة الجودة والرقابة', type: 'part', dept: 'الجودة' },
  { id: 5, name: 'فهد الدوسري', role: 'محلل بيانات', type: 'part', dept: 'البيانات' },
  { id: 6, name: 'ريم الشمري', role: 'منسقة الإرشاد والتوعية', type: 'season', dept: 'الإرشاد' },
  { id: 7, name: 'خالد المالكي', role: 'مسؤول الدعم اللوجستي', type: 'season', dept: 'اللوجستيات' },
  { id: 8, name: 'لمى السبيعي', role: 'أخصائية تجربة المستفيد', type: 'full', dept: 'التجربة' },
]

// أنواع العمل
export const WORK_TYPES = {
  lead: { label: 'قائد', color: '#0b3b41', bg: '#dbe8e9' },
  itmgr: { label: 'مدير قسم تقنية المعلومات', color: '#0e7490', bg: '#e0f2f4' },
  full: { label: 'دوام كامل', color: '#0d6e57', bg: '#e6f2ee' },
  part: { label: 'دوام جزئي', color: '#566b6e', bg: '#eef2f2' },
  season: { label: 'موسمي', color: '#2563a8', bg: '#e4eefb' },
  partseason: { label: 'دوام جزئي موسمي', color: '#4b7a99', bg: '#e7eff5' },
}

export const STATS = [
  { id: 1, value: 12500, suffix: '+', label: 'مستفيد تمت خدمته', icon: 'users' },
  { id: 2, value: 38, suffix: '', label: 'يوم عمل ميداني', icon: 'calendar' },
  { id: 3, value: 24, suffix: '', label: 'فعالية ومبادرة', icon: 'flag' },
  { id: 4, value: 98, suffix: '%', label: 'نسبة رضا المستفيدين', icon: 'star' },
]

// أحداث افتراضية للتايملاين (تقدر تستبدلها برفع ملف اكسل)
export const SEED_EVENTS = [
  {
    id: 'e1',
    date: '2025-05-20',
    title: 'انطلاق الإعداد والتجهيز',
    description: 'بدء اجتماعات التخطيط وتوزيع الأدوار وتجهيز المواقع الميدانية استعدادًا للموسم.',
    images: [],
  },
  {
    id: 'e2',
    date: '2025-05-28',
    title: 'تدريب الفريق الميداني',
    description: 'برنامج تدريبي مكثف للفريق على الإجراءات التشغيلية ومعايير الجودة والسلامة.',
    images: [],
  },
  {
    id: 'e3',
    date: '2025-06-04',
    title: 'بدء استقبال المستفيدين',
    description: 'تشغيل نقاط الخدمة الرئيسية وبدء استقبال الحجاج وتقديم الخدمات الإرشادية.',
    images: [],
  },
  {
    id: 'e4',
    date: '2025-06-06',
    title: 'يوم الذروة التشغيلية',
    description: 'أعلى معدل خدمة خلال الموسم مع تكثيف الفرق الميدانية وزيادة ساعات العمل.',
    images: [],
  },
  {
    id: 'e5',
    date: '2025-06-10',
    title: 'الإغلاق والتقييم',
    description: 'إنهاء الأعمال الميدانية وجمع البيانات وإجراء جلسة التقييم الختامية للفريق.',
    images: [],
  },
]

export const CHALLENGES = [
  {
    id: 1,
    title: 'الزحام في أوقات الذروة',
    text: 'ارتفاع كثافة المستفيدين في ساعات محددة، تمت معالجته بإعادة توزيع الفرق وتوسيع نقاط الخدمة.',
  },
  {
    id: 2,
    title: 'الظروف المناخية',
    text: 'ارتفاع درجات الحرارة أثّر على سير العمل الميداني، فتمت إضافة نقاط تبريد وجداول مناوبات مرنة.',
  },
  {
    id: 3,
    title: 'التنسيق بين الجهات',
    text: 'تعدد الجهات المشاركة تطلّب قنوات تواصل أوضح، فتم اعتماد غرفة عمليات موحدة للمتابعة.',
  },
]

export const GALLERY = [
  { id: 1, color: '#0d6e57', caption: 'الفريق الميداني' },
  { id: 2, color: '#1f6f63', caption: 'نقاط الخدمة' },
  { id: 3, color: '#0a4f3f', caption: 'الإرشاد والتوعية' },
  { id: 4, color: '#2563a8', caption: 'غرفة العمليات' },
  { id: 5, color: '#c9b171', caption: 'التكريم الختامي' },
  { id: 6, color: '#073328', caption: 'لقطات من الموسم' },
]

export const RECOMMENDATIONS = [
  {
    id: 1,
    title: 'التوسع في الأتمتة',
    text: 'اعتماد حلول رقمية أوسع لتسجيل ومتابعة الخدمات تقليلًا للأخطاء واختصارًا للوقت.',
  },
  {
    id: 2,
    title: 'تدريب مبكر للفريق',
    text: 'بدء برامج التدريب قبل الموسم بوقت كافٍ لرفع الجاهزية التشغيلية للفريق الميداني.',
  },
  {
    id: 3,
    title: 'تعزيز فرق الذروة',
    text: 'زيادة عدد أفراد الفريق في أيام الذروة المتوقعة بناءً على بيانات المواسم السابقة.',
  },
  {
    id: 4,
    title: 'غرفة عمليات موحدة',
    text: 'تثبيت نموذج غرفة العمليات الموحدة لتسريع التنسيق واتخاذ القرار بين الجهات.',
  },
]
