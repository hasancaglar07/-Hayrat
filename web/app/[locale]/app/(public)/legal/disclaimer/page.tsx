import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; updatedAt: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Feragatname",
    description: "Uygulama içeriği ve hizmet sınırları hakkında önemli açıklamalar.",
    updatedAt: "Son güncelleme: 12 Aralık 2025",
    sections: [
      {
        heading: "Bilgilendirme Niteliği",
        body: [
          "Uygulamadaki metinler, açıklamalar ve fazilet bilgileri genel bilgilendirme amaçlıdır. Dini hüküm (fetva) veya bağlayıcı görüş niteliği taşımaz.",
          "Sorularınız için yetkin dini mercilere başvurmanız tavsiye edilir.",
        ],
      },
      {
        heading: "Manevi Sonuçlar",
        body: [
          "Delail-i Hayrat ve salavat okumalarının faziletleri İslami gelenekte geniş biçimde anlatılır. Ancak manevi kazanımlar kişisel niyet, devamlılık ve Allah’ın takdiri ile ilgilidir.",
          "Uygulama belirli bir sonucun gerçekleşeceğine dair garanti veya taahhüt vermez.",
        ],
      },
      {
        heading: "Takip Doğruluğu",
        body: [
          "Uygulama okuma ilerlemenizi sizin girişlerinize dayanarak takip eder. Yanlış veya eksik girişlerden doğabilecek sonuçlardan kullanıcı sorumludur.",
        ],
      },
      {
        heading: "Üçüncü Taraf Bağlantıları",
        body: [
          "Uygulama zaman zaman üçüncü taraf sitelere bağlantı verebilir. Bu sitelerin içeriklerinden ve gizlilik uygulamalarından sorumlu değiliz.",
        ],
      },
      {
        heading: "Sorumluluğun Sınırları",
        body: [
          "Hizmette yaşanabilecek kesinti, veri kaybı veya teknik sorunlardan doğabilecek dolaylı zararlardan sorumluluk kabul etmeyiz.",
          "Yasal zorunluluklar saklıdır.",
        ],
      },
    ],
  },
  en: {
    title: "Disclaimer",
    description: "Important notes about the App’s content and limits.",
    updatedAt: "Last updated: 12 Dec 2025",
    sections: [
      {
        heading: "Informational Content",
        body: [
          "Texts, explanations, and virtue notes are provided for general information and do not constitute formal religious rulings (fatwa).",
          "For specific questions, consult qualified scholars.",
        ],
      },
      {
        heading: "Spiritual Outcomes",
        body: [
          "Virtues of salawat and Delail-i Hayrat are widely discussed in Islamic tradition. Outcomes depend on intention, consistency, and Allah’s decree.",
          "The App does not guarantee specific spiritual results.",
        ],
      },
      {
        heading: "Tracking Accuracy",
        body: [
          "Progress is based on user input. Users are responsible for accurate entries.",
        ],
      },
      {
        heading: "Third‑Party Links",
        body: [
          "We may link to third‑party websites. We are not responsible for their content or privacy practices.",
        ],
      },
      {
        heading: "Limitation of Liability",
        body: [
          "We are not liable for indirect damages arising from service interruptions or technical issues, subject to applicable law.",
        ],
      },
    ],
  },
  ar: {
    title: "إخلاء المسؤولية",
    description: "ملاحظات مهمة حول حدود الخدمة والمحتوى.",
    updatedAt: "آخر تحديث: 12 ديسمبر 2025",
    sections: [
      {
        heading: "طبيعة المحتوى",
        body: [
          "النصوص والشروحات ومعلومات الفضائل للتوعية العامة ولا تُعد فتوى ملزمة.",
          "للاستفتاء يرجى الرجوع إلى أهل العلم.",
        ],
      },
      {
        heading: "النتائج الروحية",
        body: [
          "تُذكر فضائل الصلاة على النبي ﷺ وقراءة دلائل الخيرات في التراث الإسلامي، لكن النتائج مرتبطة بالنية والاستمرار وتقدير الله.",
          "لا يضمن التطبيق نتائج محددة.",
        ],
      },
      {
        heading: "دقة التتبع",
        body: [
          "يعتمد التتبع على إدخالك أنت، وأنت مسؤول عن صحة البيانات.",
        ],
      },
      {
        heading: "روابط خارجية",
        body: [
          "قد نعرض روابط لمواقع خارجية ولسنا مسؤولين عن محتواها أو سياساتها.",
        ],
      },
      {
        heading: "حدود المسؤولية",
        body: [
          "لا نتحمل الأضرار غير المباشرة الناتجة عن انقطاع الخدمة أو المشاكل التقنية ضمن حدود القانون.",
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
    path: "/app/legal/disclaimer",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function DisclaimerPage({ params }: { params: { locale: Locale } }) {
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
