import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "İletişim",
    description: "Geri bildirim, destek talepleri ve resmi başvurular için bize ulaşın.",
    sections: [
      {
        heading: "Bize Nasıl Ulaşırsınız?",
        body: [
          "Uygulama ile ilgili öneri, hata bildirimi veya destek talepleriniz için bu sayfayı kullanabilirsiniz.",
          "Resmî destek e‑posta adresimiz ve diğer kanallarımız en kısa zamanda burada duyurulacaktır.",
        ],
      },
      {
        heading: "Başvuru ve Talepler",
        body: [
          "Gizlilik, veri silme veya KVKK/GDPR kapsamındaki taleplerinizi açık bir şekilde iletmeniz halinde, makul süre içinde yanıt vermeye çalışırız.",
          "Talebinizde hesabınıza bağlı e‑posta adresini belirtmeniz işlemleri hızlandırır.",
        ],
      },
      {
        heading: "Bağış ve Proje Desteği",
        body: [
          "Projeyi desteklemek isterseniz Bağış sayfasındaki bilgileri inceleyebilirsiniz. Topluluğun katkıları uygulamanın gelişmesine yardımcı olur.",
        ],
      },
    ],
  },
  en: {
    title: "Contact",
    description: "Reach us for feedback, support requests, or formal data inquiries.",
    sections: [
      {
        heading: "How to Contact Us",
        body: [
          "You can use this page for suggestions, bug reports, or support needs.",
          "Official support email and channels will be published here as soon as possible.",
        ],
      },
      {
        heading: "Requests",
        body: [
          "For privacy, deletion, or KVKK/GDPR requests, please describe your request clearly. We will respond within a reasonable timeframe.",
          "Include the email linked to your account to speed up verification.",
        ],
      },
      {
        heading: "Donations",
        body: [
          "If you’d like to support the project, please see the Donate page. Community support helps us improve the App.",
        ],
      },
    ],
  },
  ar: {
    title: "التواصل",
    description: "تواصل معنا للاقتراحات أو الدعم أو الطلبات الرسمية المتعلقة بالبيانات.",
    sections: [
      {
        heading: "طرق التواصل",
        body: [
          "يمكنك استخدام هذه الصفحة للاقتراحات أو الإبلاغ عن الأعطال أو طلب الدعم.",
          "سيتم نشر البريد الرسمي للدعم وباقي القنوات هنا قريباً.",
        ],
      },
      {
        heading: "الطلبات الرسمية",
        body: [
          "لطلبات الخصوصية أو الحذف أو حقوق KVKK/GDPR يرجى توضيح الطلب وسنرد خلال مدة معقولة.",
          "اذكر البريد المرتبط بالحساب لتسهيل التحقق.",
        ],
      },
      {
        heading: "الدعم والتبرع",
        body: [
          "لدعم المشروع يمكنك زيارة صفحة التبرع. مساهمة المجتمع تساعدنا على التطوير.",
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
    path: "/app/legal/contact",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const page = content[params.locale] ?? content.tr!;
  const t = getMessages(params.locale);
  return (
    <LongFormArticle
      kicker={t.footer.sections.legal.title}
      title={page.title}
      description={page.description}
      sections={page.sections}
    />
  );
}
