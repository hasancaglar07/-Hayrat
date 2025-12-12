import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Haftalık Delail-i Hayrat Okuma Planı",
    description: "Yeni başlayanlar ve düzen arayanlar için pratik haftalık plan önerileri.",
    sections: [
      {
        heading: "Neden Haftalık Plan?",
        body: [
          "Delail-i Hayrat genellikle haftalık bölümler hâlinde okunur. Haftalık plan yapmak, okumanın günlük hayatla uyum içinde sürdürülmesine yardım eder.",
          "Plan; hem kaçırmaları azaltır hem de kaza okumalarını yönetilebilir kılar.",
        ],
      },
      {
        heading: "Başlangıç Seviyesi (3–4 Gün)",
        body: [
          "İlk defa başlayacaklar için hedefi düşük tutmak sürdürülebilirlik sağlar. Örnek plan:",
        ],
        bullets: [
          "Pazartesi, Salı, Perşembe, Cuma: Günün hizbini oku.",
          "Çarşamba veya Cumartesi: Dinlenme / Kaza telafisi.",
          "Pazar: Haftayı gözden geçir, yeni hafta hedefini belirle.",
        ],
      },
      {
        heading: "Orta Seviye (5–6 Gün)",
        body: [
          "Düzen oturduğunda hedefi artırabilirsin. Örnek:",
        ],
        bullets: [
          "Hafta içi her gün okuma.",
          "Cumartesi: Kaza veya tekrar.",
          "Pazar: Hafif okuma veya haftalık değerlendirme.",
        ],
      },
      {
        heading: "Tam Hafta (7 Gün)",
        body: [
          "Tam haftalık düzen, Delail-i Hayrat’ın geleneksel okuma biçimidir. Her gün ilgili hizbi okumaya gayret edilir.",
          "Kaçırma olursa, mümkün olan en kısa sürede kaza okuyarak ritim korunur.",
        ],
      },
      {
        heading: "Uygulama ile Planlama",
        body: [
          "Profilde haftalık hedef gün sayısını ayarlayın. Takvim görünümü hangi gün okuduğunuzu net gösterir.",
          "Kaza günlerini ayrı modda tamamlayarak haftayı dengede tutabilirsiniz.",
        ],
      },
    ],
  },
  en: {
    title: "Weekly Delail-i Hayrat Reading Plan",
    description: "Practical weekly plans for beginners and consistent readers.",
    sections: [
      {
        heading: "Why a Weekly Plan?",
        body: [
          "Delail-i Hayrat is commonly read on a weekly cycle. A plan helps integrate reading into daily life and reduces missed days.",
        ],
      },
      {
        heading: "Beginner Plan (3–4 Days)",
        body: ["Start small to sustain consistency."],
        bullets: [
          "Mon, Tue, Thu, Fri: read the daily hizb.",
          "Wed or Sat: rest / makeup.",
          "Sun: review the week and set the next target.",
        ],
      },
      {
        heading: "Intermediate Plan (5–6 Days)",
        body: ["Increase gradually once steady."],
        bullets: ["Weekdays daily reading", "Saturday makeup", "Sunday reflection"],
      },
      {
        heading: "Full Week (7 Days)",
        body: [
          "Reading every day follows the traditional weekly cycle. Make up any missed day promptly.",
        ],
      },
      {
        heading: "Using the App",
        body: [
          "Set your weekly target in Profile. The calendar shows your progress and helps schedule makeup days.",
        ],
      },
    ],
  },
  ar: {
    title: "خطة أسبوعية لقراءة دلائل الخيرات",
    description: "خطة عملية للمبتدئين ومن يريد الاستمرار.",
    sections: [
      {
        heading: "لماذا خطة أسبوعية؟",
        body: [
          "يُقرأ دلائل الخيرات غالباً بنظام أسبوعي. التخطيط يساعد على إدخاله في الروتين وتقليل الفوات.",
        ],
      },
      {
        heading: "خطة للمبتدئ (3–4 أيام)",
        body: ["ابدأ بهدف صغير لتثبت العادة."],
        bullets: [
          "الاثنين، الثلاثاء، الخميس، الجمعة: قراءة حزب اليوم.",
          "الأربعاء أو السبت: راحة/قضاء.",
          "الأحد: مراجعة الأسبوع وتحديد هدف جديد.",
        ],
      },
      {
        heading: "خطة متوسطة (5–6 أيام)",
        body: ["زد الهدف تدريجياً بعد ثباتك."],
        bullets: ["قراءة أيام الأسبوع", "السبت للقضاء", "الأحد للمراجعة"],
      },
      {
        heading: "أسبوع كامل (7 أيام)",
        body: [
          "اتباع النظام الأسبوعي التقليدي بقراءة كل يوم مع قضاء ما يفوت بسرعة.",
        ],
      },
      {
        heading: "التخطيط عبر التطبيق",
        body: [
          "حدد هدفك في الملف الشخصي، وسترى تقدمك في التقويم وتخطط للقضاء بسهولة.",
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
    path: "/app/info/weekly-plan",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function WeeklyPlanPage({ params }: { params: { locale: Locale } }) {
  const page = content[params.locale] ?? content.tr!;
  const t = getMessages(params.locale);
  return (
    <LongFormArticle
      kicker={t.footer.sections.info.title}
      title={page.title}
      description={page.description}
      sections={page.sections}
    />
  );
}
