import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Delail-i Hayrat Faziletleri",
    description:
      "Salavat okumanın ve Delail-i Hayrat’la meşgul olmanın geleneksel faziletleri ve manevi etkileri.",
    sections: [
      {
        heading: "Salavatın Önemi",
        body: [
          "Kur’ân-ı Kerîm’de salavat getirilmesi emredilmiş, hadislerde salavatın müminin duasına bereket ve kabul vesilesi olduğu bildirilmiştir. Delail-i Hayrat, bu salavat geleneğini günlük hayata taşıyan kapsamlı bir derlemedir.",
        ],
      },
      {
        heading: "Delail-i Hayrat Okumanın Faziletleri",
        body: [
          "İslami kaynaklarda Delail-i Hayrat okumanın kalbi nurlandırdığı, Resûlullah’a muhabbeti artırdığı ve manevi huzuru desteklediği ifade edilir.",
          "Okuyuş, kişinin niyetini tazelemesine ve zikirle meşgul olmasına katkı sağlar.",
        ],
        bullets: [
          "Kalpte salavat bilincini güçlendirir.",
          "Günlük hayatta dua ve zikir sürekliliği kazandırır.",
          "Manevi motivasyonu ve ümmet bilincini artırır.",
        ],
      },
      {
        heading: "Devamlılığın Bereketi",
        body: [
          "Faziletler, sadece okumakla değil, devamlı bir usulle okumakla daha derinleşir. Haftalık hedeflerle ilerlemek, zihin ve kalp disiplinini destekler.",
          "Kaza okumalarıyla aksayan günleri tamamlamak, istikrarı korumaya yardımcı olur.",
        ],
      },
      {
        heading: "Niyet ve Adab",
        body: [
          "Faziletlerin özünde niyet vardır. Okumaya başlarken Allah rızasını gözetmek, mümkünse abdestli olmak ve sakin bir ortam seçmek tavsiye edilir.",
        ],
      },
    ],
  },
  en: {
    title: "Virtues of Delail-i Hayrat",
    description: "Traditional virtues of salawat and engaging with Delail-i Hayrat.",
    sections: [
      {
        heading: "The Place of Salawat",
        body: [
          "Salawat is encouraged in the Qur’an and Sunnah, described as a source of blessings for supplication. Delail-i Hayrat brings this tradition into a structured daily practice.",
        ],
      },
      {
        heading: "Virtues Mentioned in Tradition",
        body: [
          "Islamic tradition speaks about salawat strengthening love for the Prophet and increasing serenity.",
          "Consistency helps renew intention and keep remembrance alive.",
        ],
        bullets: [
          "Supports daily remembrance",
          "Renews spiritual motivation",
          "Encourages steady habit (istiqamah)",
        ],
      },
      {
        heading: "Value of Consistency",
        body: [
          "Virtues are nurtured by regular practice. Weekly goals and making up missed days help sustain the rhythm.",
        ],
      },
      {
        heading: "Intention and Etiquette",
        body: [
          "Begin with sincere intention, wudu when possible, and a calm setting.",
        ],
      },
    ],
  },
  ar: {
    title: "فضائل دلائل الخيرات",
    description: "فضائل الصلاة على النبي ﷺ وقراءة دلائل الخيرات في التراث الإسلامي.",
    sections: [
      {
        heading: "مكانة الصلاة على النبي ﷺ",
        body: [
          "أمر القرآن والسنة بالإكثار من الصلاة على النبي ﷺ، وذُكرت بركاتها على الدعاء. دلائل الخيرات ينظم هذه العبادة في برنامج يومي.",
        ],
      },
      {
        heading: "فضائل القراءة",
        body: [
          "تذكر كتب التراث أن المداومة على الصلوات تزيد المحبة للنبي ﷺ وتبعث السكينة في القلب.",
          "الاستمرار يجدد النية ويحيي الذكر.",
        ],
        bullets: [
          "تعين على دوام الذكر",
          "تزيد التحفيز الروحي",
          "تدعم الاستقامة",
        ],
      },
      {
        heading: "بركة الاستمرار",
        body: [
          "تتأكد الفضائل بالمداومة وتنظيم الهدف الأسبوعي وقضاء ما فاتك.",
        ],
      },
      {
        heading: "النية والآداب",
        body: [
          "ابدأ بنية صادقة ووضوء إن تيسر ومكان هادئ.",
        ],
      },
    ],
  },
  zh: {
    title: "《达莱勒·海拉特》的功德",
    description: "关于萨拉瓦特与诵读《达莱勒·海拉特》的传统功德与精神影响。",
    sections: [
      {
        heading: "萨拉瓦特的重要性",
        body: [
          "《古兰经》和圣训都鼓励信士向先知穆罕默德 ﷺ 送上萨拉瓦特。它被视为净化内心、增添祈祷福分的崇高功修。",
          "《达莱勒·海拉特》将这一传统以系统的每日读诵方式呈现，使记念更容易融入生活。",
        ],
      },
      {
        heading: "诵读《达莱勒·海拉特》的功德",
        body: [
          "传统文献常提到，持续诵读萨拉瓦特能增强对先知的爱慕、使心灵更柔软并带来安宁。",
          "读诵时的专注与反思，也有助于更新意向和保持内在的清明。",
        ],
        bullets: [
          "深化对先知 ﷺ 的 محبت（爱慕）与亲近感。",
          "让记念与祈祷在日常中保持连贯。",
          "促进恒常（istiqamah）与自我修炼。",
        ],
      },
      {
        heading: "坚持带来的祝福",
        body: [
          "功德不仅在于一次性的读诵，更在于持续与有序的习惯。每周目标和规律安排能帮助心与行保持一致。",
          "遇到遗漏时及时补读，能让读诵节奏更稳固。",
        ],
      },
      {
        heading: "意向与礼仪",
        body: [
          "功德的核心在于真诚的意向。建议在平静的环境中、尽量保持净礼（wudu）并怀着感恩与敬意来读诵。",
        ],
      },
    ],
  },
  hi: {
    title: "देलाइल‑ए‑हयرات की फ़ज़ीलतें",
    description: "सलावत और देलाइल‑ए‑हयرات के नियमित पाठ की परंपरागत फ़ज़ीलतें।",
    sections: [
      {
        heading: "सलावत का महत्व",
        body: [
          "क़ुरआन और सुन्नत में नबी ﷺ पर सलावत भेजने की प्रबल तालीम है। इसे दुआ की बरकत और दिल के सुकून का कारण बताया गया है।",
          "देलाइल‑ए‑हयرات इसी सलावत परंपरा को रोज़मर्रा की ज़िंदगी में व्यवस्थित ढंग से जोड़ता है।",
        ],
      },
      {
        heading: "देलाइल‑ए‑हयرات पढ़ने की फ़ज़ीलत",
        body: [
          "इस्लामी परंपरा में उल्लेख मिलता है कि सलावत की निरंतरता प्रेम‑ए‑रसूल ﷺ को बढ़ाती और हृदय को रोशन करती है।",
          "पाठ व्यक्ति की नीयत को ताज़ा करता है और ज़िक्र से जुड़े रहने में मदद देता है।",
        ],
        bullets: [
          "नबी ﷺ की मुहब्बत और याद को मजबूत करता है।",
          "दुआ और ज़िक्र की निरंतरता बढ़ाता है।",
          "इस्तिक़ामत और आत्मिक अनुशासन में मदद करता है।",
        ],
      },
      {
        heading: "नियमितता की बरकत",
        body: [
          "फ़ज़ीलतें नियमित और योजनाबद्ध पाठ से और गहरी होती हैं। साप्ताहिक लक्ष्य मन और दिल की स्थिरता बढ़ाते हैं।",
          "छूटे दिनों की क़ज़ा जल्दी कर लेना रुटीन को संभालने में सहायक है।",
        ],
      },
      {
        heading: "नीयत और अदब",
        body: [
          "सच्ची नीयत, वुज़ू और शांत वातावरण के साथ पढ़ना बेहतर माना गया है।",
        ],
      },
    ],
  },
  es: {
    title: "Virtudes de Delail‑i Hayrat",
    description: "Virtudes tradicionales de las salawat y de la lectura de Delail‑i Hayrat.",
    sections: [
      {
        heading: "La importancia de las salawat",
        body: [
          "El Corán y la Sunnah animan a enviar salawat al Profeta Muhammad ﷺ. Se considera una adoración que vivifica el corazón y bendice las súplicas.",
          "Delail‑i Hayrat reúne esta tradición en un programa diario para facilitar la constancia.",
        ],
      },
      {
        heading: "Virtudes de leer Delail‑i Hayrat",
        body: [
          "La tradición islámica menciona que la lectura constante aumenta el amor por el Profeta, aporta serenidad y fortalece el recuerdo espiritual.",
          "También ayuda a renovar la intención y a mantener el dhikr presente en la rutina.",
        ],
        bullets: [
          "Fortalece la conciencia de salawat en el corazón.",
          "Integra dua y dhikr en la vida diaria.",
          "Apoya la constancia (istiqamah) con suavidad.",
        ],
      },
      {
        heading: "La bendición de la constancia",
        body: [
          "Los méritos se profundizan cuando la lectura es regular. Establecer metas semanales ayuda a disciplinar el alma.",
          "Recuperar los días perdidos a tiempo mantiene vivo el ritmo de lectura.",
        ],
      },
      {
        heading: "Intención y etiqueta",
        body: [
          "Comienza con una intención sincera, preferiblemente con ablución y en un ambiente tranquilo.",
        ],
      },
    ],
  },
  fr: {
    title: "Les mérites de Delail‑i Hayrat",
    description: "Mérites traditionnels des salawat et de la récitation de Delail‑i Hayrat.",
    sections: [
      {
        heading: "La place des salawat",
        body: [
          "Le Coran et la Sunnah encouragent l’envoi de salawat au Prophète Muhammad ﷺ. Cette pratique illumine le cœur et apporte bénédiction à la supplication.",
          "Delail‑i Hayrat en fait un programme quotidien structuré, propice à la régularité.",
        ],
      },
      {
        heading: "Mérites de la récitation",
        body: [
          "Les sources islamiques évoquent une augmentation de l’amour prophétique, une sérénité intérieure et une présence spirituelle accrue grâce aux salawat.",
          "La lecture régulière renouvelle l’intention et garde le dhikr vivant.",
        ],
        bullets: [
          "Renforce la conscience de salawat.",
          "Installe une continuité dans le dhikr et la dua.",
          "Soutient l’istiqamah au quotidien.",
        ],
      },
      {
        heading: "Bénédiction de la constance",
        body: [
          "La constance est la clé des bénéfices spirituels. Des objectifs hebdomadaires et une lecture organisée aident à garder le cap.",
          "Rattraper les jours manqués sans tarder préserve le rythme.",
        ],
      },
      {
        heading: "Intention et adab",
        body: [
          "Lire avec une intention sincère, dans le calme et avec les ablutions si possible, est recommandé.",
        ],
      },
    ],
  },
  bn: {
    title: "দালাইল‑ই হায়রাতের ফজিলত",
    description: "সালাওয়াত এবং দালাইল‑ই হায়রাত পাঠের ঐতিহ্যগত ফজিলতসমূহ।",
    sections: [
      {
        heading: "সালাওয়াতের গুরুত্ব",
        body: [
          "কুরআন ও সুন্নাহে নবী ﷺ‑এর উপর সালাওয়াত পাঠের ফজিলত বর্ণিত হয়েছে। এটি হৃদয়কে জাগ্রত রাখে ও দোয়ায় বরকত আনে।",
          "দালাইল‑ই হায়রাত এই সালাওয়াত ঐতিহ্যকে দৈনিক পাঠের সুসংগঠিত রূপ দেয়।",
        ],
      },
      {
        heading: "পাঠের ফজিলত",
        body: [
          "ইসলামি ঐতিহ্যে সালাওয়াতের ধারাবাহিকতা নবী ﷺ‑এর প্রতি ভালোবাসা বৃদ্ধি ও অন্তরের প্রশান্তির কারণ বলা হয়েছে।",
          "পাঠ নেয়াত নবায়ন করে এবং যিকির‑দোয়ায় অবিচ্ছিন্নতা আনে।",
        ],
        bullets: [
          "হৃদয়ে সালাওয়াতের সচেতনতা বাড়ায়।",
          "দৈনন্দিন যিকির ও দোয়া স্থায়ী করে।",
          "ইস্তিকামত গঠনে সহায়তা করে।",
        ],
      },
      {
        heading: "ধারাবাহিকতার বরকত",
        body: [
          "নিয়মিত পাঠের মাধ্যমে ফজিলত আরও গভীর হয়। সাপ্তাহিক লক্ষ্য মন ও হৃদয়ের শৃঙ্খলা বাড়ায়।",
          "মিস হওয়া দিন দ্রুত ক্বাযা করলে রুটীন ঠিক থাকে।",
        ],
      },
      {
        heading: "নিয়ত ও আদব",
        body: [
          "খালেস নিয়ত, সম্ভব হলে অজু ও শান্ত পরিবেশে পড়া উত্তম।",
        ],
      },
    ],
  },
  pt: {
    title: "Virtudes do Delail‑i Hayrat",
    description: "Virtudes tradicionais das salawat e da leitura do Delail‑i Hayrat.",
    sections: [
      {
        heading: "A importância das salawat",
        body: [
          "O Alcorão e a Sunnah incentivam as salawat ao Profeta Muhammad ﷺ. Elas trazem bênçãos à súplica e purificam o coração.",
          "Delail‑i Hayrat organiza essa prática em leituras diárias para facilitar a constância.",
        ],
      },
      {
        heading: "Virtudes da leitura",
        body: [
          "A tradição islâmica menciona que a salawat contínua aumenta o amor pelo Profeta e traz serenidade interior.",
          "A leitura também renova a intenção e mantém o dhikr vivo.",
        ],
        bullets: [
          "Fortalece a consciência de salawat no coração.",
          "Integra dua e dhikr na rotina.",
          "Apoia a istiqamah de forma suave.",
        ],
      },
      {
        heading: "Bênção da constância",
        body: [
          "Os méritos se aprofundam com a regularidade. Metas semanais ajudam a manter disciplina espiritual.",
          "Repor dias perdidos rapidamente preserva o ritmo de leitura.",
        ],
      },
      {
        heading: "Intenção e adab",
        body: [
          "Ler com intenção sincera, preferencialmente com wudu e em ambiente calmo, é recomendado.",
        ],
      },
    ],
  },
  ru: {
    title: "Достоинства Далаиль‑и Хайрат",
    description: "Традиционные достоинства салаватов и чтения Далаиль‑и Хайрат.",
    sections: [
      {
        heading: "Значение салаватов",
        body: [
          "Коран и Сунна побуждают к салаватам Пророку ﷺ. Это поминание приносит благодать мольбе и оживляет сердце.",
          "Далаиль‑и Хайрат делает эту традицию удобной для ежедневной практики.",
        ],
      },
      {
        heading: "Достоинства чтения",
        body: [
          "В исламской традиции говорится, что постоянные салаваты усиливают любовь к Пророку и приносят внутреннее спокойствие.",
          "Чтение обновляет намерение и поддерживает связь с зикром.",
        ],
        bullets: [
          "Укрепляет салават‑сознание в сердце.",
          "Повышает непрерывность дуа и зикра.",
          "Помогает сохранять устойчивость (истикама).",
        ],
      },
      {
        heading: "Благодать постоянства",
        body: [
          "Достоинства проявляются глубже при регулярной практике. Недельные цели помогают дисциплинировать душу.",
          "Своевременное восполнение пропусков поддерживает ритм чтения.",
        ],
      },
      {
        heading: "Намерение и адаб",
        body: [
          "Рекомендуется начинать с искреннего намерения, в спокойной обстановке и по возможности в состоянии омовения.",
        ],
      },
    ],
  },
  ur: {
    title: "دلائلِ خیرات کی فضیلتیں",
    description: "درود و سلام اور دلائلِ خیرات پڑھنے کی روایتی فضیلتوں کا بیان۔",
    sections: [
      {
        heading: "درود کی اہمیت",
        body: [
          "قرآن و سنت میں نبی ﷺ پر درود بھیجنے کی ترغیب ملتی ہے۔ اسے دعا کی برکت اور دل کے سکون کا ذریعہ سمجھا جاتا ہے۔",
          "دلائلِ خیرات اسی درود کی روایت کو روزانہ کی منظم تلاوت میں سمو دیتی ہے۔",
        ],
      },
      {
        heading: "پڑھنے کی فضیلت",
        body: [
          "اسلامی مصادر میں درود کی کثرت کو محبتِ رسول ﷺ میں اضافہ اور قلبی اطمینان کا سبب بتایا گیا ہے۔",
          "یہ پڑھائی نیت تازہ کرتی اور ذکر سے تعلق مضبوط کرتی ہے۔",
        ],
        bullets: [
          "دل میں درود کی بیداری بڑھاتی ہے۔",
          "روزمرہ دعا و ذکر میں تسلسل پیدا کرتی ہے۔",
          "استقامت اور روحانی نظم میں مدد دیتی ہے۔",
        ],
      },
      {
        heading: "مسلسل پڑھنے کی برکت",
        body: [
          "فضیلتیں باقاعدہ اور مسلسل تلاوت سے زیادہ گہری ہوتی ہیں۔ ہفتہ وار اہداف اس نظم کو مضبوط بناتے ہیں۔",
          "چھوٹے ہوئے دن جلد پورے کرنا قراءت کے تسلسل کو قائم رکھتا ہے۔",
        ],
      },
      {
        heading: "نیت اور آداب",
        body: [
          "خالص نیت، وضو اور سکون والی جگہ میں پڑھنا افضل سمجھا جاتا ہے۔",
        ],
      },
    ],
  },
  id: {
    title: "Keutamaan Dalā’il al‑Khairāt",
    description: "Keutamaan salawat dan tradisi membaca Dalā’il al‑Khairāt.",
    sections: [
      {
        heading: "Pentingnya salawat",
        body: [
          "Al‑Qur’an dan Sunnah menganjurkan salawat kepada Nabi ﷺ. Amalan ini menenangkan hati dan membawa keberkahan bagi doa.",
          "Dalā’il al‑Khairāt menyusun salawat dalam bacaan harian yang teratur.",
        ],
      },
      {
        heading: "Keutamaan membaca",
        body: [
          "Tradisi Islam menyebut salawat yang istiqamah menambah cinta kepada Rasulullah dan menghadirkan ketenangan batin.",
          "Bacaan ini juga membantu memperbarui niat dan menjaga dhikr tetap hidup.",
        ],
        bullets: [
          "Menguatkan kesadaran salawat dalam hati.",
          "Menjaga kesinambungan dua dan dzikir.",
          "Mendukung istiqamah dalam ibadah.",
        ],
      },
      {
        heading: "Berkah konsistensi",
        body: [
          "Keutamaan terasa lebih dalam dengan rutinitas yang terjaga. Target mingguan membantu disiplin rohani.",
          "Mengqadha hari yang terlewat tanpa menunda menjaga ritme bacaan.",
        ],
      },
      {
        heading: "Niat dan adab",
        body: [
          "Mulailah dengan niat ikhlas, wudu bila memungkinkan, dan suasana yang tenang.",
        ],
      },
    ],
  },
  de: {
    title: "Vorzüge von Delail‑i Hayrat",
    description: "Traditionelle Vorzüge der Salawat und der Rezitation von Delail‑i Hayrat.",
    sections: [
      {
        heading: "Bedeutung der Salawat",
        body: [
          "Koran und Sunna ermutigen zur Salawat für den Propheten ﷺ. Sie gilt als Quelle von Segen für das Bittgebet und als Nahrung für das Herz.",
          "Delail‑i Hayrat fasst diese Praxis in einer täglichen, gut strukturierten Lektüre zusammen.",
        ],
      },
      {
        heading: "Vorzüge der Rezitation",
        body: [
          "In der islamischen Tradition wird berichtet, dass regelmäßige Salawat die Liebe zum Propheten stärkt und innere Ruhe schenkt.",
          "Sie hilft, die Absicht zu erneuern und das Gedenken lebendig zu halten.",
        ],
        bullets: [
          "Stärkt Salawat‑Bewusstsein im Herzen.",
          "Fördert Kontinuität von Dua und Dhikr.",
          "Unterstützt geistige Standhaftigkeit (Istiqamah).",
        ],
      },
      {
        heading: "Segen der Beständigkeit",
        body: [
          "Die Vorzüge entfalten sich tiefer durch Regelmäßigkeit. Wochenziele helfen, Disziplin zu bewahren.",
          "Verpasste Tage zeitnah nachzuholen stabilisiert den Rhythmus.",
        ],
      },
      {
        heading: "Absicht und Adab",
        body: [
          "Empfohlen ist eine aufrichtige Absicht, möglichst mit Wudu und in ruhiger Umgebung zu lesen.",
        ],
      },
    ],
  },
  ja: {
    title: "ダラーイル・ハイラートの功徳",
    description: "サラワートとダラーイル・ハイラート読誦に関する伝統的な功徳。",
    sections: [
      {
        heading: "サラワートの重要性",
        body: [
          "クルアーンとスンナは預言者 ﷺ へのサラワートを勧めています。これは心を清め、ドゥアに祝福をもたらす崇拝です。",
          "ダラーイル・ハイラートはその伝統を日々の読誦として体系化したものです。",
        ],
      },
      {
        heading: "読誦の功徳",
        body: [
          "イスラームの伝承では、サラワートの継続が預言者への愛を深め、心に安らぎをもたらすと語られます。",
          "読誦は意図を新たにし、ズィクルを保つ助けになります。",
        ],
        bullets: [
          "預言者 ﷺ への愛と親近感を強める。",
          "日常のドゥアとズィクルを継続させる。",
          "イスティカーマ（継続性）を育てる。",
        ],
      },
      {
        heading: "継続の祝福",
        body: [
          "功徳は規則的な読誦によってより深まります。週間目標は心と行いの秩序を整えます。",
          "逃した日を早めに補うことでリズムが保たれます。",
        ],
      },
      {
        heading: "意図と礼節",
        body: [
          "誠実な意図、可能ならウドゥー、落ち着いた環境での読誦が推奨されます。",
        ],
      },
    ],
  },
  sw: {
    title: "Fadhila za Delail‑i Hayrat",
    description: "Fadhila za salawat na usomaji wa Delail‑i Hayrat kwa mujibu wa turathi.",
    sections: [
      {
        heading: "Umuhimu wa salawat",
        body: [
          "Qur’an na Sunnah zinahimiza kutuma salawat kwa Mtume ﷺ. Ni ibada inayoleta baraka kwenye dua na kutuliza moyo.",
          "Delail‑i Hayrat huweka salawat hizi katika mpangilio wa kila siku.",
        ],
      },
      {
        heading: "Fadhila za kusoma",
        body: [
          "Turathi za Kiislamu zinataja kuwa salawat za mara kwa mara huongeza mapenzi kwa Mtume na kuleta utulivu wa ndani.",
          "Usomaji pia huweka nia mpya na kuendeleza dhikr.",
        ],
        bullets: [
          "Huimarisha ufahamu wa salawat moyoni.",
          "Husimamisha mwendelezo wa dhikr na dua.",
          "Husaidia kujenga istiqamah.",
        ],
      },
      {
        heading: "Baraka ya uthabiti",
        body: [
          "Fadhila huongezeka kwa kusoma kwa utaratibu. Malengo ya wiki huleta nidhamu ya kiroho.",
          "Kulipa siku zilizokosekana mapema kunalinda mzunguko wa usomaji.",
        ],
      },
      {
        heading: "Nia na adabu",
        body: [
          "Soma kwa nia ya ikhlasi, ukiwa na wudu ikiwezekana, na katika mazingira yenye utulivu.",
        ],
      },
    ],
  },
  mr: {
    title: "दलाईल‑ए‑हयراتच्या फज़ीलत",
    description: "सलावत व दलाईल‑ए‑हयراتच्या पठणाचे परंपरागत आध्यात्मिक फायदे.",
    sections: [
      {
        heading: "सलावतचे महत्त्व",
        body: [
          "कुरआन आणि सुन्नत नबी ﷺ वर सलावत पाठवण्याचे महत्त्व सांगतात. हे दुआमध्ये बरकत वाढवते आणि हृदय शांत करते.",
          "दलाईल‑ए‑हयرات ही सलावत परंपरा रोजच्या वाचनासाठी व्यवस्थित करते.",
        ],
      },
      {
        heading: "पठणाची फज़ीलत",
        body: [
          "परंपरेनुसार सलावतची नियमितता प्रेम‑ए‑रसूल ﷺ वाढवते आणि अंतःकरणाला सुकून देते.",
          "वाचन नीयत ताजे करते आणि झिक्रशी जोडून ठेवते.",
        ],
        bullets: [
          "हृदयात सलावतची जाणीव वाढवते.",
          "दुआ‑झिक्रमध्ये सातत्य निर्माण करते.",
          "इस्तिकामत व आत्मिक शिस्त वाढवते.",
        ],
      },
      {
        heading: "नियमिततेची बरकत",
        body: [
          "सातत्याने वाचल्यास फज़ीलत अधिक खोल होते. आठवड्याची उद्दिष्टे शिस्त टिकवतात.",
          "चुकलेल्या दिवसांची भरपाई लवकर केली तर रुटीन बिघडत नाही.",
        ],
      },
      {
        heading: "नीयत व आदब",
        body: [
          "खरी नीयत, शक्य असल्यास वुज़ू आणि शांत वातावरणात वाचन उत्तम मानले जाते.",
        ],
      },
    ],
  },
  te: {
    title: "దలాయిల్‑ఇ హయరాత్ ఫజీలతలు",
    description: "సలావాత్ మరియు దలాయిల్‑ఇ హయరాత్ పఠనపు సంప్రదాయ ఫజీలతలు.",
    sections: [
      {
        heading: "సలావాత్ యొక్క ప్రాముఖ్యత",
        body: [
          "ఖుర్ఆన్ మరియు సున్నహ్ ప్రవక్త ﷺ పై సలావాత్ పంపాలని ప్రోత్సహిస్తాయి. ఇది హృదయాన్ని శాంతింపజేసి దువాకు బరకత్‌ను పెంచుతుంది.",
          "దలాయిల్‑ఇ హయరాత్ ఈ సంప్రదాయాన్ని రోజువారీ పఠనంగా వ్యవస్థీకరిస్తుంది.",
        ],
      },
      {
        heading: "పఠన ఫజీలతలు",
        body: [
          "సలావాత్‌ను నిరంతరం చదవడం ప్రవక్తపై ప్రేమను పెంచి అంతరంగ సుకూన్‌ను అందిస్తుందని సంప్రదాయం చెప్పుతుంది.",
          "పఠనం నీయతను నవీకరించి జిక్రును జీవంతో ఉంచుతుంది.",
        ],
        bullets: [
          "హృదయంలో సలావాత్ భావనను బలపరుస్తుంది.",
          "దువా మరియు జిక్రులో నిరంతరతను పెంచుతుంది.",
          "ఇస్తికామాను పెంపొందిస్తుంది.",
        ],
      },
      {
        heading: "నిరంతరత యొక్క బరకత్",
        body: [
          "నియమితంగా పఠిస్తే ఫజీలతలు మరింత లోతుగా అనుభూతి అవుతాయి. వారపు లక్ష్యాలు ఆధ్యాత్మిక శాస్త్రీయతను కలిగిస్తాయి.",
          "మిస్సైన రోజులను త్వరగా క఼దా చేయడం రిథమ్‌ను కాపాడుతుంది.",
        ],
      },
      {
        heading: "నీయత మరియు ఆదబ్",
        body: [
          "ఖలీస్ నీయతతో, వీలైతే వుజూ తో, శాంతియుత వాతావరణంలో చదవడం సిఫార్సు చేయబడుతుంది.",
        ],
      },
    ],
  },
  ta: {
    title: "தலாயில்‑இ ஹயராத் வாசிப்பின் சிறப்புகள்",
    description: "சலாவாத் மற்றும் தலாயில்‑இ ஹயராத் வாசிப்பின் மரபு சிறப்புகள்.",
    sections: [
      {
        heading: "சலாவாத் முக்கியத்துவம்",
        body: [
          "குர்ஆன் மற்றும் சுன்னா நபி ﷺ மீது சலாவாத் கூறுவதை ஊக்குவிக்கின்றன. இது இதயத்தை உயிர்ப்பித்து துஆவுக்கு பரகத்தை தரும் என்று கருதப்படுகிறது.",
          "தலாயில்‑இ ஹயராத் இந்த மரபை தினசரி வாசிப்பாக ஒழுங்குபடுத்துகிறது.",
        ],
      },
      {
        heading: "வாசிப்பின் சிறப்புகள்",
        body: [
          "சலாவாத் தொடர்ச்சியாகச் செய்வது நபி ﷺ மீது உள்ள அன்பை அதிகரித்து உள்ளார்ந்த அமைதியை தரும் என்று மரபில் கூறப்படுகிறது.",
          "இதன் மூலம் நியத்தும் புதுப்பிக்கப்படுகின்றது; திக்ரும் நிலைத்திருகிறது.",
        ],
        bullets: [
          "இதயத்தில் சலாவாத் உணர்வை வலுப்படுத்துகிறது.",
          "துஆ‑திக்ரின் தொடர்ச்சியை உருவாக்குகிறது.",
          "இஸ்திகாமா (தொடர்ச்சி) பழக்கத்தை வளர்க்கிறது.",
        ],
      },
      {
        heading: "தொடர்ச்சியின் பரகத்",
        body: [
          "ஒழுங்கான வாசிப்பால் சிறப்புகள் மேலும் ஆழமாகும். வார இலக்குகள் ஆன்மீக ஒழுக்கத்தை நிலைநிறுத்தும்.",
          "மிஸ்ஸான நாட்களை விரைவில் கஸா செய்வது ரித்மத்தை காக்கும்.",
        ],
      },
      {
        heading: "நியத்தும் ஆதாபும்",
        body: [
          "நெஞ்சார்ந்த நியத்துடன், இயன்றால் வுது செய்து, அமைதியான சூழலில் வாசிப்பது பரிந்துரைக்கப்படுகிறது.",
        ],
      },
    ],
  },
  vi: {
    title: "Đức hạnh của Delail‑i Hayrat",
    description: "Những đức hạnh truyền thống của salawat và việc đọc Delail‑i Hayrat.",
    sections: [
      {
        heading: "Tầm quan trọng của salawat",
        body: [
          "Qur’an và Sunnah khuyến khích gửi salawat đến Nhà Tiên tri ﷺ. Đây là việc làm mang phúc lành cho dua và làm sống dậy trái tim.",
          "Delail‑i Hayrat hệ thống hóa salawat thành chương trình đọc hằng ngày.",
        ],
      },
      {
        heading: "Đức hạnh của việc đọc",
        body: [
          "Truyền thống Hồi giáo nhắc đến sự bình an và tình yêu dành cho Tiên tri được tăng cường nhờ salawat đều đặn.",
          "Việc đọc giúp làm mới ý định và giữ dhikr liên tục.",
        ],
        bullets: [
          "Tăng ý thức salawat trong tim.",
          "Duy trì sự liên tục của dua và dhikr.",
          "Hỗ trợ istiqamah trong thờ phượng.",
        ],
      },
      {
        heading: "Phúc lành của sự đều đặn",
        body: [
          "Lợi ích tinh thần sâu sắc hơn khi duy trì đều đặn. Mục tiêu tuần giúp giữ kỷ luật tâm linh.",
          "Bù ngày bị lỡ kịp thời giúp giữ nhịp đọc.",
        ],
      },
      {
        heading: "Ý định và adab",
        body: [
          "Bắt đầu với ý định chân thành, wudu nếu có thể và đọc trong không gian yên tĩnh.",
        ],
      },
    ],
  },
  ko: {
    title: "달라일‑이 하이라트의 공덕",
    description: "살라왓과 달라일‑이 하이라트 독송의 전통적 공덕과 영적 영향.",
    sections: [
      {
        heading: "살라왓의 중요성",
        body: [
          "꾸란과 순나는 예언자 ﷺ께 살라왓을 올리도록 권합니다. 이는 두아에 바라고(복)을 더하고 마음을 밝히는 기억의 행위입니다.",
          "달라일‑이 하이라트는 이 전통을 일상적 독송으로 체계화한 책입니다.",
        ],
      },
      {
        heading: "독송의 공덕",
        body: [
          "전승에서는 살라왓의 지속이 예언자에 대한 사랑을 깊게 하고 마음에 평안을 준다고 전합니다.",
          "독송은 의도를 새롭게 하며 디크르를 유지하는 데 도움을 줍니다.",
        ],
        bullets: [
          "마음속 살라왓 의식을 강화한다.",
          "두아와 디크르의 연속성을 높인다.",
          "이스티카마(지속성)를 기르는 데 도움된다.",
        ],
      },
      {
        heading: "지속의 바라카",
        body: [
          "규칙적 독송으로 공덕이 더 깊어진다. 주간 목표는 영적 규율을 돕는다.",
          "놓친 날을 빠르게 보충하면 리듬이 유지된다.",
        ],
      },
      {
        heading: "의도와 예절",
        body: [
          "진실한 의도와 평온한 환경, 가능하면 우두(정결) 상태에서 독송하는 것이 권장됩니다.",
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
    path: "/app/info/virtues",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function VirtuesPage({ params }: { params: { locale: Locale } }) {
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
