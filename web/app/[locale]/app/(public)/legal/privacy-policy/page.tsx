import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; updatedAt: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Gizlilik Politikası",
    description:
      "Bu politika, Delail-i Hayrat Takip uygulamasını kullanırken hangi verileri topladığımızı, nasıl işlediğimizi ve haklarınızı açıklar.",
    updatedAt: "Son güncelleme: 12 Aralık 2025",
    sections: [
      {
        heading: "Kapsam ve Amaç",
        body: [
          "Delail-i Hayrat Takip (“Uygulama”), Delail-i Hayrat okuma düzeninizi kolaylaştırmak için okuma kayıtlarınızı, hedeflerinizi ve tercihlerinizi saklayan bir takip hizmetidir. Bu Gizlilik Politikası, Uygulama üzerinden sağlanan tüm web hizmetleri için geçerlidir.",
          "Politika; hangi kişisel verileri topladığımızı, bu verileri hangi amaçlarla işlediğimizi, kimlerle paylaştığımızı ve bu veriler üzerindeki haklarınızı anlaşılır biçimde ortaya koymayı hedefler.",
        ],
      },
      {
        heading: "Toplanan Veriler",
        body: [
          "Uygulamada oturum açtığınızda e‑posta adresiniz gibi kimlik ve iletişim bilgileri işlenir. Bu bilgi, size doğrulama bağlantısı göndermek ve hesabınızı yönetmek için gereklidir.",
          "Okuma günleriniz, tamamlanan hizbler, kaza okumaları, puan/streak bilgileri ve haftalık hedefleriniz gibi kullanım verileri takip amacıyla tutulur.",
          "Dil tercihi ve tema seçimi gibi ayar verileri, deneyiminizi kişiselleştirmek için saklanır.",
          "Tarayıcınızın temel teknik bilgileri (ör. tercih edilen dil, cihaz türü) yalnızca güvenlik ve işlevsellik amaçlarıyla sınırlı olarak işlenebilir.",
        ],
      },
      {
        heading: "Verileri İşleme Amaçlarımız",
        body: [
          "Hizmeti sunmak ve sürdürmek: Okuma kayıtlarınızı göstermek, hedeflerinizi yönetmek ve istatistiklerinizi hesaplamak.",
          "Kişiselleştirme: Dil/tema tercihlerinize uygun arayüz sağlamak ve ayarlarınızı hatırlamak.",
          "Topluluk ve motivasyon: Onay vermeniz hâlinde global sıralamada adınızın görünmesini sağlamak.",
          "Güvenlik ve hata ayıklama: Uygulamanın güvenli ve kararlı çalışmasını sağlamak.",
        ],
      },
      {
        heading: "Çerezler ve Benzeri Teknolojiler",
        body: [
          "Uygulama, yalnızca zorunlu/işlevsel çerezler kullanır. Bunlar dil seçimi (`locale`) ve tema tercihi (`theme-preference`) gibi kullanımınızı kolaylaştıran çerezlerdir.",
          "Reklam veya üçüncü taraf takip çerezleri kullanmıyoruz. İleride analitik çerezler devreye alınırsa, ayrı bir bilgilendirme ve onay mekanizması sunulacaktır.",
        ],
      },
      {
        heading: "Verilerin Paylaşımı",
        body: [
          "Verileriniz üçüncü taraflara satılmaz veya pazarlama amacıyla paylaşılmaz.",
          "Hizmeti sunmak için altyapı sağlayıcılarıyla (ör. veri tabanı ve kimlik doğrulama hizmetleri) sınırlı ve sözleşmeye dayalı paylaşım yapılabilir. Bu sağlayıcılar verileri yalnızca bizim talimatlarımız doğrultusunda işler.",
        ],
      },
      {
        heading: "Saklama Süresi",
        body: [
          "Hesabınız aktif olduğu sürece okuma ve ayar kayıtlarınız saklanır. Hesabınızı silmeniz hâlinde, yasal yükümlülükler saklı kalmak üzere kişisel verileriniz makul süre içinde silinir veya anonimleştirilir.",
        ],
      },
      {
        heading: "Güvenlik",
        body: [
          "Verileriniz, güvenli sunucularda saklanır; aktarım sırasında şifreleme (HTTPS) kullanılır ve erişimler rol/tabanlı yetkilendirme ile sınırlandırılır.",
          "Buna rağmen internet üzerinden yapılan aktarımların %100 güvenli olduğunu garanti etmek mümkün değildir. Şüpheli bir durum fark ederseniz bizimle iletişime geçebilirsiniz.",
        ],
      },
      {
        heading: "Haklarınız",
        body: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, düzeltilmesini veya silinmesini isteme haklarına sahipsiniz.",
          "Ayrıca verdiğiniz rızayı geri çekebilir ve bazı işleme faaliyetlerine itiraz edebilirsiniz. Talepleriniz için İletişim sayfasındaki kanalları kullanabilirsiniz.",
        ],
      },
      {
        heading: "Çocukların Gizliliği",
        body: [
          "Uygulama 13 yaş altındaki çocuklara yönelik değildir. Böyle bir kullanımı fark edersek ilgili hesapları kapatabilir ve verileri silebiliriz.",
        ],
      },
      {
        heading: "Değişiklikler",
        body: [
          "Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişikliklerde uygulama içi bildirim veya bu sayfa üzerinden duyuru yapılacaktır.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    description:
      "This policy explains what data we collect in Delail-i Hayrat Tracker, how we use it, and what rights you have.",
    updatedAt: "Last updated: 12 Dec 2025",
    sections: [
      {
        heading: "Scope and Purpose",
        body: [
          "Delail-i Hayrat Tracker (“App”) is a reading‑habit tracking service that stores your progress, goals, and preferences. This Privacy Policy applies to all web services provided through the App.",
          "Our goal is to be transparent about the data we collect, why we process it, and how you can control it.",
        ],
      },
      {
        heading: "Data We Collect",
        body: [
          "When you sign in, we process your email address to send a verification link and manage your account.",
          "We store usage data such as completed days, hizb progress, makeup readings, points/streaks, and weekly targets.",
          "Settings like language and theme are stored to personalize your experience.",
          "Basic technical information (e.g., preferred language, device type) may be processed only for security and functionality.",
        ],
      },
      {
        heading: "How We Use Your Data",
        body: [
          "To provide and maintain the service: show your progress, compute stats, and manage goals.",
          "To personalize the UI based on your settings.",
          "To enable community motivation features (global ranking) only if you opt in.",
          "To keep the App secure and reliable.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "We use only essential/functional cookies, such as `locale` (language) and `theme-preference` (UI theme).",
          "We do not use advertising or third‑party tracking cookies. If analytics cookies are added in the future, you will be informed and asked for consent.",
        ],
      },
      {
        heading: "Sharing",
        body: [
          "We never sell your personal data.",
          "We may share limited data with infrastructure providers (e.g., database/auth services) solely to operate the App, under strict contractual safeguards.",
        ],
      },
      {
        heading: "Retention and Security",
        body: [
          "We keep your records while your account is active. If you delete your account, we delete or anonymize your data unless legally required otherwise.",
          "Data is protected via HTTPS, secure storage, and access controls, though no online transmission can be guaranteed 100% secure.",
        ],
      },
      {
        heading: "Your Rights",
        body: [
          "You may request access to, correction of, or deletion of your personal data, and withdraw consent where applicable.",
          "Please use the Contact page to submit requests.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    description:
      "توضح هذه السياسة البيانات التي نجمعها في تطبيق متابعة دلائل الخيرات، وكيف نستخدمها، وحقوقك المتعلقة بها.",
    updatedAt: "آخر تحديث: 12 ديسمبر 2025",
    sections: [
      {
        heading: "النطاق والهدف",
        body: [
          "تطبيق متابعة دلائل الخيرات (“التطبيق”) هو خدمة لمتابعة عادة القراءة تحفظ تقدمك وأهدافك وتفضيلاتك. تسري هذه السياسة على جميع خدمات الويب داخل التطبيق.",
          "نهدف إلى الشفافية في نوع البيانات التي نجمعها وأسباب معالجتها وكيف يمكنك التحكم بها.",
        ],
      },
      {
        heading: "البيانات التي نجمعها",
        body: [
          "عند تسجيل الدخول نعالج بريدك الإلكتروني لإرسال رابط التحقق وإدارة حسابك.",
          "نحفظ بيانات الاستخدام مثل أيام القراءة المكتملة، تقدم الحزب، قراءات القضاء، النقاط والسلاسل، والأهداف الأسبوعية.",
          "نحفظ إعداداتك مثل اللغة والسمة لتخصيص التجربة.",
          "قد نعالج معلومات تقنية أساسية فقط للأمان والوظائف.",
        ],
      },
      {
        heading: "أغراض المعالجة",
        body: [
          "تقديم الخدمة والمحافظة عليها وعرض تقدمك وإحصاءاتك.",
          "تخصيص الواجهة حسب إعداداتك.",
          "إظهار الاسم في لوحة الصدارة عند اختيارك ذلك.",
          "تعزيز الأمان والاستقرار.",
        ],
      },
      {
        heading: "ملفات تعريف الارتباط",
        body: [
          "نستخدم فقط ملفات تعريف ارتباط ضرورية/وظيفية مثل `locale` للغة و`theme-preference` للسمة.",
          "لا نستخدم ملفات تتبع إعلانية أو لطرف ثالث. وإذا أضفنا تحليلات مستقبلاً فسنطلب موافقتك.",
        ],
      },
      {
        heading: "المشاركة والحفظ",
        body: [
          "لا نبيع بياناتك الشخصية.",
          "قد نشارك بيانات محدودة مع مزودي البنية التحتية لتشغيل التطبيق فقط وبضمانات تعاقدية.",
          "تُحفظ البيانات ما دام الحساب نشطاً، وتُحذف أو تُجهّل عند حذف الحساب ما لم توجد التزامات قانونية.",
        ],
      },
      {
        heading: "حقوقك",
        body: [
          "يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها وسحب الموافقة عند الحاجة.",
          "لإرسال الطلبات يرجى استخدام صفحة التواصل.",
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
    path: "/app/legal/privacy-policy",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function PrivacyPolicyPage({ params }: { params: { locale: Locale } }) {
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
