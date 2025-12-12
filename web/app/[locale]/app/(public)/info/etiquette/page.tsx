import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Delail-i Hayrat Okuma Adabı",
    description: "Okumayı daha bilinçli ve düzenli kılmak için tavsiye edilen adab ve ipuçları.",
    sections: [
      {
        heading: "Niyet ve Hazırlık",
        body: [
          "Okumaya başlamadan önce niyet tazelemek ve okumanın Allah rızası için yapıldığını hatırlamak önemlidir.",
          "Mümkünse abdestli olmak, sakin bir mekân seçmek ve telefonu sessize almak odaklanmaya yardımcı olur.",
        ],
      },
      {
        heading: "Zaman ve Mekân Seçimi",
        body: [
          "Günlük hayatın en müsait zamanını belirlemek istikrarın anahtarıdır. Sabah erken saatler, yatsı sonrası veya gün içinde kısa bir vakit olabilir.",
          "Aynı zaman diliminde okumaya çalışmak, alışkanlık oluşturur.",
        ],
      },
      {
        heading: "Okuma Usulü",
        body: [
          "Metni ağır ağır, anlamını tefekkür ederek okumak tavsiye edilir. Arapça metnin yanında meal veya transkripsiyon okumak anlam bağını güçlendirebilir.",
          "Hatalı okuduğunuzu düşünüyorsanız panik yapmadan devam edin; zamanla doğruluk artar.",
        ],
      },
      {
        heading: "Kaçırılan Günler ve Kaza",
        body: [
          "Bazı günler okumayı kaçırmak doğal olabilir. Önemli olan bunu birikmeden telafi etmek ve ritmi sürdürmektir.",
          "Uygulamada “Kaza olarak oku” modu ile kaçan günleri planlı şekilde tamamlayabilirsiniz.",
        ],
      },
      {
        heading: "Uygulama İpuçları",
        body: [
          "Haftalık hedefinizi gerçekçi tutun. Yeni başlayanlar için 3–4 gün bile güçlü bir başlangıçtır.",
          "Puan ve streak sizi teşvik etmek için vardır; asıl hedef, samimiyetle devam etmektir.",
        ],
      },
    ],
  },
  en: {
    title: "Etiquette of Reading Delail-i Hayrat",
    description: "Practical adab and tips for mindful, consistent reading.",
    sections: [
      {
        heading: "Intention and Preparation",
        body: [
          "Begin with sincere intention for Allah’s sake. Wudu and a calm space help focus.",
        ],
      },
      {
        heading: "Choosing Time and Place",
        body: [
          "Pick a stable daily slot that fits your routine. Repeating the same time builds habit.",
        ],
      },
      {
        heading: "Reading Method",
        body: [
          "Read calmly, with reflection. If helpful, follow Arabic with translation or transliteration.",
        ],
      },
      {
        heading: "Missed Days and Makeup",
        body: [
          "Missing a day can happen; make it up without delay and keep the rhythm. Use makeup mode in the App.",
        ],
      },
      {
        heading: "App Tips",
        body: [
          "Set realistic weekly goals. Points and streaks are for encouragement; sincerity matters most.",
        ],
      },
    ],
  },
  ar: {
    title: "آداب قراءة دلائل الخيرات",
    description: "نصائح عملية للقراءة بوعي واستمرار.",
    sections: [
      {
        heading: "النية والاستعداد",
        body: [
          "ابدأ بنية صادقة لله تعالى. الوضوء والمكان الهادئ يعينان على التركيز.",
        ],
      },
      {
        heading: "اختيار الوقت",
        body: [
          "اختر وقتاً ثابتاً يناسب يومك، فالاستمرار يبنى بالتكرار.",
        ],
      },
      {
        heading: "طريقة القراءة",
        body: [
          "اقرأ بتؤدة وتفكر، ويمكن متابعة المعنى عبر الترجمة أو النقل الصوتي.",
        ],
      },
      {
        heading: "القضاء عند الفوات",
        body: [
          "قد يفوتك يوم أحياناً، فاقضه دون تأخير واحفظ الإيقاع عبر وضع القضاء في التطبيق.",
        ],
      },
      {
        heading: "نصائح عبر التطبيق",
        body: [
          "حدد هدفاً أسبوعياً واقعياً. النقاط والسلسلة للتشجيع، والأهم الإخلاص.",
        ],
      },
    ],
  },
  zh: {
    title: "《达莱勒·海拉特》诵读礼仪",
    description: "帮助你更有意识、更稳定地诵读的礼仪与实用建议。",
    sections: [
      {
        heading: "意向与准备",
        body: [
          "开始前先更新意向，提醒自己以求真主喜悦与亲近先知 ﷺ 为目的。",
          "尽量在净礼（wudu）状态下读诵，选择安静的空间并减少干扰。",
        ],
      },
      {
        heading: "时间与环境选择",
        body: [
          "固定的读诵时间有助于形成习惯。可以选择清晨、夜间礼拜后或一天中最平静的时段。",
          "同一时间段持续读诵，会让心自然进入专注状态。",
        ],
      },
      {
        heading: "诵读方式",
        body: [
          "建议缓慢诵读、体会含义。若需要，可结合译文或音译以加深理解与专注。",
          "对读诵不必过度紧张，保持谦逊与持续，熟练会逐渐提高。",
        ],
      },
      {
        heading: "遗漏与补读",
        body: [
          "偶尔遗漏是正常的，关键在于不要让其积压。尽早补读能帮助保持节奏。",
          "应用中的补读模式可让你按计划完成欠缺部分。",
        ],
      },
      {
        heading: "应用小贴士",
        body: [
          "每周目标要现实可行，初学者从3–4天开始也很好。积分与连续天数只是鼓励工具，核心是诚心与恒常。",
        ],
      },
    ],
  },
  hi: {
    title: "देलाइल‑ए‑हयرات पढ़ने का अदब",
    description: "सजग और नियमित पाठ के लिए व्यावहारिक अदब और सुझाव।",
    sections: [
      {
        heading: "नीयत और तैयारी",
        body: [
          "पाठ शुरू करने से पहले नीयत ताज़ा करें और अल्लाह की रज़ा के लिए पढ़ने का इरादा दिल में रखें।",
          "मुमकिन हो तो वुज़ू के साथ, शांत जगह पर और ध्यान‑भंग करने वाली चीज़ों से दूर बैठें।",
        ],
      },
      {
        heading: "समय और स्थान चुनना",
        body: [
          "रोज़ का एक तय समय आदत बनाने में मदद करता है। सुबह, इशा के बाद या दिन का शांत हिस्सा चुन सकते हैं।",
          "एक ही समय पर पढ़ने से मन जल्दी एकाग्र होता है।",
        ],
      },
      {
        heading: "पढ़ने की विधि",
        body: [
          "धीमे‑धीमे और अर्थ पर ध्यान देते हुए पढ़ें। ज़रूरत हो तो अरबी के साथ अनुवाद/लिप्यंतरण देखें।",
          "गलती का डर न रखें; शांत मन से पढ़ते रहें, समय के साथ सुधार होगा।",
        ],
      },
      {
        heading: "छूटे दिन और क़ज़ा",
        body: [
          "कभी‑कभी दिन छूट जाना स्वाभाविक है। उन्हें जल्दी क़ज़ा करके रुटीन बनाए रखें।",
          "ऐप का makeup मोड छूटे दिनों को व्यवस्थित ढंग से पूरा करने में सहायक है।",
        ],
      },
      {
        heading: "ऐप टिप्स",
        body: [
          "साप्ताहिक लक्ष्य यथार्थ रखें। पॉइंट और स्ट्रीक केवल प्रोत्साहन के लिए हैं; असल मकसद इख़लास और निरंतरता है।",
        ],
      },
    ],
  },
  es: {
    title: "Adab de lectura de Delail‑i Hayrat",
    description: "Consejos prácticos para una lectura consciente y constante.",
    sections: [
      {
        heading: "Intención y preparación",
        body: [
          "Antes de comenzar, renueva tu intención buscando la complacencia de Allah. Recuerda que la constancia nace de una intención sincera.",
          "Si es posible, realiza la ablución y elige un lugar tranquilo con pocas distracciones.",
        ],
      },
      {
        heading: "Elegir tiempo y lugar",
        body: [
          "Un horario fijo facilita el hábito: al amanecer, después de ‘isha o en un momento sereno del día.",
          "Leer a la misma hora ayuda a que la mente entre en ritmo con facilidad.",
        ],
      },
      {
        heading: "Método de lectura",
        body: [
          "Lee con calma y reflexión. Acompañar el árabe con traducción o transliteración puede fortalecer la comprensión.",
          "No te preocupes en exceso por los errores; la regularidad mejora la fluidez.",
        ],
      },
      {
        heading: "Días perdidos y reposición",
        body: [
          "Perder un día puede pasar. Lo importante es reponerlo pronto para no acumular atrasos.",
          "El modo de reposición en la app te ayuda a completar los días pendientes.",
        ],
      },
      {
        heading: "Consejos en la app",
        body: [
          "Mantén objetivos semanales realistas. Los puntos y rachas son para animarte; lo esencial es la sinceridad.",
        ],
      },
    ],
  },
  fr: {
    title: "Adab de la lecture de Delail‑i Hayrat",
    description: "Conseils pratiques pour une récitation consciente et régulière.",
    sections: [
      {
        heading: "Intention et préparation",
        body: [
          "Avant de lire, renouvelle ton intention en cherchant l’agrément d’Allah. La sincérité est la base de la constance.",
          "Si possible, fais les ablutions et installe‑toi dans un endroit calme.",
        ],
      },
      {
        heading: "Choisir le bon moment",
        body: [
          "Fixer une heure stable facilite l’habitude : tôt le matin, après ‘isha ou à un moment paisible.",
          "La répétition au même horaire aide le cœur et l’esprit à se préparer naturellement.",
        ],
      },
      {
        heading: "Méthode de récitation",
        body: [
          "Récite lentement avec attention au sens. Lire la traduction ou la translittération peut aider.",
          "Ne te décourage pas si tu te trompes : la régularité améliore la maîtrise.",
        ],
      },
      {
        heading: "Jours manqués et rattrapage",
        body: [
          "Il est normal de manquer un jour parfois. Rattrape‑le rapidement pour préserver le rythme.",
          "Le mode rattrapage de l’app facilite cette organisation.",
        ],
      },
      {
        heading: "Astuces de l’app",
        body: [
          "Commence avec un objectif réaliste. Les points et séries sont un encouragement, l’essentiel reste l’ikhlâs.",
        ],
      },
    ],
  },
  bn: {
    title: "দালাইল‑ই হায়রাত পাঠের আদব",
    description: "সচেতন ও নিয়মিত পাঠের জন্য প্রস্তাবিত আদব ও কৌশল।",
    sections: [
      {
        heading: "নিয়ত ও প্রস্তুতি",
        body: [
          "পাঠ শুরুর আগে নিয়ত নবায়ন করুন এবং আল্লাহর সন্তুষ্টির জন্য পড়ার কথা মনে করুন।",
          "সম্ভব হলে অজু করে, শান্ত পরিবেশে এবং মনোযোগ নষ্ট করে এমন জিনিস থেকে দূরে বসুন।",
        ],
      },
      {
        heading: "সময় ও স্থান বেছে নেওয়া",
        body: [
          "প্রতিদিন নির্দিষ্ট সময় পাঠ করলে অভ্যাস গড়ে ওঠে। ভোর, ইশার পরে বা দিনের শান্ত সময় বেছে নিতে পারেন।",
          "একই সময়ে পড়লে মন দ্রুত ছন্দে আসে।",
        ],
      },
      {
        heading: "পাঠের পদ্ধতি",
        body: [
          "ধীরে ধীরে ও অর্থের দিকে খেয়াল রেখে পড়া ভালো। প্রয়োজনে অনুবাদ/ট্রান্সলিটারেশন সহায়ক হতে পারে।",
          "ভুল হলে হতাশ হবেন না; নিয়মিত পড়লে দক্ষতা বাড়ে।",
        ],
      },
      {
        heading: "মিস হওয়া দিন ও ক্বাযা",
        body: [
          "কখনও দিন ছুটে যেতে পারে। দ্রুত ক্বাযা করলে রুটীন ঠিক থাকে।",
          "অ্যাপের makeup মোড দিয়ে পরিকল্পনা করে পূরণ করতে পারবেন।",
        ],
      },
      {
        heading: "অ্যাপ টিপস",
        body: [
          "সাপ্তাহিক লক্ষ্য বাস্তবসম্মত রাখুন। পয়েন্ট/স্ট্রীক প্রেরণার জন্য, আসল উদ্দেশ্য ইখলাস ও ধারাবাহিকতা।",
        ],
      },
    ],
  },
  pt: {
    title: "Etiqueta de leitura de Delail‑i Hayrat",
    description: "Adab e dicas para uma leitura consciente e constante.",
    sections: [
      {
        heading: "Intenção e preparação",
        body: [
          "Renove a intenção antes de começar, buscando a satisfação de Allah.",
          "Se possível, esteja em wudu e escolha um local calmo e sem distrações.",
        ],
      },
      {
        heading: "Escolha de tempo e lugar",
        body: [
          "Um horário fixo cria hábito: manhã cedo, após ‘isha ou em um momento tranquilo do dia.",
          "Ler no mesmo período ajuda a mente a entrar em ritmo.",
        ],
      },
      {
        heading: "Modo de leitura",
        body: [
          "Leia com calma e reflexão. Usar tradução ou transliteração pode aprofundar o significado.",
          "Não se preocupe excessivamente com erros; a constância aperfeiçoa.",
        ],
      },
      {
        heading: "Dias perdidos e reposição",
        body: [
          "Perder um dia acontece; o importante é repor sem demora.",
          "O modo de reposição na app facilita organizar os dias pendentes.",
        ],
      },
      {
        heading: "Dicas da app",
        body: [
          "Mantenha metas semanais realistas. Pontos e streaks servem apenas de incentivo.",
        ],
      },
    ],
  },
  ru: {
    title: "Адаб чтения Далаиль‑и Хайрат",
    description: "Практические советы для осознанного и регулярного чтения.",
    sections: [
      {
        heading: "Намерение и подготовка",
        body: [
          "Перед чтением обновите намерение ради довольства Аллаха и любви к Пророку ﷺ.",
          "Если возможно, совершите омовение и выберите спокойное место без отвлечений.",
        ],
      },
      {
        heading: "Выбор времени и места",
        body: [
          "Фиксированное время помогает выработать привычку: раннее утро, после ‘иша или другое тихое время.",
          "Чтение в одно и то же время облегчает сосредоточение.",
        ],
      },
      {
        heading: "Способ чтения",
        body: [
          "Читайте медленно и осмысленно. Перевод или транслитерация могут помочь понять смысл.",
          "Не пугайтесь ошибок — регулярность улучшает чтение.",
        ],
      },
      {
        heading: "Пропущенные дни и восполнение",
        body: [
          "Пропуски бывают у каждого. Важно восполнять их без задержки.",
          "Режим восполнения в приложении помогает сделать это планомерно.",
        ],
      },
      {
        heading: "Советы по приложению",
        body: [
          "Ставьте реалистичные недельные цели. Очки и серии — это мягкое поощрение, главное — искренность.",
        ],
      },
    ],
  },
  ur: {
    title: "دلائلِ خیرات پڑھنے کا ادب",
    description: "شعوری اور باقاعدہ تلاوت کے لیے عملی آداب و مشورے۔",
    sections: [
      {
        heading: "نیت اور تیاری",
        body: [
          "پڑھنے سے پہلے نیت تازہ کریں اور اللہ کی رضا کے لیے تلاوت کا ارادہ دل میں رکھیں۔",
          "ممکن ہو تو وضو کے ساتھ، پرسکون جگہ پر اور توجہ بٹانے والی چیزوں سے دور بیٹھیں۔",
        ],
      },
      {
        heading: "وقت اور جگہ کا انتخاب",
        body: [
          "روزانہ کا ایک مقرر وقت عادت بنانے میں مدد دیتا ہے۔ فجر کے بعد، عشاء کے بعد یا دن کے پرسکون حصے میں پڑھیں۔",
          "ایک ہی وقت پر پڑھنے سے دل و دماغ خود بخود آمادہ ہوتے ہیں۔",
        ],
      },
      {
        heading: "طریقۂ تلاوت",
        body: [
          "آہستگی سے اور معنی پر غور کرتے ہوئے پڑھیں۔ ترجمہ یا ٹرانسلٹریشن مددگار ہو سکتی ہے۔",
          "غلطی پر گھبراہٹ نہ کریں؛ باقاعدگی سے مہارت بڑھتی ہے۔",
        ],
      },
      {
        heading: "چھوٹے دن اور قضا",
        body: [
          "کبھی دن رہ جائے تو فوراً قضا کر لیں تاکہ تسلسل نہ ٹوٹے۔",
          "ایپ کا makeup موڈ اس نظم کو آسان بناتا ہے۔",
        ],
      },
      {
        heading: "ایپ کی تجاویز",
        body: [
          "ہفتہ وار ہدف حقیقت پسندانہ رکھیں۔ پوائنٹس اور اسٹریک صرف ترغیب کے لیے ہیں۔",
        ],
      },
    ],
  },
  id: {
    title: "Adab membaca Dalā’il al‑Khairāt",
    description: "Tips adab dan cara menjaga bacaan yang sadar dan konsisten.",
    sections: [
      {
        heading: "Niat dan persiapan",
        body: [
          "Perbarui niat sebelum membaca, hanya karena Allah dan cinta kepada Rasul ﷺ.",
          "Jika memungkinkan, berwudu dan pilih tempat yang tenang tanpa gangguan.",
        ],
      },
      {
        heading: "Memilih waktu dan tempat",
        body: [
          "Waktu yang tetap memudahkan terbentuknya kebiasaan: pagi, setelah ‘isha, atau saat paling hening.",
          "Membaca pada jam yang sama membantu fokus lebih cepat.",
        ],
      },
      {
        heading: "Metode membaca",
        body: [
          "Baca dengan perlahan sambil merenungkan makna. Terjemahan atau transliterasi dapat membantu.",
          "Jangan khawatir berlebihan tentang kesalahan; istiqamah memperbaiki bacaan.",
        ],
      },
      {
        heading: "Hari terlewat dan qadha",
        body: [
          "Jika ada hari terlewat, segera qadha agar ritme terjaga.",
          "Mode makeup di aplikasi membantu mengaturnya.",
        ],
      },
      {
        heading: "Tips aplikasi",
        body: [
          "Tetapkan target mingguan yang realistis. Poin dan streak hanya sarana dorongan.",
        ],
      },
    ],
  },
  de: {
    title: "Adab der Rezitation von Delail‑i Hayrat",
    description: "Praktische Empfehlungen für achtsames und beständiges Lesen.",
    sections: [
      {
        heading: "Absicht und Vorbereitung",
        body: [
          "Erneuere vor dem Lesen die Absicht um Allahs Wohlgefallen willen.",
          "Wenn möglich mit Wudu, in ruhiger Umgebung und ohne Ablenkung rezitieren.",
        ],
      },
      {
        heading: "Zeit und Ort wählen",
        body: [
          "Ein fester Tageszeitpunkt erleichtert Gewohnheit: früh morgens, nach ‘isha oder in einem stillen Moment.",
          "Regelmäßigkeit zur selben Zeit fördert Konzentration.",
        ],
      },
      {
        heading: "Lesemethode",
        body: [
          "Langsam und nachdenklich lesen. Übersetzung oder Transkription kann helfen.",
          "Fehler sind normal; durch Beständigkeit verbessert sich die Rezitation.",
        ],
      },
      {
        heading: "Versäumte Tage und Nachholen",
        body: [
          "Ein Tag kann ausfallen. Wichtig ist, ihn zeitnah nachzuholen.",
          "Der Makeup‑Modus der App unterstützt dabei.",
        ],
      },
      {
        heading: "App‑Tipps",
        body: [
          "Setze realistische Wochenziele. Punkte und Streaks dienen nur der Motivation.",
        ],
      },
    ],
  },
  ja: {
    title: "ダラーイル・ハイラート読誦の作法",
    description: "意識的で継続的な読誦のための実践的な作法とヒント。",
    sections: [
      {
        heading: "意図と準備",
        body: [
          "始める前に意図を新たにし、アッラーのために読誦することを心に留めます。",
          "可能ならウドゥーを行い、静かな場所で集中できる環境を整えます。",
        ],
      },
      {
        heading: "時間と場所の選択",
        body: [
          "毎日の固定時間は習慣化に役立ちます。早朝、イシャー後、または落ち着いた時間帯がおすすめです。",
          "同じ時間に読むことで心がリズムに慣れます。",
        ],
      },
      {
        heading: "読誦の方法",
        body: [
          "ゆっくりと意味を考えながら読むことが勧められます。翻訳や音写も助けになります。",
          "誤りを恐れず続けることで上達します。",
        ],
      },
      {
        heading: "欠けた日と補読",
        body: [
          "欠けた日があれば早めに補い、リズムを保ちます。",
          "アプリの補読モードで計画的に行えます。",
        ],
      },
      {
        heading: "アプリのコツ",
        body: [
          "現実的な週間目標を設定してください。ポイントやストリークは励ましのためのものです。",
        ],
      },
    ],
  },
  sw: {
    title: "Adabu za kusoma Delail‑i Hayrat",
    description: "Vidokezo vya adabu na njia za kudumisha usomaji wa uangalifu.",
    sections: [
      {
        heading: "Nia na maandalizi",
        body: [
          "Anza kwa kusahihisha nia kwa ajili ya Allah.",
          "Ikiwezekana soma ukiwa na wudu, mahali tulivu pasipo usumbufu.",
        ],
      },
      {
        heading: "Kuchagua muda na mahali",
        body: [
          "Muda wa kila siku uliowekwa hujenga desturi. Asubuhi mapema au baada ya ‘isha ni chaguo nzuri.",
          "Kurudia kwa muda ule ule husaidia moyo kuzoea.",
        ],
      },
      {
        heading: "Njia ya usomaji",
        body: [
          "Soma taratibu kwa tafakuri. Tafsiri au transliteration inaweza kusaidia.",
          "Usivunjike moyo kwa makosa; uthabiti huleta uboreshaji.",
        ],
      },
      {
        heading: "Siku zilizokosekana na kulipa",
        body: [
          "Ukikosa siku, ilipe mapema ili rhythm isikatike.",
          "Makeup mode ya app inarahisisha mpangilio.",
        ],
      },
      {
        heading: "Vidokezo vya app",
        body: [
          "Weka malengo ya wiki yanayowezekana. Pointi na streak ni kwa hamasa tu.",
        ],
      },
    ],
  },
  mr: {
    title: "दलाईल‑ए‑हयرات वाचनाचा अदब",
    description: "जाणिवपूर्वक आणि सातत्यपूर्ण वाचनासाठी उपयुक्त आदब व सूचना.",
    sections: [
      {
        heading: "नीयत व तयारी",
        body: [
          "वाचनापूर्वी नीयत ताजी करा आणि अल्लाहसाठी वाचण्याचा इरादा ठेवा.",
          "शक्य असल्यास वुज़ू करून, शांत जागी वाचन करा.",
        ],
      },
      {
        heading: "वेळ व जागा निवडणे",
        body: [
          "दररोज ठराविक वेळ ठेवल्यास सवय लागते. सकाळी लवकर किंवा ‘इशा नंतर वाचू शकता.",
          "एकाच वेळेत वाचन केल्याने लक्ष केंद्रित होते.",
        ],
      },
      {
        heading: "वाचनाची पद्धत",
        body: [
          "हळूहळू आणि अर्थावर लक्ष देऊन वाचा. भाषांतर/ट्रान्सलिटरेशन उपयुक्त ठरू शकते.",
          "चूक झाली तरी घाबरू नका; सातत्याने सुधारणा होते.",
        ],
      },
      {
        heading: "चुकलेले दिवस व क़ज़ा",
        body: [
          "कधी दिवस राहिला तर लवकर क़ज़ा करून रुटीन टिकवा.",
          "अॅपचा makeup मोड हे नियोजन सोपे करतो.",
        ],
      },
      {
        heading: "अॅप टिप्स",
        body: [
          "वास्तविक आठवडी लक्ष्य ठेवा. पॉइंट्स/स्ट्रीक फक्त प्रोत्साहनासाठी आहेत.",
        ],
      },
    ],
  },
  te: {
    title: "దలాయిల్‑ఇ హయరాత్ చదవడం యొక్క ఆదాబ్",
    description: "జాగ్రత్తగా మరియు నిరంతరంగా పఠించేందుకు ఉపయోగపడే సూచనలు.",
    sections: [
      {
        heading: "నీయత మరియు సిద్ధత",
        body: [
          "పఠనం ప్రారంభించే ముందు నీయతను పునరుద్ధరించండి; ఇది అల్లాహ్‌కి రిజా కోసం.",
          "వీలైతే వుజూ చేసి, శాంతమైన చోట చదవండి.",
        ],
      },
      {
        heading: "సమయం మరియు స్థలం ఎంపిక",
        body: [
          "ప్రతి రోజు స్థిర సమయం అలవాటు చేస్తుంది. ఉదయం లేదా ‘ఇషా తర్వాత చదవడం మంచిది.",
          "అదే సమయానికి చదవడం దృష్టిని పెంచుతుంది.",
        ],
      },
      {
        heading: "పఠన విధానం",
        body: [
          "నెమ్మదిగా అర్థాన్ని తలచుకుంటూ చదవండి. అనువాదం/ట్రాన్స్లిటరేషన్ సహాయపడుతుంది.",
          "తప్పులపై భయపడకండి; నిరంతరతతో మెరుగవుతుంది.",
        ],
      },
      {
        heading: "మిస్సైన రోజులు మరియు క఼దా",
        body: [
          "రోజు మిస్ అయితే త్వరగా క఼దా చేసి రిథమ్‌ను కాపాడండి.",
          "యాప్‌లో makeup మోడ్ ఇందుకు సహాయపడుతుంది.",
        ],
      },
      {
        heading: "యాప్ సూచనలు",
        body: [
          "వాస్తవిక వారపు లక్ష్యాలు పెట్టుకోండి. పాయింట్లు/స్ట్రీక్ ప్రోత్సాహం మాత్రమే.",
        ],
      },
    ],
  },
  ta: {
    title: "தலாயில்‑இ ஹயராத் வாசிப்பு ஆதாப்",
    description: "அறிவுடன் மற்றும் தொடர்ச்சியாக வாசிக்க உதவும் நடைமுறை ஆலோசனைகள்.",
    sections: [
      {
        heading: "நியத்தும் தயாரிப்பும்",
        body: [
          "வாசிப்பை தொடங்கும் முன் நியத்தை புதுப்பிக்கவும்; அல்லாஹ்வின் رضا பெறவே வாசிக்கிறோம் என்பதைக் நினைவில் கொள்ளுங்கள்.",
          "இயன்றால் வுது செய்து, அமைதியான சூழலில் கவனமாக வாசிக்கவும்.",
        ],
      },
      {
        heading: "நேரம் மற்றும் இடம் தேர்வு",
        body: [
          "நேரத்தை நிரந்தரமாக வைத்தால் பழக்கம் உருவாகும். காலை அல்லது இஷா பிறகு நல்ல நேரம்.",
          "ஒரே நேரத்தில் தொடர்ச்சியாக வாசிப்பது கவனத்தை வலுப்படுத்தும்.",
        ],
      },
      {
        heading: "வாசிப்பு முறை",
        body: [
          "மெதுவாக அர்த்தத்தை சிந்தித்து வாசிப்பது சிறந்தது. மொழிபெயர்ப்பு/உச்சரிப்பு உதவலாம்.",
          "தவறுகளைப் பற்றி அதிகமாக கவலைப்பட வேண்டாம்; தொடர்ச்சி மேம்படுத்தும்.",
        ],
      },
      {
        heading: "மிஸ்ஸான நாட்கள் மற்றும் கஸா",
        body: [
          "நாள் தவறினால் விரைவில் கஸா செய்து ரித்மத்தை பாதுகாத்துக் கொள்ளுங்கள்.",
          "அப்பின் makeup முறை இதை ஒழுங்குபடுத்த உதவும்.",
        ],
      },
      {
        heading: "அப் குறிப்புகள்",
        body: [
          "நிஜமான வார இலக்குகளைத் தேர்வு செய்யுங்கள். பாயிண்ட்/ஸ்ட்ரீக் ஊக்கத்திற்கானவை மட்டுமே.",
        ],
      },
    ],
  },
  vi: {
    title: "Adab khi đọc Delail‑i Hayrat",
    description: "Những lời khuyên thực tế để đọc với ý thức và đều đặn.",
    sections: [
      {
        heading: "Ý định và chuẩn bị",
        body: [
          "Trước khi đọc hãy làm mới ý định vì Allah và tình yêu với Tiên tri ﷺ.",
          "Nếu có thể, wudu và chọn nơi yên tĩnh ít bị xao nhãng.",
        ],
      },
      {
        heading: "Chọn thời gian và không gian",
        body: [
          "Giữ một khung giờ cố định giúp hình thành thói quen: sáng sớm, sau ‘isha hoặc lúc tĩnh lặng trong ngày.",
          "Đọc cùng thời điểm mỗi ngày giúp tập trung tốt hơn.",
        ],
      },
      {
        heading: "Cách đọc",
        body: [
          "Đọc chậm rãi và suy ngẫm. Có thể theo dõi nghĩa qua bản dịch hoặc phiên âm.",
          "Đừng quá lo về lỗi; sự đều đặn sẽ cải thiện dần.",
        ],
      },
      {
        heading: "Ngày bị lỡ và đọc bù",
        body: [
          "Lỡ một ngày là điều có thể xảy ra; hãy bù sớm để giữ nhịp.",
          "Chế độ makeup trong app hỗ trợ quản lý việc bù đọc.",
        ],
      },
      {
        heading: "Mẹo dùng app",
        body: [
          "Đặt mục tiêu tuần thực tế. Điểm và streak chỉ để khích lệ, quan trọng nhất là sự chân thành.",
        ],
      },
    ],
  },
  ko: {
    title: "달라일‑이 하이라트 독송의 예절",
    description: "의식적이고 꾸준한 독송을 위한 عملي한 아답과 팁.",
    sections: [
      {
        heading: "의도와 준비",
        body: [
          "독송을 시작하기 전 알라의 رضا를 구하는 진실한 의도를 새로 합니다.",
          "가능하면 우두를 하고, 조용한 환경에서 방해 요소를 줄입니다.",
        ],
      },
      {
        heading: "시간과 장소 선택",
        body: [
          "매일의 고정 시간은 습관을 만듭니다. 이른 아침이나 이샤 후 등 조용한 시간을 선택하세요.",
          "같은 시간에 읽으면 마음이 자연스럽게 리듬에 들어갑니다.",
        ],
      },
      {
        heading: "독송 방법",
        body: [
          "천천히 의미를 생각하며 읽는 것이 좋습니다. 필요하면 번역이나 음역을 함께 보세요.",
          "실수를 두려워하지 말고 꾸준히 읽으면 자연히 향상됩니다.",
        ],
      },
      {
        heading: "놓친 날과 보충",
        body: [
          "하루를 놓치는 것은 있을 수 있습니다. 가능한 빨리 보충 독송을 하여 리듬을 유지하세요.",
          "앱의 보충 모드가 이를 계획적으로 도와줍니다.",
        ],
      },
      {
        heading: "앱 팁",
        body: [
          "현실적인 주간 목표를 세우세요. 포인트와 스트릭은 격려 도구일 뿐이며 핵심은 성실함입니다.",
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
    path: "/app/info/etiquette",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function EtiquettePage({ params }: { params: { locale: Locale } }) {
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
