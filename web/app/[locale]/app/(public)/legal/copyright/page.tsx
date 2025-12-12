import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; updatedAt: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Telif ve İzinler",
    description: "Uygulama içeriğinin telif hakları ve kullanım şartları.",
    updatedAt: "Son güncelleme: 12 Aralık 2025",
    sections: [
      {
        heading: "Uygulama Hakları",
        body: [
          "Delail-i Hayrat Takip yazılımı, tasarımı ve marka unsurları telif hakkı ile korunur. İzinsiz çoğaltılamaz veya ticari amaçla kullanılamaz.",
        ],
      },
      {
        heading: "Dini Metinler",
        body: [
          "Uygulamada yer alan Delail-i Hayrat metinlerinin telif ve neşir hakları ilgili yayınevleri ve hak sahiplerine aittir.",
          "Uygulama bu metinler üzerinde mülkiyet iddia etmez; metinler yalnızca okuma ve takip kolaylığı için sunulur.",
        ],
      },
      {
        heading: "İzin Talepleri",
        body: [
          "Uygulamanın içerik veya marka unsurlarını kullanmak için yazılı izin gereklidir. Taleplerinizi İletişim sayfası üzerinden iletebilirsiniz.",
        ],
      },
      {
        heading: "Hak İhlali Bildirimi",
        body: [
          "Bir telif hakkı ihlali olduğunu düşünüyorsanız lütfen bize bildirin. Uygun inceleme sonrası gerekli adımları atarız.",
        ],
      },
    ],
  },
  en: {
    title: "Copyright & Permissions",
    description: "Copyright ownership and usage conditions for App content.",
    updatedAt: "Last updated: 12 Dec 2025",
    sections: [
      {
        heading: "App Rights",
        body: [
          "The software, design, and branding of Delail-i Hayrat Tracker are protected by copyright and may not be copied or used commercially without permission.",
        ],
      },
      {
        heading: "Religious Texts",
        body: [
          "Texts of Delail-i Hayrat shown in the App belong to their respective publishers/rights holders.",
          "We provide them only to facilitate reading and tracking and do not claim ownership.",
        ],
      },
      {
        heading: "Permissions and Claims",
        body: [
          "Requests for permissions or copyright complaints can be submitted via the Contact page.",
        ],
      },
    ],
  },
  ar: {
    title: "حقوق النشر والأذونات",
    description: "حقوق النشر وشروط استخدام محتوى التطبيق.",
    updatedAt: "آخر تحديث: 12 ديسمبر 2025",
    sections: [
      {
        heading: "حقوق التطبيق",
        body: [
          "برمجيات وتصميم وعلامة تطبيق متابعة دلائل الخيرات محمية بحقوق النشر ولا يجوز نسخها أو استخدامها تجارياً دون إذن.",
        ],
      },
      {
        heading: "النصوص الدينية",
        body: [
          "نصوص دلائل الخيرات تعود حقوقها للناشرين وأصحاب الحقوق.",
          "نقدمها لتسهيل القراءة والمتابعة ولا ندعي ملكيتها.",
        ],
      },
      {
        heading: "الطلبات والشكاوى",
        body: [
          "لطلب الإذن أو الإبلاغ عن مخالفة يرجى التواصل عبر صفحة التواصل.",
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
    path: "/app/legal/copyright",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function CopyrightPage({ params }: { params: { locale: Locale } }) {
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
