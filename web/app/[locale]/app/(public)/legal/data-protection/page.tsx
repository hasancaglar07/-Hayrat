import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; updatedAt: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Veri Koruma (KVKK & GDPR) Aydınlatması",
    description: "Kişisel verilerinizin korunmasına ilişkin temel ilkelerimiz ve yasal haklarınız.",
    updatedAt: "Son güncelleme: 12 Aralık 2025",
    sections: [
      {
        heading: "Veri Sorumlusu",
        body: [
          "Bu Uygulama, Delail-i Hayrat Takip ekibi tarafından işletilmektedir. Veri sorumlusu olarak kişisel verilerinizin güvenliğini önemseriz.",
          "Resmî iletişim kanalları İletişim sayfasında paylaşılır ve güncel tutulur.",
        ],
      },
      {
        heading: "İşleme İlkeleri",
        body: [
          "Verileriniz hukuka ve dürüstlük kurallarına uygun, doğru ve güncel, belirli ve meşru amaçlarla sınırlı olarak işlenir.",
        ],
        bullets: [
          "Amaçla sınırlılık ve ölçülülük",
          "Gizlilik ve güvenlik",
          "Şeffaflık ve hesap verebilirlik",
        ],
      },
      {
        heading: "İşlenen Veriler ve Hukuki Sebep",
        body: [
          "E‑posta ve hesap bilgileri sözleşmenin ifası için; okuma kayıtları ve ayar verileri ise hizmetin sunulması ve geliştirilmesi için işlenir.",
          "Global sıralama gibi topluluk özellikleri yalnızca açık rızanızla aktif olur.",
        ],
      },
      {
        heading: "Yurt Dışına Aktarım",
        body: [
          "Altyapı sağlayıcılarımız yurt dışında yer alabilir. Bu durumda veriler, KVKK/GDPR hükümlerine uygun güvenlik önlemleriyle aktarılır.",
        ],
      },
      {
        heading: "Saklama ve İmha",
        body: [
          "Verileriniz, hesabınız aktif olduğu müddetçe saklanır. Silme talebiniz veya hesabın kapanması hâlinde, yasal zorunluluklar hariç olmak üzere silinir veya anonimleştirilir.",
        ],
      },
      {
        heading: "Haklarınız",
        body: [
          "KVKK ve GDPR kapsamında; verilerinize erişme, düzeltme, silme, işlemeyi kısıtlama, itiraz etme ve veri taşınabilirliği gibi haklara sahipsiniz.",
          "Taleplerinizi İletişim sayfası üzerinden bize iletebilirsiniz.",
        ],
      },
      {
        heading: "Şikâyet ve Başvuru",
        body: [
          "Başvurularınızın sonuçlanmaması hâlinde, ilgili veri koruma otoritelerine şikâyette bulunma hakkınız saklıdır.",
        ],
      },
    ],
  },
  en: {
    title: "Data Protection Notice (KVKK & GDPR)",
    description: "Our core principles for protecting your data and your legal rights.",
    updatedAt: "Last updated: 12 Dec 2025",
    sections: [
      {
        heading: "Data Controller",
        body: [
          "The App is operated by the Delail-i Hayrat Tracker team, acting as the data controller.",
          "Official contact channels are listed on the Contact page.",
        ],
      },
      {
        heading: "Processing Principles",
        body: [
          "We process data lawfully, fairly, and transparently, limited to specific and legitimate purposes.",
        ],
        bullets: ["Purpose limitation", "Data minimization", "Security and confidentiality"],
      },
      {
        heading: "Legal Basis",
        body: [
          "Email/account data is processed to provide the service; reading records and settings are processed to run and improve the App.",
          "Community features like global rankings require your explicit opt‑in.",
        ],
      },
      {
        heading: "International Transfers",
        body: [
          "Some infrastructure providers may be located abroad. Transfers are protected through appropriate safeguards under KVKK/GDPR.",
        ],
      },
      {
        heading: "Retention",
        body: [
          "We keep data while your account is active and delete or anonymize it upon deletion requests unless required by law.",
        ],
      },
      {
        heading: "Your Rights",
        body: [
          "You have rights to access, rectify, erase, restrict, object, and receive a portable copy of your data.",
          "Submit requests via the Contact page.",
        ],
      },
    ],
  },
  ar: {
    title: "إشعار حماية البيانات (KVKK و GDPR)",
    description: "مبادئنا الأساسية لحماية البيانات وحقوقك القانونية.",
    updatedAt: "آخر تحديث: 12 ديسمبر 2025",
    sections: [
      {
        heading: "مسؤول البيانات",
        body: [
          "يُدار التطبيق من قبل فريق متابعة دلائل الخيرات بصفته مسؤولاً عن البيانات.",
          "قنوات التواصل الرسمية في صفحة التواصل.",
        ],
      },
      {
        heading: "مبادئ المعالجة",
        body: [
          "نعالج البيانات بصورة قانونية وشفافة وبما يتناسب مع الغرض المحدد.",
        ],
        bullets: ["تحديد الغرض", "تقليل البيانات", "الأمان والسرية"],
      },
      {
        heading: "الأساس القانوني",
        body: [
          "نعالج البريد الإلكتروني وبيانات الحساب لتقديم الخدمة، وبيانات القراءة والإعدادات لتشغيل التطبيق وتحسينه.",
          "ميزات المجتمع مثل لوحة الصدارة تتطلب موافقتك الصريحة.",
        ],
      },
      {
        heading: "النقل خارج البلد",
        body: [
          "قد يكون بعض مزودي البنية التحتية خارج بلدك، ويتم النقل بضمانات مناسبة وفق KVKK/GDPR.",
        ],
      },
      {
        heading: "الاحتفاظ والحقوق",
        body: [
          "نحتفظ بالبيانات ما دام الحساب نشطاً ونحذفها أو نجهلها عند طلب الحذف إلا إذا تطلب القانون ذلك.",
          "لك الحق في الوصول والتصحيح والحذف والاعتراض ونقل البيانات. قدّم الطلب عبر صفحة التواصل.",
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
    path: "/app/legal/data-protection",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function DataProtectionPage({ params }: { params: { locale: Locale } }) {
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
