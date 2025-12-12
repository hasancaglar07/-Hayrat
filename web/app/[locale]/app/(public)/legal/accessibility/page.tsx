import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; updatedAt: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Erişilebilirlik Beyanı",
    description: "Delail-i Hayrat Takip herkes için erişilebilir bir deneyim sunmayı hedefler.",
    updatedAt: "Son güncelleme: 12 Aralık 2025",
    sections: [
      {
        heading: "Taahhüdümüz",
        body: [
          "Uygulama, farklı ihtiyaçlara sahip kullanıcıların rahatça faydalanabilmesi için erişilebilirlik ilkelerini gözetir.",
          "Hedefimiz, Web Content Accessibility Guidelines (WCAG) 2.1 AA seviyesine mümkün olduğunca uyum sağlamaktır.",
        ],
      },
      {
        heading: "Mevcut Erişilebilirlik Özellikleri",
        body: ["Uygulamada erişilebilirliği destekleyen bazı özellikler bulunmaktadır."],
        bullets: [
          "Yazı boyutu ve satır aralığı ayarları",
          "Koyu/sepya temalar ile kontrast seçenekleri",
          "Arapça için RTL (sağdan sola) destekli arayüz",
          "Klavye ile gezinmeye uygun temel yapı",
        ],
      },
      {
        heading: "Geri Bildirim",
        body: [
          "Erişilebilirlikle ilgili bir sorun fark ederseniz veya öneriniz varsa lütfen İletişim sayfasından bize bildirin.",
          "Geri bildirimler, geliştirme önceliklerimizi belirlememizde önemli rol oynar.",
        ],
      },
    ],
  },
  en: {
    title: "Accessibility Statement",
    description: "Delail-i Hayrat Tracker aims to be usable by everyone.",
    updatedAt: "Last updated: 12 Dec 2025",
    sections: [
      {
        heading: "Our Commitment",
        body: [
          "We strive to follow accessibility best practices so that users with different needs can benefit from the App.",
          "Our goal is to align with WCAG 2.1 AA where reasonably possible.",
        ],
      },
      {
        heading: "Current Features",
        body: ["Accessibility‑supporting features include:"],
        bullets: [
          "Font size and line‑height controls",
          "Dark/sepia themes for contrast",
          "RTL layout for Arabic",
          "Basic keyboard navigation support",
        ],
      },
      {
        heading: "Feedback",
        body: [
          "If you encounter accessibility issues, please let us know via the Contact page.",
        ],
      },
    ],
  },
  ar: {
    title: "بيان إمكانية الوصول",
    description: "يهدف تطبيق متابعة دلائل الخيرات لتقديم تجربة مناسبة للجميع.",
    updatedAt: "آخر تحديث: 12 ديسمبر 2025",
    sections: [
      {
        heading: "التزامنا",
        body: [
          "نسعى لاتباع أفضل ممارسات إمكانية الوصول ليتمكن المستخدمون بمختلف احتياجاتهم من الاستفادة من التطبيق.",
          "هدفنا الاقتراب من معيار WCAG 2.1 AA قدر الإمكان.",
        ],
      },
      {
        heading: "ميزات حالية",
        body: ["من الميزات الداعمة لإمكانية الوصول:"],
        bullets: [
          "التحكم بحجم الخط وارتفاع السطر",
          "سمات داكنة/سيبيا لزيادة التباين",
          "واجهة RTL للعربية",
          "دعم أساسي للتنقل عبر لوحة المفاتيح",
        ],
      },
      {
        heading: "الملاحظات",
        body: [
          "إذا واجهت مشكلة في إمكانية الوصول يرجى إبلاغنا عبر صفحة التواصل.",
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
    path: "/app/legal/accessibility",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function AccessibilityPage({ params }: { params: { locale: Locale } }) {
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
