import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; updatedAt: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Güvenlik Politikası",
    description: "Hizmetimizi güvenli tutmak için benimsediğimiz uygulamalar ve kullanıcı sorumlulukları.",
    updatedAt: "Son güncelleme: 12 Aralık 2025",
    sections: [
      {
        heading: "Genel Yaklaşım",
        body: [
          "Uygulamada veri güvenliği ve gizliliği önceliklidir. Minimum veri ilkesine uyar, yalnızca takip için gerekli bilgileri işleriz.",
        ],
      },
      {
        heading: "Teknik Önlemler",
        body: ["Aşağıdaki teknik önlemleri uygularız:"],
        bullets: [
          "HTTPS ile şifreli veri aktarımı",
          "Sunucu tarafında erişim kontrolü ve yetkilendirme",
          "Düzenli güncelleme ve bağımlılık taramaları",
          "Yedekleme ve hata izleme mekanizmaları",
        ],
      },
      {
        heading: "Kullanıcı Sorumluluğu",
        body: ["Hesabınızın güvenliği için şu adımları öneririz:"],
        bullets: [
          "Hesabınıza bağlı e‑posta hesabınızı güvenli tutun.",
          "Paylaşımlı cihazlarda oturumunuzu kapatın.",
          "Şüpheli e‑posta veya bağlantılara tıklamayın.",
        ],
      },
      {
        heading: "Sorumlu Açık Bildirimi",
        body: [
          "Güvenlik açığı veya zafiyet tespit ederseniz, İletişim sayfası üzerinden bize detaylı bilgi gönderin. Bildirimlerinizi sorumlu açıklama prensipleriyle değerlendiririz.",
        ],
      },
    ],
  },
  en: {
    title: "Security Policy",
    description: "Practices we follow to keep the service secure.",
    updatedAt: "Last updated: 12 Dec 2025",
    sections: [
      {
        heading: "Our Approach",
        body: [
          "Security and privacy are priorities. We follow data‑minimization and process only what is necessary for tracking.",
        ],
      },
      {
        heading: "Technical Measures",
        body: ["We implement measures such as:"],
        bullets: ["HTTPS encryption", "Access controls", "Regular updates", "Backups and monitoring"],
      },
      {
        heading: "User Responsibilities",
        body: ["To protect your account:"],
        bullets: ["Keep your email secure", "Sign out on shared devices", "Avoid suspicious links"],
      },
      {
        heading: "Responsible Disclosure",
        body: [
          "If you find a vulnerability, report it via the Contact page with details. We handle reports responsibly.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة الأمان",
    description: "ممارساتنا للحفاظ على أمان الخدمة.",
    updatedAt: "آخر تحديث: 12 ديسمبر 2025",
    sections: [
      {
        heading: "منهجنا",
        body: [
          "الأمان والخصوصية أولوية. نعالج الحد الأدنى من البيانات اللازمة للمتابعة.",
        ],
      },
      {
        heading: "إجراءات تقنية",
        body: ["من الإجراءات المتبعة:"],
        bullets: ["تشفير HTTPS", "ضوابط الوصول", "تحديثات دورية", "نسخ احتياطي ومراقبة"],
      },
      {
        heading: "مسؤوليات المستخدم",
        body: ["لحماية حسابك:"],
        bullets: ["حافظ على بريدك آمناً", "سجل الخروج في الأجهزة المشتركة", "تجنب الروابط المشبوهة"],
      },
      {
        heading: "الإبلاغ المسؤول",
        body: [
          "إذا اكتشفت ثغرة يرجى إبلاغنا عبر صفحة التواصل مع التفاصيل.",
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
    path: "/app/legal/security",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function SecurityPage({ params }: { params: { locale: Locale } }) {
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
