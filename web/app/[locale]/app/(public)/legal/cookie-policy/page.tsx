import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; updatedAt: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Çerez Politikası",
    description: "Bu sayfa, Uygulama’da kullanılan çerezleri ve tercihlerinizin nasıl yönetileceğini açıklar.",
    updatedAt: "Son güncelleme: 12 Aralık 2025",
    sections: [
      {
        heading: "Çerez Nedir?",
        body: [
          "Çerezler (cookies), web sitelerinin tarayıcınızda sakladığı küçük metin dosyalarıdır. Bu dosyalar sayesinde site, sizi tekrar ziyaret ettiğinizde bazı tercihlerinizi hatırlayabilir.",
        ],
      },
      {
        heading: "Kullandığımız Çerez Türleri",
        body: [
          "Uygulamada yalnızca zorunlu ve işlevsel çerezler kullanılır. Bu çerezler hizmetin çalışması ve tercihlerinizi hatırlaması için gereklidir.",
        ],
        bullets: [
          "`locale`: Dil tercihinizi saklar ve sayfaların doğru dilde açılmasını sağlar.",
          "`theme-preference`: Açık/koyu/sepya tema seçiminizi hatırlar.",
        ],
      },
      {
        heading: "Analitik veya Reklam Çerezleri",
        body: [
          "Şu anda reklam, hedefleme veya üçüncü taraf analitik çerezleri kullanmıyoruz.",
          "Gelecekte analitik çerez eklenirse, size açık bir bilgilendirme yapılacak ve tercihinizi yönetebileceğiniz bir onay ekranı sunulacaktır.",
        ],
      },
      {
        heading: "Çerezleri Nasıl Yönetebilirsiniz?",
        body: [
          "Tarayıcı ayarlarınız üzerinden çerezleri silebilir, engelleyebilir veya yalnızca belirli siteler için izin verebilirsiniz. Çerezleri devre dışı bırakmanız bazı işlevlerin (ör. dil/tema hatırlama) çalışmamasına yol açabilir.",
        ],
      },
      {
        heading: "Değişiklikler",
        body: ["Çerez kullanımımız değişirse bu sayfa güncellenecektir."],
      },
    ],
  },
  en: {
    title: "Cookie Policy",
    description: "This page explains which cookies the App uses and how you can control them.",
    updatedAt: "Last updated: 12 Dec 2025",
    sections: [
      {
        heading: "What Are Cookies?",
        body: [
          "Cookies are small text files stored by your browser. They help websites remember preferences across visits.",
        ],
      },
      {
        heading: "Cookies We Use",
        body: ["We use only essential/functional cookies needed for core features."],
        bullets: [
          "`locale`: stores your language preference.",
          "`theme-preference`: stores your UI theme choice.",
        ],
      },
      {
        heading: "No Ads or Third‑Party Tracking",
        body: [
          "We currently do not use advertising, targeting, or third‑party analytics cookies.",
          "If analytics are introduced later, you will be informed and asked for consent.",
        ],
      },
      {
        heading: "Managing Cookies",
        body: [
          "You can delete or block cookies via your browser settings. Disabling cookies may affect features like remembering language or theme.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة ملفات تعريف الارتباط",
    description: "توضح هذه الصفحة ملفات تعريف الارتباط المستخدمة في التطبيق وكيفية إدارتها.",
    updatedAt: "آخر تحديث: 12 ديسمبر 2025",
    sections: [
      {
        heading: "ما هي ملفات تعريف الارتباط؟",
        body: [
          "هي ملفات نصية صغيرة يحفظها المتصفح لمساعدة الموقع على تذكر تفضيلاتك.",
        ],
      },
      {
        heading: "الملفات التي نستخدمها",
        body: ["نستخدم فقط ملفات ضرورية/وظيفية لتشغيل الميزات الأساسية."],
        bullets: [
          "`locale`: لحفظ تفضيل اللغة.",
          "`theme-preference`: لحفظ تفضيل السمة.",
        ],
      },
      {
        heading: "عدم وجود إعلانات أو تتبع",
        body: [
          "لا نستخدم حالياً ملفات إعلانية أو تتبع لطرف ثالث.",
          "إذا أضفنا تحليلات مستقبلاً فسنطلب موافقتك.",
        ],
      },
      {
        heading: "إدارة الملفات",
        body: [
          "يمكنك حذف أو حظر الملفات من إعدادات المتصفح. قد يؤدي ذلك لتعطّل تذكر اللغة أو السمة.",
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
    path: "/app/legal/cookie-policy",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function CookiePolicyPage({ params }: { params: { locale: Locale } }) {
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
