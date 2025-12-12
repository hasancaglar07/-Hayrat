import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; updatedAt: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Kullanım Şartları",
    description:
      "Delail-i Hayrat Takip uygulamasını kullanarak aşağıdaki şartları kabul etmiş olursunuz. Lütfen dikkatlice okuyun.",
    updatedAt: "Son güncelleme: 12 Aralık 2025",
    sections: [
      {
        heading: "Hizmet Tanımı",
        body: [
          "Uygulama, Delail-i Hayrat okuma günlerinizi, kaza okumalarınızı ve hedeflerinizi takip etmenizi sağlayan bir dijital takip aracıdır.",
          "Hizmet ücretsiz olarak sunulabilir; özellikler zaman içinde geliştirilebilir veya değiştirilebilir.",
        ],
      },
      {
        heading: "Hesap ve Sorumluluklar",
        body: [
          "Hesabınızı açarken verdiğiniz bilgilerin doğru olmasından ve hesabınızın güvenliğinden siz sorumlusunuz.",
          "Hesabınıza erişim sağlanan cihazlarda güvenlik önlemlerini almak (şifreli cihaz, güvenilir e-posta vb.) kullanıcı sorumluluğundadır.",
        ],
      },
      {
        heading: "Kabul Edilebilir Kullanım",
        body: [
          "Uygulamayı yalnızca kişisel, manevi okuma takibi amacıyla kullanabilirsiniz.",
        ],
        bullets: [
          "Hizmeti bozacak, aşırı yükleyecek veya güvenliğini tehlikeye atacak davranışlarda bulunmamak.",
          "Yanıltıcı kimlik, nefret söylemi, hakaret, spam veya hukuka aykırı içerik üretmemek.",
          "Başka kullanıcıların verilerine izinsiz erişmeye çalışmamak.",
        ],
      },
      {
        heading: "Topluluk ve Sıralama",
        body: [
          "Global sıralamada adınızın görünmesi isteğe bağlıdır. Bu özelliği açmanız hâlinde kullanıcı adınız ve puan/streak bilgileriniz diğer kullanıcılarla paylaşılır.",
          "Uygulama, sıralama verilerinin doğruluğunu artırmak için gerekli kontrolleri yapar; ancak nihai sorumluluk kullanıcı beyanına dayanır.",
        ],
      },
      {
        heading: "Fikri Mülkiyet",
        body: [
          "Uygulamanın yazılımı, tasarımı ve marka unsurları Delail-i Hayrat Takip ekibine aittir veya lisanslıdır. İzinsiz kopyalanamaz, çoğaltılamaz ya da ticari amaçla kullanılamaz.",
          "Uygulama içinde yer alan dini metinlerin telif hakları ilgili yayınevleri ve hak sahiplerine aittir; Uygulama bu metinler üzerinde mülkiyet iddia etmez.",
        ],
      },
      {
        heading: "Sorumluluğun Sınırlandırılması",
        body: [
          "Uygulama “olduğu gibi” sunulur. Kesintisiz veya hatasız çalışacağına dair garanti verilmez.",
          "Manevi faydalar ve sonuçlar kişiden kişiye değişebilir; Uygulama bu konularda taahhütte bulunmaz.",
        ],
      },
      {
        heading: "Hizmetin Sonlandırılması",
        body: [
          "Şartlara aykırı kullanım tespit edilirse hesabınız uyarı olmaksızın askıya alınabilir veya kapatılabilir.",
          "Hesabınızı dilediğiniz zaman silebilir ve verilerinizin kaldırılmasını talep edebilirsiniz.",
        ],
      },
      {
        heading: "Uygulanacak Hukuk",
        body: [
          "Bu şartlar Türkiye Cumhuriyeti hukuku uyarınca yorumlanır. Taraflar arasında çıkabilecek ihtilaflarda İstanbul (Merkez) mahkemeleri ve icra daireleri yetkilidir.",
        ],
      },
    ],
  },
  en: {
    title: "Terms of Use",
    description: "By using Delail-i Hayrat Tracker, you agree to these terms. Please read carefully.",
    updatedAt: "Last updated: 12 Dec 2025",
    sections: [
      {
        heading: "Service Description",
        body: [
          "The App provides tools to track your Delail-i Hayrat readings, makeup days, goals, and motivation stats.",
          "Features may evolve over time. Access is currently provided free of charge unless stated otherwise.",
        ],
      },
      {
        heading: "Account Responsibilities",
        body: [
          "You are responsible for providing accurate information and keeping your account secure.",
          "Please ensure that the email and devices you use are under your control.",
        ],
      },
      {
        heading: "Acceptable Use",
        body: ["Use the App only for personal reading‑tracking purposes."],
        bullets: [
          "Do not attempt to disrupt, overload, or compromise the service.",
          "Do not post unlawful, abusive, hateful, or misleading content.",
          "Do not try to access other users’ data without permission.",
        ],
      },
      {
        heading: "Community & Rankings",
        body: [
          "Showing your name on global rankings is optional. If you opt in, your nickname and points/streaks are visible to others.",
          "We aim to keep rankings fair but they rely on user input.",
        ],
      },
      {
        heading: "Intellectual Property",
        body: [
          "The App’s software, design, and brand elements are owned or licensed by us and may not be copied or used commercially without permission.",
          "Religious texts shown in the App belong to their respective rights holders; we do not claim ownership.",
        ],
      },
      {
        heading: "Disclaimers and Liability",
        body: [
          "The App is provided “as is” without warranties of uninterrupted or error‑free operation.",
          "Spiritual outcomes depend on personal practice; the App makes no guarantees.",
        ],
      },
      {
        heading: "Termination",
        body: [
          "We may suspend or terminate accounts that violate these terms.",
          "You may delete your account at any time.",
        ],
      },
    ],
  },
  ar: {
    title: "شروط الاستخدام",
    description: "باستخدام تطبيق متابعة دلائل الخيرات فإنك توافق على هذه الشروط. يرجى قراءتها بعناية.",
    updatedAt: "آخر تحديث: 12 ديسمبر 2025",
    sections: [
      {
        heading: "وصف الخدمة",
        body: [
          "يوفر التطبيق أدوات لمتابعة قراءتك اليومية، وقراءات القضاء، والأهداف الأسبوعية، وإحصاءات التحفيز.",
          "قد تتغير الميزات مع الوقت، ويُقدَّم الوصول مجانًا ما لم يُذكر خلاف ذلك.",
        ],
      },
      {
        heading: "مسؤوليات الحساب",
        body: [
          "أنت مسؤول عن صحة المعلومات وحماية حسابك.",
          "احرص على استخدام بريد وأجهزة تحت سيطرتك.",
        ],
      },
      {
        heading: "الاستخدام المقبول",
        body: ["استخدم التطبيق للمتابعة الشخصية فقط."],
        bullets: [
          "عدم محاولة تعطيل الخدمة أو اختراقها.",
          "عدم نشر محتوى مخالف أو مسيء أو مضلل.",
          "عدم محاولة الوصول لبيانات الآخرين دون إذن.",
        ],
      },
      {
        heading: "المجتمع ولوحة الصدارة",
        body: [
          "إظهار الاسم في لوحة الصدارة اختياري. عند تفعيل ذلك يظهر اسم المستخدم والنقاط والسلسلة للآخرين.",
          "نسعى للإنصاف لكن لوحة الصدارة تعتمد على إدخال المستخدم.",
        ],
      },
      {
        heading: "الملكية الفكرية",
        body: [
          "البرمجيات والتصميم والعلامة التجارية للتطبيق مملوكة لنا أو مرخصة، ولا يجوز نسخها دون إذن.",
          "النصوص الدينية المعروضة تعود حقوقها لأصحابها ولا ندعي ملكيتها.",
        ],
      },
      {
        heading: "إخلاء المسؤولية",
        body: [
          "يُقدَّم التطبيق كما هو دون ضمانات لعدم الانقطاع أو خلوه من الأخطاء.",
          "النتائج الروحية مرتبطة بالممارسة الشخصية ولا يضمنها التطبيق.",
        ],
      },
      {
        heading: "إنهاء الخدمة",
        body: [
          "قد نوقف الحسابات المخالفة للشروط.",
          "يمكنك حذف حسابك في أي وقت.",
        ],
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  const page = content[params.locale] ?? content.tr!;
  return createPageMetadata({
    locale: params.locale,
    path: "/app/legal/terms-of-use",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function TermsOfUsePage({ params }: { params: { locale: Locale } }) {
  const page = content[params.locale] ?? content.tr!;
  const t = getMessages(params.locale);
  return (
    <LongFormArticle
      kicker={t.footer.sections.legal.title}
      title={page.title}
      description={page.description}
      updatedAt={page.updatedAt}
      sections={page.sections}
    />
  );
}
