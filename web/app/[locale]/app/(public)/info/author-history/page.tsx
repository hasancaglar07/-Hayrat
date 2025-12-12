import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "İmam el‑Cezûlî ve Delail-i Hayrat Tarihçesi",
    description: "Eserin müellifi, yazılış süreci ve İslam dünyasındaki yayılışı.",
    sections: [
      {
        heading: "İmam el‑Cezûlî Kimdir?",
        body: [
          "İmam Muhammed b. Süleyman el‑Cezûlî (rah.), Fas’ta yetişmiş büyük bir âlim ve sûfîdir. Salavatların faziletine dair rivayetleri derleyip sistematik bir okuma programına dönüştürmesiyle tanınır.",
        ],
      },
      {
        heading: "Eserin Telifi",
        body: [
          "Rivayetlere göre el‑Cezûlî, sahih kaynaklarda yer alan salavat metinlerini bir araya getirerek Delail-i Hayrat’ı telif etmiş, eseri günlük/haftalık bölümlere ayırarak kolay okunur hale getirmiştir.",
        ],
      },
      {
        heading: "Yayılışı ve Tesiri",
        body: [
          "Delail-i Hayrat, Kuzey Afrika’da tekkelerde ve medreselerde hızla yayılmış; Osmanlı coğrafyasında da önemli bir evrad kitabı olarak kabul edilmiştir.",
          "Zamanla farklı şerh ve baskılar hazırlanmış, bugün de dünyanın pek çok yerinde okunmaya devam etmektedir.",
        ],
      },
      {
        heading: "Günümüzde Okuma Geleneği",
        body: [
          "Günümüzde birçok topluluk Delail-i Hayrat’ı haftalık bir düzenle okur; hatim halkaları ve salavat meclisleriyle bu gelenek canlı tutulur.",
          "Modern takip araçları, bu geleneği gündelik hayatın temposu içinde sürdürmeyi kolaylaştırır.",
        ],
      },
    ],
  },
  en: {
    title: "Imam al‑Jazuli and the History of Delail-i Hayrat",
    description: "The author, compilation, and spread of the work.",
    sections: [
      {
        heading: "Who Was Imam al‑Jazuli?",
        body: [
          "Imam Muhammad ibn Sulayman al‑Jazuli was a Moroccan scholar and Sufi renowned for compiling salawat traditions.",
        ],
      },
      {
        heading: "Compilation",
        body: [
          "He gathered widely‑recited salawat from authentic sources and organized them into daily/weekly portions to support steady recitation.",
        ],
      },
      {
        heading: "Spread and Influence",
        body: [
          "The book spread from North Africa to the Ottoman lands and beyond, becoming a major devotional text in many communities.",
        ],
      },
      {
        heading: "Reading Tradition Today",
        body: [
          "Many circles read Delail-i Hayrat weekly, often in groups. Digital tools help keep this tradition consistent in modern life.",
        ],
      },
    ],
  },
  ar: {
    title: "الإمام الجزولي وتاريخ دلائل الخيرات",
    description: "مؤلف الكتاب وتدوينه وانتشاره في العالم الإسلامي.",
    sections: [
      {
        heading: "من هو الإمام الجزولي؟",
        body: [
          "الإمام محمد بن سليمان الجزولي عالم وصوفي مغربي اشتهر بجمع الصلوات على النبي ﷺ.",
        ],
      },
      {
        heading: "تأليف الكتاب",
        body: [
          "جمع الصلوات المأثورة من مصادر موثوقة ورتبها في أجزاء يومية/أسبوعية لتسهيل القراءة.",
        ],
      },
      {
        heading: "الانتشار والتأثير",
        body: [
          "انتشر الكتاب في المغرب ثم في الدولة العثمانية وسائر الأقاليم، وصار من أهم كتب الأوراد.",
        ],
      },
      {
        heading: "القراءة في عصرنا",
        body: [
          "لا يزال يُقرأ أسبوعياً في حلقات ومجالس، وتساعد أدوات المتابعة الحديثة على الاستمرار.",
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
    path: "/app/info/author-history",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function AuthorHistoryPage({ params }: { params: { locale: Locale } }) {
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
