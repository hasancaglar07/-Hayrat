import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Delail-i Hayrat Faydaları",
    description: "Okumanın ruh dünyasına ve günlük hayata yansıyan faydaları.",
    sections: [
      {
        heading: "Kalbe ve Ruha Etkisi",
        body: [
          "Salavat ve dua ile meşgul olmak, kalpte Allah ve Resûlullah sevgisini diri tutar. Delail-i Hayrat okumaları, düzenli yapıldığında zikir bilincini pekiştirir.",
          "Okuma esnasında kişinin iç dünyasında sükûnet ve tefekkür ortamı oluşur. Bu hâl, manevi dayanıklılığı destekler.",
        ],
      },
      {
        heading: "Günlük Hayatta İstikrar",
        body: [
          "Manevi amellerin sürekliliği, küçük ama devamlı adımlarla mümkündür. Delail-i Hayrat’ı haftalık bir planla okumak, ibadet disiplinini güçlendirir.",
        ],
        bullets: [
          "Güne zikirle başlama alışkanlığı",
          "Dua ve salavatı günlük rutine dahil etme",
          "Hedef ve ilerleme bilinciyle motivasyon",
        ],
      },
      {
        heading: "Topluluk ve Teşvik",
        body: [
          "Okumayı takip eden topluluklar, kişiye yalnız olmadığını hatırlatır. Uygulamadaki sıralama ve puan sistemi bir yarıştan ziyade teşvik ve süreklilik hedefler.",
        ],
      },
      {
        heading: "Okumayı Kolaylaştıran Takip",
        body: [
          "Okuma düzeni bozulduğunda yeniden başlamak zorlaşabilir. Takip sistemi, hangi gün nerede kaldığınızı göstererek tekrar ritme dönmeyi kolaylaştırır.",
          "Kaza günlerini planlı telafi etmek, birikmeyi önler ve moral sağlar.",
        ],
      },
    ],
  },
  en: {
    title: "Benefits of Reading Delail-i Hayrat",
    description: "How regular reading supports spiritual focus and daily consistency.",
    sections: [
      {
        heading: "Impact on the Heart",
        body: [
          "Salawat and dua keep love of Allah and His Messenger alive. Delail-i Hayrat nurtures remembrance through a steady routine.",
          "Reading creates a space for reflection and calmness.",
        ],
      },
      {
        heading: "Consistency in Daily Life",
        body: [
          "Sustainable worship grows through small, regular steps. A weekly Delail-i Hayrat plan strengthens discipline.",
        ],
        bullets: ["Daily remembrance habit", "Renewed intention", "Motivation through clear goals"],
      },
      {
        heading: "Community Encouragement",
        body: [
          "Leaderboards and points are meant to encourage consistency, not rivalry.",
        ],
      },
      {
        heading: "Tracking Helps You Return",
        body: [
          "When routines break, tracking shows where you left off and helps you resume. Makeup days prevent backlog.",
        ],
      },
    ],
  },
  ar: {
    title: "فوائد قراءة دلائل الخيرات",
    description: "كيف تعين المداومة على القراءة في الصفاء الروحي والاستمرار.",
    sections: [
      {
        heading: "أثرها على القلب",
        body: [
          "الإكثار من الصلوات والدعاء يحيي محبة الله ورسوله ﷺ. دلائل الخيرات يعين على دوام الذكر بنظام واضح.",
          "تمنح القراءة مساحة للسكينة والتفكر.",
        ],
      },
      {
        heading: "الاستمرار في الحياة اليومية",
        body: [
          "تنمو العبادات بالخطوات الصغيرة المنتظمة. خطة أسبوعية للقراءة تعزز الانضباط.",
        ],
        bullets: ["عادة ذكر يومية", "تجديد النية", "تحفيز عبر هدف واضح"],
      },
      {
        heading: "تشجيع المجتمع",
        body: [
          "لوحة الصدارة والنقاط هدفها التشجيع على الاستمرار لا المنافسة.",
        ],
      },
      {
        heading: "أهمية المتابعة",
        body: [
          "عند انقطاع الروتين، تساعدك المتابعة على معرفة موضعك والعودة بسهولة، ويمنع القضاء تراكم الفوات.",
        ],
      },
    ],
  },
  zh: {
    title: "阅读《达莱勒·海拉特》的益处",
    description: "规律诵读带来的心灵滋养、生活节律与精神收益。",
    sections: [
      {
        heading: "对心灵的影响",
        body: [
          "萨拉瓦特与祈祷能让心灵保持清明，提醒我们与真主及其使者的联系。《达莱勒·海拉特》通过系统化的文本帮助这种记念更持续地发生。",
          "在安静专注的读诵中，人更容易进入沉思与平和的状态，这种内在宁静会反映到日常情绪与行为上。",
        ],
      },
      {
        heading: "日常生活中的持续性",
        body: [
          "精神修养的增长来自小步而持续的实践。按周计划读诵，使功修成为生活的一部分，而不是偶尔的冲动。",
        ],
        bullets: [
          "培养以记念开启一天的习惯。",
          "让祈祷与萨拉瓦特融入日常节奏。",
          "通过明确目标与进度保持动力。",
        ],
      },
      {
        heading: "社群与鼓励",
        body: [
          "与他人一起坚持读诵会带来温和的相互激励。应用中的排行榜与积分不是竞争，而是提醒我们共同走在同一条道路上。",
        ],
      },
      {
        heading: "追踪帮助你回到节奏",
        body: [
          "当生活打乱读诵节奏时，明确的追踪能显示你停在何处，帮助你轻松恢复。",
          "及时补读避免积压，也让你重新找回稳定的心态。",
        ],
      },
    ],
  },
  hi: {
    title: "देलाइल‑ए‑हयرات पढ़ने के फायदे",
    description: "नियमित पाठ से मिलने वाले आत्मिक, मानसिक और दैनिक‑जीवन के लाभ।",
    sections: [
      {
        heading: "दिल और रूह पर असर",
        body: [
          "सलावत और दुआ दिल को ज़िंदा रखती हैं और अल्लाह व रसूल ﷺ की याद को मज़बूत करती हैं। देलाइल‑ए‑हयرات इस याद को व्यवस्थित रोज़ाना अभ्यास में बदल देता है।",
          "पाठ के दौरान सुकून और तफ़क्कुर का माहौल बनता है, जो मन की स्थिरता और आत्मिक ताक़त बढ़ाता है।",
        ],
      },
      {
        heading: "दैनिक जीवन में इस्तिक़ामत",
        body: [
          "इबादत की निरंतरता छोटे लेकिन लगातार कदमों से बनती है। साप्ताहिक योजना पाठ को जीवन का हिस्सा बनाती है।",
        ],
        bullets: [
          "दिन की शुरुआत ज़िक्र से करने की आदत।",
          "दुआ और सलावत को नियमित रुटीन में शामिल करना।",
          "लक्ष्य और प्रगति देखकर प्रेरणा पाना।",
        ],
      },
      {
        heading: "संगति और प्रोत्साहन",
        body: [
          "पाठ करने वाले समुदाय से व्यक्ति को सहारा और प्रेरणा मिलती है। पॉइंट/लीडरबोर्ड का उद्देश्य प्रतिस्पर्धा नहीं, बल्कि हौसला बढ़ाना है।",
        ],
      },
      {
        heading: "ट्रैकिंग से रुटीन वापस आता है",
        body: [
          "जब रुटीन टूट जाए तो ट्रैकिंग बताती है कि आप कहाँ रुके थे, जिससे दोबारा शुरू करना आसान होता है।",
          "क़ज़ा दिनों को समय पर पूरा करना जमा होने से बचाता है।",
        ],
      },
    ],
  },
  es: {
    title: "Beneficios de leer Delail‑i Hayrat",
    description: "Cómo la lectura regular fortalece el corazón y la constancia diaria.",
    sections: [
      {
        heading: "Impacto en el corazón",
        body: [
          "Las salawat y las súplicas mantienen vivo el amor a Allah y a Su Mensajero ﷺ. Delail‑i Hayrat ordena este recuerdo en una práctica diaria.",
          "La lectura pausada genera serenidad y reflexión, apoyando la resiliencia espiritual.",
        ],
      },
      {
        heading: "Constancia en la vida diaria",
        body: [
          "La adoración sostenible se construye con pasos pequeños pero continuos. Un plan semanal ayuda a integrar la lectura en el ritmo de vida.",
        ],
        bullets: [
          "Crear un hábito diario de dhikr.",
          "Mantener la intención renovada.",
          "Motivarse con metas y progreso visibles.",
        ],
      },
      {
        heading: "Comunidad y ánimo",
        body: [
          "Compartir el camino con otros lectores recuerda que no estamos solos. Los puntos y la clasificación buscan motivar, no competir.",
        ],
      },
      {
        heading: "El seguimiento facilita volver",
        body: [
          "Si se rompe la rutina, el seguimiento muestra dónde quedaste y ayuda a retomar sin agobio.",
          "Las lecturas de reposición evitan la acumulación y protegen la estabilidad.",
        ],
      },
    ],
  },
  fr: {
    title: "Bienfaits de la lecture de Delail‑i Hayrat",
    description: "Les effets spirituels et pratiques d’une lecture régulière.",
    sections: [
      {
        heading: "Effet sur le cœur",
        body: [
          "Les salawat et les invocations entretiennent l’amour d’Allah et de Son Messager ﷺ. Delail‑i Hayrat aide à en faire une pratique quotidienne.",
          "La récitation apporte un climat de sérénité et de réflexion, renforçant la stabilité intérieure.",
        ],
      },
      {
        heading: "Constance au quotidien",
        body: [
          "La régularité se construit avec de petits pas continus. Une planification hebdomadaire rend la lecture durable.",
        ],
        bullets: [
          "Habitude de dhikr chaque jour.",
          "Intention renouvelée.",
          "Motivation par des objectifs clairs.",
        ],
      },
      {
        heading: "Soutien de la communauté",
        body: [
          "Voir d’autres lecteurs poursuivre le même chemin encourage avec douceur. Les points et classements servent surtout de rappel et d’émulation.",
        ],
      },
      {
        heading: "Le suivi aide à reprendre",
        body: [
          "Quand le rythme se brise, le suivi indique où reprendre. Les jours de rattrapage évitent l’accumulation.",
        ],
      },
    ],
  },
  bn: {
    title: "দালাইল‑ই হায়রাত পাঠের উপকারিতা",
    description: "নিয়মিত পাঠ আত্মিক প্রশান্তি ও জীবনের ধারাবাহিকতা গঠনে কীভাবে সহায়ক।",
    sections: [
      {
        heading: "হৃদয় ও রুহে প্রভাব",
        body: [
          "সালাওয়াত ও দোয়া হৃদয়ে আল্লাহ ও রাসূল ﷺ‑এর ভালোবাসা জাগ্রত রাখে। দালাইল‑ই হায়রাত এই স্মরণকে নিয়মিত পাঠের ধারায় পরিণত করে।",
          "পাঠের সময় সুকুন ও চিন্তার পরিবেশ তৈরি হয়, যা আত্মিক শক্তি বাড়ায়।",
        ],
      },
      {
        heading: "দৈনন্দিন জীবনে ধারাবাহিকতা",
        body: [
          "ইবাদতের স্থায়িত্ব আসে ছোট কিন্তু নিয়মিত অভ্যাস থেকে। সাপ্তাহিক পরিকল্পনা এই অভ্যাসকে দৃঢ় করে।",
        ],
        bullets: [
          "প্রতিদিন যিকিরের অভ্যাস গড়ে তোলা।",
          "নিয়ত নবায়ন করে রাখা।",
          "লক্ষ্য ও অগ্রগতিতে প্রেরণা পাওয়া।",
        ],
      },
      {
        heading: "কমিউনিটি ও উৎসাহ",
        body: [
          "অন্য পাঠকদের সাথে থাকা ব্যক্তি‑কে প্রেরণা দেয়। পয়েন্ট ও র‍্যাঙ্কিং প্রতিযোগিতা নয়, বরং উৎসাহের মাধ্যম।",
        ],
      },
      {
        heading: "ট্র্যাকিং রুটিনে ফিরতে সাহায্য করে",
        body: [
          "রুটিন ভেঙে গেলে ট্র্যাকিং জানায় কোথা থেকে শুরু করতে হবে। ক্বাযা পাঠ জমে যাওয়া রোধ করে।",
        ],
      },
    ],
  },
  pt: {
    title: "Benefícios de ler Delail‑i Hayrat",
    description: "Como a leitura regular fortalece o foco espiritual e a constância.",
    sections: [
      {
        heading: "Impacto no coração",
        body: [
          "Salawat e dua mantêm viva a lembrança de Allah e do Seu Mensageiro ﷺ. Delail‑i Hayrat organiza essa lembrança em prática diária.",
          "A leitura traz serenidade e reflexão, fortalecendo a resistência espiritual.",
        ],
      },
      {
        heading: "Constância na vida diária",
        body: [
          "A prática sustentável nasce de passos pequenos e contínuos. Um plano semanal integra a leitura ao cotidiano.",
        ],
        bullets: [
          "Hábito diário de dhikr.",
          "Intenção renovada.",
          "Motivação com metas claras.",
        ],
      },
      {
        heading: "Incentivo comunitário",
        body: [
          "Ver outros leitores perseverando ajuda a manter ânimo. Pontos e rankings existem para encorajar, não competir.",
        ],
      },
      {
        heading: "O acompanhamento ajuda a retomar",
        body: [
          "Quando a rotina falha, o acompanhamento mostra onde você parou e facilita voltar. Leitura de reposição evita acúmulos.",
        ],
      },
    ],
  },
  ru: {
    title: "Польза чтения Далаиль‑и Хайрат",
    description: "Как регулярное чтение поддерживает духовную сосредоточенность и ежедневную устойчивость.",
    sections: [
      {
        heading: "Влияние на сердце",
        body: [
          "Салаваты и мольбы оживляют любовь к Аллаху и Его Посланнику ﷺ. Далаиль‑и Хайрат помогает сделать это поминание регулярным.",
          "Чтение создаёт пространство спокойствия и размышления, укрепляя духовную стойкость.",
        ],
      },
      {
        heading: "Устойчивость в повседневности",
        body: [
          "Постоянство рождается из небольших, но ежедневных шагов. Недельный план делает чтение частью жизни.",
        ],
        bullets: [
          "Привычка ежедневного зикра.",
          "Постоянное обновление намерения.",
          "Мотивация через видимый прогресс.",
        ],
      },
      {
        heading: "Поддержка сообщества",
        body: [
          "Общие цели и взаимное поощрение помогают не чувствовать себя одиноким. Очки и рейтинги предназначены для поддержки, а не соперничества.",
        ],
      },
      {
        heading: "Отслеживание помогает вернуться",
        body: [
          "Если ритм нарушился, отслеживание показывает, где вы остановились. Восполнение пропусков не даёт им накапливаться.",
        ],
      },
    ],
  },
  ur: {
    title: "دلائلِ خیرات پڑھنے کے فوائد",
    description: "باقاعدہ تلاوت دل کی صفائی اور روزمرہ استقامت میں کیسے مدد دیتی ہے۔",
    sections: [
      {
        heading: "دل اور روح پر اثر",
        body: [
          "درود و دعا دل میں اللہ اور رسول ﷺ کی محبت کو تازہ رکھتے ہیں۔ دلائلِ خیرات ان اذکار کو باقاعدہ روزانہ کی تلاوت میں ڈھالتی ہے۔",
          "تلاوت کے دوران سکون اور غور و فکر کا ماحول بنتا ہے جو روحانی قوت بڑھاتا ہے۔",
        ],
      },
      {
        heading: "روزمرہ زندگی میں استقامت",
        body: [
          "عبادت کی پائیداری چھوٹے مگر مسلسل قدموں سے بنتی ہے۔ ہفتہ وار منصوبہ تلاوت کو معمول میں شامل کرتا ہے۔",
        ],
        bullets: [
          "روزانہ ذکر کی عادت بنانا۔",
          "نیت کو تازہ رکھنا۔",
          "واضح اہداف سے حوصلہ پانا۔",
        ],
      },
      {
        heading: "کمیونٹی اور حوصلہ افزائی",
        body: [
          "دیگر قارئین کے ساتھ سفر کا احساس نرمی سے حوصلہ دیتا ہے۔ پوائنٹس اور درجہ بندی مقابلہ نہیں بلکہ ترغیب کے لیے ہیں۔",
        ],
      },
      {
        heading: "ٹریکنگ واپس لوٹنے میں مدد دیتی ہے",
        body: [
          "جب معمول ٹوٹ جائے تو ٹریکنگ بتاتی ہے کہاں سے دوبارہ شروع کرنا ہے۔ قضا دن جمع ہونے سے بچ جاتے ہیں۔",
        ],
      },
    ],
  },
  id: {
    title: "Manfaat membaca Dalā’il al‑Khairāt",
    description: "Bagaimana bacaan yang rutin menumbuhkan ketenangan dan konsistensi harian.",
    sections: [
      {
        heading: "Dampak pada hati",
        body: [
          "Salawat dan doa menghidupkan cinta kepada Allah dan Rasul‑Nya ﷺ. Dalā’il al‑Khairāt membantu menjadikannya rutinitas harian.",
          "Bacaan yang tenang menumbuhkan suasana tafakur dan ketenangan batin.",
        ],
      },
      {
        heading: "Konsistensi dalam kehidupan",
        body: [
          "Istiqamah tumbuh dari langkah kecil yang terus‑menerus. Rencana mingguan memudahkan bacaan menjadi bagian hidup.",
        ],
        bullets: [
          "Kebiasaan dzikir setiap hari.",
          "Niat yang terus diperbarui.",
          "Motivasi lewat target yang jelas.",
        ],
      },
      {
        heading: "Dukungan komunitas",
        body: [
          "Melihat orang lain berusaha menjaga bacaan memberi semangat. Poin dan papan peringkat dibuat untuk dorongan, bukan persaingan.",
        ],
      },
      {
        heading: "Pelacakan membantu kembali",
        body: [
          "Saat rutinitas terputus, pelacakan menunjukkan di mana harus melanjutkan. Qadha mencegah bacaan menumpuk.",
        ],
      },
    ],
  },
  de: {
    title: "Vorteile des Lesens von Delail‑i Hayrat",
    description: "Wie regelmäßige Rezitation Herz und Alltag stärkt.",
    sections: [
      {
        heading: "Wirkung auf das Herz",
        body: [
          "Salawat und Dua halten die Liebe zu Allah und Seinem Gesandten ﷺ lebendig. Delail‑i Hayrat macht daraus eine klare tägliche Praxis.",
          "Die ruhige Rezitation schafft Raum für Besinnung und innere Ruhe.",
        ],
      },
      {
        heading: "Beständigkeit im Alltag",
        body: [
          "Nachhaltige Anbetung entsteht durch kleine, regelmäßige Schritte. Ein Wochenplan hilft, die Lektüre fest zu verankern.",
        ],
        bullets: [
          "Tägliche Dhikr‑Gewohnheit.",
          "Erneuerte Absicht.",
          "Motivation durch sichtbaren Fortschritt.",
        ],
      },
      {
        heading: "Gemeinschaftliche Ermutigung",
        body: [
          "Gemeinsam zu lesen erinnert daran, dass man nicht allein ist. Punkte und Rankings sollen ermutigen, nicht rivalisieren.",
        ],
      },
      {
        heading: "Tracking erleichtert den Wiedereinstieg",
        body: [
          "Wenn der Rhythmus bricht, zeigt Tracking, wo man weitermacht. Nachhol‑Tage verhindern Rückstände.",
        ],
      },
    ],
  },
  ja: {
    title: "ダラーイル・ハイラート読誦の恩恵",
    description: "規則的な読誦が心と日常にもたらす恩恵。",
    sections: [
      {
        heading: "心への影響",
        body: [
          "サラワートとドゥアは心にアッラーとその使徒 ﷺ への愛を保ちます。ダラーイル・ハイラートはそれを日々の習慣に整えます。",
          "落ち着いて読むことで内面の静けさと省察が育まれます。",
        ],
      },
      {
        heading: "日常の継続性",
        body: [
          "持続的な عبادは小さくても継続する歩みから生まれます。週間計画は読誦を生活に組み込みます。",
        ],
        bullets: [
          "毎日のズィクル習慣。",
          "意図を繰り返し新たにする。",
          "目標と進捗で励みを得る。",
        ],
      },
      {
        heading: "共同体の励まし",
        body: [
          "同じ道を歩む読者の存在はやさしい励ましになります。ポイントやランキングは競争ではなく奨励のためです。",
        ],
      },
      {
        heading: "記録が再開を助ける",
        body: [
          "リズムが崩れても記録がどこから再開するか示してくれます。補読は滞りを防ぎます。",
        ],
      },
    ],
  },
  sw: {
    title: "Faida za kusoma Delail‑i Hayrat",
    description: "Jinsi usomaji wa mara kwa mara unavyosaidia utulivu wa moyo na uthabiti wa kila siku.",
    sections: [
      {
        heading: "Athari kwa moyo",
        body: [
          "Salawat na dua huweka mapenzi ya Allah na Mtume ﷺ hai. Delail‑i Hayrat huifanya dhikr hii kuwa ya kila siku.",
          "Usomaji wa utulivu huleta tafakuri na amani ya ndani.",
        ],
      },
      {
        heading: "Uthabiti katika maisha",
        body: [
          "Uthabiti wa kiroho hutokana na hatua ndogo zinazoendelea. Mpango wa wiki huingiza usomaji katika ratiba ya maisha.",
        ],
        bullets: [
          "Kawaida ya dhikr kila siku.",
          "Nia inayohuishwa mara kwa mara.",
          "Motisha kupitia malengo wazi.",
        ],
      },
      {
        heading: "Hamasa ya jamii",
        body: [
          "Kusoma pamoja na wengine huongeza moyo. Pointi na uorodheshaji ni kwa hamasa, si mashindano.",
        ],
      },
      {
        heading: "Ufuatiliaji husaidia kurudi",
        body: [
          "Ufuatiliaji unaonyesha ulipoishia na husaidia kuendelea tena. Siku za kulipa haziruhusu mambo kukusanyika.",
        ],
      },
    ],
  },
  mr: {
    title: "दलाईल‑ए‑हयرات वाचनाचे फायदे",
    description: "नियमित वाचनाने मिळणारे आत्मिक व दैनंदिन जीवनातील फायदे.",
    sections: [
      {
        heading: "हृदयावर परिणाम",
        body: [
          "सलावत व दुआ अल्लाह व रसूल ﷺ ची आठवण जिवंत ठेवतात. दलाईल‑ए‑हयرات हे स्मरण रोजच्या सवयीमध्ये आणते.",
          "शांत वाचन मनाला सुकून देते व विचारशीलता वाढवते.",
        ],
      },
      {
        heading: "दैनंदिन सातत्य",
        body: [
          "इबादतीची स्थिरता छोट्या पण नियमित पावलांनी येते. आठवड्याचा प्लॅन वाचन टिकवतो.",
        ],
        bullets: [
          "दररोज झिक्रची सवय.",
          "नीयत वेळोवेळी ताजी ठेवणे.",
          "लक्ष्य व प्रगतीमुळे प्रेरणा.",
        ],
      },
      {
        heading: "समुदायाचा आधार",
        body: [
          "इतर वाचकांचा सहभाग सौम्य प्रोत्साहन देतो. पॉइंट्स व रँकिंगचा हेतू हौसला वाढवणे आहे.",
        ],
      },
      {
        heading: "ट्रॅकिंग रुटीन परत आणते",
        body: [
          "रुटीन तुटल्यावर ट्रॅकिंग पुढे कुठून सुरू करायचे ते दाखवते. क़ज़ा दिवस जमा होत नाहीत.",
        ],
      },
    ],
  },
  te: {
    title: "దలాయిల్‑ఇ హయరాత్ చదవడం యొక్క లాభాలు",
    description: "నిరంతర పఠనం ఆధ్యాత్మిక కేంద్రీకరణను మరియు దైనందిన స్థిరత్వాన్ని ఎలా బలపరుస్తుందో.",
    sections: [
      {
        heading: "హృదయంపై ప్రభావం",
        body: [
          "సలావాత్ మరియు దువా అల্লাহ మరియు ఆయన ప్రవక్త ﷺ పై ప్రేమను నిలబెడతాయి. దలాయిల్‑ఇ హయరాత్ దీనిని రోజువారీ అలవాటుగా మార్చుతుంది.",
          "శాంతంగా చదవడం తఫక్కుర్‌కు దారి తీసి అంతరంగ సుకూన్‌ను పెంచుతుంది.",
        ],
      },
      {
        heading: "దైనందిన నిరంతరత",
        body: [
          "ఆరాధనలో స్థిరత్వం చిన్న కానీ నిరంతర అడుగులతో వస్తుంది. వారపు ప్రణాళిక పఠనాన్ని జీవితంలో భాగం చేస్తుంది.",
        ],
        bullets: [
          "రోజూ జిక్ర్ అలవాటు.",
          "నీయతను తరచూ పునరుద్ధరించడం.",
          "స్పష్టమైన లక్ష్యాల ద్వారా ప్రేరణ.",
        ],
      },
      {
        heading: "సమాజ ప్రోత్సాహం",
        body: [
          "ఇతరులు కూడా కొనసాగిస్తున్నారని చూడటం మనల్ని ప్రోత్సహిస్తుంది. పాయింట్లు/ర్యాంకింగ్ పోటీకి కాదు, ఉత్సాహానికి.",
        ],
      },
      {
        heading: "ట్రాకింగ్ తిరిగి ప్రారంభించడంలో సహాయం",
        body: [
          "రిథమ్ తప్పినప్పుడు ట్రాకింగ్ ఎక్కడ ఆపారో చూపుతుంది. క఼దా చదవడం నిల్వకాకుండా చేస్తుంది.",
        ],
      },
    ],
  },
  ta: {
    title: "தலாயில்‑இ ஹயராத் வாசிப்பின் பயன்கள்",
    description: "நிரந்தர வாசிப்பு ஆன்மீக கவனம் மற்றும் தினசரி நிலைத்தன்மையை எவ்வாறு வளர்க்கிறது.",
    sections: [
      {
        heading: "இதயத்திற்கு ஏற்படும் தாக்கம்",
        body: [
          "சலாவாத் மற்றும் துஆ அல்லாஹ் மற்றும் அவரது தூதர் ﷺ மீது உள்ள அன்பை உயிர்ப்பாக வைத்திருக்கும். தலாயில்‑இ ஹயராத் இதை தினசரி வழக்கமாக்குகிறது.",
          "அமைதியான வாசிப்பு தஃபக்குர் மற்றும் உள்ளார்ந்த அமைதியை வளர்க்கிறது.",
        ],
      },
      {
        heading: "தினசரி தொடர்ச்சி",
        body: [
          "ஆராதனையின் நிலைத்தன்மை சிறிய ஆனால் தொடர்ச்சியான அடிகளால் உருவாகிறது. வாரத் திட்டம் வாசிப்பை வாழ்க்கையின் பகுதியாக்கும்.",
        ],
        bullets: [
          "தினசரி திக்ர் பழக்கம்.",
          "நியத்தை மீண்டும் மீண்டும் புதுப்பித்தல்.",
          "தெளிவான இலக்குகளால் ஊக்கம்.",
        ],
      },
      {
        heading: "சமூக ஊக்கம்",
        body: [
          "மற்ற வாசகர்களுடன் இந்தப் பயணம் தொடர்வது மனதை ஊக்குவிக்கிறது. பாயிண்ட்கள் போட்டிக்காக அல்ல, ஊக்கத்திற்காக.",
        ],
      },
      {
        heading: "டிராக்கிங் மீண்டும் தொடங்க உதவுகிறது",
        body: [
          "ரிதம் உடைந்தால், டிராக்கிங் எங்கு நிறுத்தியுள்ளோம் என்பதை காட்டும். கஸா வாசிப்பு சேரக்கூடாமல் காப்பாற்றும்.",
        ],
      },
    ],
  },
  vi: {
    title: "Lợi ích khi đọc Delail‑i Hayrat",
    description: "Đọc đều đặn giúp nuôi dưỡng tâm hồn và giữ nhịp sống ổn định.",
    sections: [
      {
        heading: "Tác động lên trái tim",
        body: [
          "Salawat và dua làm sống dậy tình yêu dành cho Allah và Nhà Tiên tri ﷺ. Delail‑i Hayrat đưa việc này thành thói quen hằng ngày.",
          "Đọc trong sự tĩnh lặng tạo không gian suy ngẫm và bình an nội tâm.",
        ],
      },
      {
        heading: "Sự đều đặn trong đời sống",
        body: [
          "Sự bền bỉ đến từ những bước nhỏ liên tục. Kế hoạch tuần giúp việc đọc trở thành phần tự nhiên của cuộc sống.",
        ],
        bullets: [
          "Thói quen dhikr mỗi ngày.",
          "Ý định luôn được làm mới.",
          "Động lực nhờ mục tiêu rõ ràng.",
        ],
      },
      {
        heading: "Khích lệ từ cộng đồng",
        body: [
          "Cộng đồng đọc chung nhắc rằng ta không đơn độc. Điểm và bảng xếp hạng nhằm khích lệ chứ không cạnh tranh.",
        ],
      },
      {
        heading: "Theo dõi giúp bạn quay lại",
        body: [
          "Khi nhịp đọc bị gián đoạn, theo dõi cho biết bạn dừng ở đâu và dễ dàng tiếp tục. Đọc bù tránh việc tồn đọng.",
        ],
      },
    ],
  },
  ko: {
    title: "달라일‑이 하이라트 독송의 이점",
    description: "규칙적 독송이 마음의 평안과 일상적 지속성을 돕는 방식.",
    sections: [
      {
        heading: "마음에 미치는 영향",
        body: [
          "살라왓과 두아는 알라와 그분의 사도 ﷺ에 대한 사랑을 살아 있게 합니다. 달라일‑이 하이라트는 이를 매일의 습관으로 만들어 줍니다.",
          "차분한 독송은 성찰과 내적 평안을 키워 영적 회복력을 돕습니다.",
        ],
      },
      {
        heading: "일상의 지속성",
        body: [
          "지속 가능한 عباد는 작은 실천의 반복에서 자랍니다. 주간 계획은 독송을 삶에 자연스럽게 통합합니다.",
        ],
        bullets: [
          "매일 디크르를 하는 습관.",
          "의도를 자주 새로 고침.",
          "분명한 목표로 동기 유지.",
        ],
      },
      {
        heading: "공동체의 격려",
        body: [
          "함께 읽는 공동체는 서로를 부드럽게 격려합니다. 포인트와 랭킹은 경쟁이 아니라 지속성을 위한 자극입니다.",
        ],
      },
      {
        heading: "기록이 재개를 돕는다",
        body: [
          "리듬이 끊겨도 기록은 어디서 다시 시작할지 보여 줍니다. 보충 독송은 누적을 막습니다.",
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
    path: "/app/info/benefits-of-reading",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function BenefitsOfReadingPage({ params }: { params: { locale: Locale } }) {
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
