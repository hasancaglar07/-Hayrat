import type { Metadata } from "next";
import { LongFormArticle, type LongFormSection } from "@/components/content/LongFormArticle";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

const content: Partial<Record<Locale, { title: string; description: string; sections: LongFormSection[] }>> = {
  tr: {
    title: "Delail-i Hayrat Nedir?",
    description:
      "Delail-i Hayrat’ın mahiyeti, müellifi ve okuma geleneği hakkında kapsamlı bilgi.",
    sections: [
      {
        heading: "Delail-i Hayrat’ın Tanımı",
        body: [
          "Delail-i Hayrat, Peygamber Efendimiz’e (s.a.v.) salavat ve duaları ihtiva eden, İslam dünyasında asırlardır okunan müstesna bir eserdir. Müellifi İmam el‑Cezûlî (rah.) tarafından derlenmiş ve salavat kültürünün önemli bir temsilcisi hâline gelmiştir.",
          "Eser, Allah Teâlâ’ya yakınlık arayışında olan müminlerin Resûlullah’a salavat getirerek muhabbetini tazelemesine, kalbini diriltmesine ve dua bilincini artırmasına vesile olarak görülür.",
        ],
      },
      {
        heading: "Müellif: İmam el‑Cezûlî",
        body: [
          "15. yüzyılda Fas’ta yaşamış olan İmam el‑Cezûlî, salavatların faziletine dair rivayetleri bir araya getirerek bu eseri telif etmiştir. Delail-i Hayrat kısa sürede Kuzey Afrika’dan Anadolu’ya, Hint alt kıtasından Osmanlı medreselerine kadar geniş bir coğrafyada yayılmıştır.",
        ],
      },
      {
        heading: "Yapısı ve Okuma Düzeni",
        body: [
          "Delail-i Hayrat genellikle haftalık bir okuma düzeniyle takip edilir. Metin, günlere bölünmüş hizb/evrad yapısıyla, okuyucunun her gün belirli bir kısmı okumasını kolaylaştırır.",
          "Birçok okuyucu haftada 5–7 gün okuma hedefi belirler; kimi zaman kaçan günleri “kaza” okuyarak düzenini tamamlar.",
        ],
      },
      {
        heading: "Neden Düzenli Okunur?",
        body: [
          "Salavatla meşgul olmak, müminin kalbini canlı tutan bir ibadettir. Delail-i Hayrat okuması; niyeti tazeler, günlük hayatta zikri artırır ve manevi istikrarı destekler.",
          "Geleneksel kaynaklarda salavatın bereket, huzur ve dua kabulüne vesile oluşundan bahsedilir. Bu faydaların devamlılığı ise düzenli okumayla güçlenir.",
        ],
      },
      {
        heading: "Uygulama ile Takip",
        body: [
          "Delail-i Hayrat Takip uygulaması, haftalık hedef belirlemenizi, her gün okumanızı işaretlemenizi ve kaçırdığınız günleri kaza olarak telafi etmenizi kolaylaştırır.",
          "Puan ve streak sistemi, okuma istikrarınızı görünür kılar ve motivasyon sağlar.",
        ],
      },
    ],
  },
  en: {
    title: "What Is Delail-i Hayrat?",
    description: "A detailed overview of Delail-i Hayrat, its author, and reading tradition.",
    sections: [
      {
        heading: "Definition",
        body: [
          "Delail-i Hayrat is a celebrated collection of salawat and supplications for Prophet Muhammad (peace be upon him), recited across the Muslim world for centuries. Compiled by Imam al‑Jazuli, it stands as a cornerstone of salawat tradition.",
          "Readers engage with it to renew love for the Prophet, revive the heart, and deepen awareness of prayer.",
        ],
      },
      {
        heading: "Author: Imam al‑Jazuli",
        body: [
          "Imam al‑Jazuli (d. 15th century, Morocco) gathered renowned salawat narrations into this work. It spread widely from North Africa to Anatolia and beyond.",
        ],
      },
      {
        heading: "Structure and Weekly Reading",
        body: [
          "The book is commonly read on a weekly cycle, divided into daily portions (hizb/awrad) to support consistency.",
          "Many readers set a 5–7 day weekly goal and make up missed days when needed.",
        ],
      },
      {
        heading: "Why Read Regularly?",
        body: [
          "Salawat is an act of remembrance that strengthens spiritual focus. Regular Delail-i Hayrat reading helps sustain that rhythm.",
          "Traditional sources mention blessings and serenity associated with salawat, while consistency supports continuity.",
        ],
      },
      {
        heading: "Tracking with the App",
        body: [
          "Delail-i Hayrat Tracker lets you set weekly targets, mark daily progress, and record makeup readings.",
          "Points and streaks make consistency visible and motivating.",
        ],
      },
    ],
  },
  ar: {
    title: "ما هو دلائل الخيرات؟",
    description: "عرض مفصل عن دلائل الخيرات ومؤلفه وطريقة قراءته.",
    sections: [
      {
        heading: "التعريف",
        body: [
          "دلائل الخيرات كتاب مشهور يضم صلوات ودعوات على النبي ﷺ، يتوارث المسلمون قراءته منذ قرون. جمعه الإمام الجزولي وهو من أهم كتب الصلوات.",
          "يُقرأ للتقرب إلى الله بتجديد المحبة للنبي ﷺ وإحياء القلب وزيادة الوعي بالدعاء.",
        ],
      },
      {
        heading: "المؤلف: الإمام الجزولي",
        body: [
          "الإمام الجزولي رحمه الله من علماء المغرب في القرن الخامس عشر، جمع الصلوات المأثورة ورتبها في هذا الكتاب، فانتشر في أنحاء العالم الإسلامي.",
        ],
      },
      {
        heading: "البنية والقراءة الأسبوعية",
        body: [
          "يُقرأ غالباً بنظام أسبوعي مقسم إلى أجزاء يومية (حزب/أوراد) لسهولة الاستمرار.",
          "يحدد كثير من القراء هدفاً أسبوعياً ويقضون ما يفوتهم.",
        ],
      },
      {
        heading: "لماذا المداومة؟",
        body: [
          "الصلاة على النبي ﷺ ذكر يقوي الإيمان ويزيد الخشوع. المداومة على دلائل الخيرات تحفظ هذا الإيقاع.",
          "تذكر المصادر فضائل وبركات الصلوات، والاستمرار يعين على دوامها.",
        ],
      },
      {
        heading: "المتابعة عبر التطبيق",
        body: [
          "يساعدك التطبيق على تحديد هدفك الأسبوعي وتسجيل قراءتك اليومية وقضاء الأيام الفائتة.",
          "نظام النقاط والسلسلة يظهر الاستمرار ويزيد التحفيز.",
        ],
      },
    ],
  },
  zh: {
    title: "什么是《达莱勒·海拉特》？",
    description: "关于《达莱勒·海拉特》的内容、作者与诵读传统的详细介绍。",
    sections: [
      {
        heading: "定义",
        body: [
          "《达莱勒·海拉特》（Delail‑i Hayrat）是汇集了对先知穆罕默德（愿主赐他平安）的赞颂（萨拉瓦特）与祈祷文的经典著作，在伊斯兰世界已被诵读数百年。",
          "读者通过诵读它来更新对先知的爱慕、滋养内心的记念，并在日常生活中培养祈祷的意识与宁静。",
        ],
      },
      {
        heading: "作者：贾祖利伊玛目",
        body: [
          "本书由15世纪摩洛哥学者与苏菲派导师伊玛目穆罕默德·本·苏莱曼·贾祖利（Imam al‑Jazuli）编纂。",
          "他汇集了可靠来源中广为流传的萨拉瓦特文本，并以便于持续诵读的方式加以整理，使其传播到北非、安纳托利亚及更广泛的地区。",
        ],
      },
      {
        heading: "结构与每周诵读",
        body: [
          "《达莱勒·海拉特》通常按一周为周期诵读，内容被分成每日的段落（hizb/awrad），方便读者建立稳定的习惯。",
          "许多读者设定每周5–7天的目标；若有遗漏，可在之后以“补读/补偿”（makeup）形式完成。",
        ],
      },
      {
        heading: "为何坚持诵读？",
        body: [
          "在伊斯兰传统中，赞颂先知是唤醒心灵、增加祈祷福分的重要功修。持续的诵读有助于培养专注与虔敬。",
          "传统文献提到萨拉瓦特带来宁静与祝福；规律的习惯使这种精神收益更具持续性。",
        ],
      },
      {
        heading: "借助应用进行追踪",
        body: [
          "Delail‑i Hayrat 跟读应用帮助你设定每周目标、记录每日完成情况，并在需要时标记补读日。",
          "积分与连续天数（streak）让你的坚持更加可见，从而温和地促进稳定与恒常（istiqamah）。",
        ],
      },
    ],
  },
  hi: {
    title: "देलाइल‑ए‑हयرات क्या है?",
    description: "देलाइल‑ए‑हयرات की प्रकृति, संकलक और पढ़ने की परंपरा का विस्तृत परिचय।",
    sections: [
      {
        heading: "परिचय",
        body: [
          "देलाइल‑ए‑हयرات (Delail‑i Hayrat) नबी मुहम्मद ﷺ पर दरूद‑ओ‑सलाम और दुआओं का प्रसिद्ध संकलन है, जिसे सदियों से मुस्लिम दुनिया में पढ़ा जाता है।",
          "इसका नियमित पाठ हृदय में नबी ﷺ की मुहब्बत को ताज़ा करता है, ज़िक्र की चेतना बढ़ाता है और दुआ के साथ संबंध को गहरा करता है।",
        ],
      },
      {
        heading: "संकलक: इमाम अल‑जज़ूली",
        body: [
          "यह कृति 15वीं शताब्दी के मोरक्को के महान आलिम और सूफ़ी इमाम मुहम्मद इब्न सुलेमान अल‑जज़ूली द्वारा संकलित की गई।",
          "उन्होंने विश्वसनीय स्रोतों से दरूदों को एकत्र कर दैनिक/साप्ताहिक हिस्सों में व्यवस्थित किया, जिससे इसे लगातार पढ़ना आसान हुआ और यह दूर‑दूर तक फैली।",
        ],
      },
      {
        heading: "संरचना और साप्ताहिक पाठ",
        body: [
          "देलाइल‑ए‑हयرات को आमतौर पर साप्ताहिक चक्र में पढ़ा जाता है। पुस्तक को हर दिन के लिए हिस्सों (हिज़्ब/अवराद) में बाँटा गया है।",
          "कई पाठक सप्ताह में 5–7 दिन पढ़ने का लक्ष्य रखते हैं; छूटे हुए दिनों की ‘क़ज़ा’ बाद में की जा सकती है।",
        ],
      },
      {
        heading: "नियमित पाठ क्यों?",
        body: [
          "क़ुरआन और सुन्नत में सलावत की फ़ज़ीलत बताई गई है। नियमित दरूद पाठ मन को एकाग्र करता है और आध्यात्मिक स्थिरता (इस्तिक़ामत) बनाता है।",
          "परंपरा के अनुसार सलावत में बरकत और सुकून है; निरंतरता इन लाभों को जीवन में स्थायी बनाती है।",
        ],
      },
      {
        heading: "ऐप के साथ ट्रैकिंग",
        body: [
          "Delail‑i Hayrat Tracker ऐप आपको साप्ताहिक लक्ष्य तय करने, रोज़ की पढ़ाई दर्ज करने और छूटे दिनों की क़ज़ा व्यवस्थित तरीके से करने में मदद करता है।",
          "पॉइंट और स्ट्रीक आपको प्रोत्साहित करते हैं ताकि आपका पाठ नियमित और शांतिपूर्ण बना रहे।",
        ],
      },
    ],
  },
  es: {
    title: "¿Qué es Delail‑i Hayrat?",
    description: "Guía detallada sobre Delail‑i Hayrat, su autor y la tradición de lectura.",
    sections: [
      {
        heading: "Definición",
        body: [
          "Delail‑i Hayrat es una célebre colección de salawat (bendiciones) y súplicas dirigidas al Profeta Muhammad (la paz sea con él), recitada durante siglos en el mundo islámico.",
          "Su lectura ayuda a renovar el amor por el Mensajero, avivar el recuerdo espiritual y fortalecer la conciencia de la oración en la vida diaria.",
        ],
      },
      {
        heading: "Autor: Imam al‑Jazuli",
        body: [
          "La obra fue compilada por el erudito marroquí del siglo XV Imam Muhammad ibn Sulayman al‑Jazuli.",
          "Reunió salawat conocidas de fuentes fiables y las organizó en porciones diarias y semanales para facilitar una recitación constante.",
        ],
      },
      {
        heading: "Estructura y lectura semanal",
        body: [
          "Tradicionalmente se lee en un ciclo semanal. El texto está dividido en partes diarias (hizb/awrad), lo que permite crear un hábito estable.",
          "Muchos lectores fijan metas de 5 a 7 días por semana y recuperan los días perdidos mediante lecturas de reposición.",
        ],
      },
      {
        heading: "¿Por qué leer con constancia?",
        body: [
          "En la tradición islámica, el envío de salawat fortalece el corazón y añade bendición a la súplica. La regularidad cultiva disciplina espiritual e istiqamah.",
          "Las virtudes asociadas a la salawat se viven mejor cuando la práctica es continua y consciente.",
        ],
      },
      {
        heading: "Seguimiento con la aplicación",
        body: [
          "La app Delail‑i Hayrat Tracker te permite fijar objetivos semanales, marcar tu lectura diaria y registrar lecturas de reposición cuando sea necesario.",
          "Los puntos y rachas hacen visible tu progreso y te animan a mantener el ritmo con serenidad.",
        ],
      },
    ],
  },
  fr: {
    title: "Qu’est‑ce que Delail‑i Hayrat ?",
    description: "Présentation détaillée de Delail‑i Hayrat, de son auteur et de la tradition de lecture.",
    sections: [
      {
        heading: "Définition",
        body: [
          "Delail‑i Hayrat est un recueil célèbre de salawat et d’invocations adressées au Prophète Muhammad (paix et bénédictions sur lui), lu depuis des siècles dans le monde musulman.",
          "Sa récitation renouvelle l’amour pour le Prophète, vivifie le cœur et renforce le lien à la prière et au dhikr.",
        ],
      },
      {
        heading: "Auteur : l’imam al‑Jazuli",
        body: [
          "L’ouvrage a été compilé au XVe siècle au Maroc par l’imam Muhammad ibn Sulayman al‑Jazuli.",
          "Il a rassemblé des salawat issues de sources authentiques et les a organisées en portions quotidiennes pour faciliter une lecture régulière.",
        ],
      },
      {
        heading: "Structure et lecture hebdomadaire",
        body: [
          "Delail‑i Hayrat se lit généralement sur un cycle hebdomadaire. Le texte est réparti en parties journalières (hizb/awrad).",
          "Les lecteurs se fixent souvent un objectif de 5 à 7 jours par semaine et rattrapent les jours manqués par une lecture de rattrapage.",
        ],
      },
      {
        heading: "Pourquoi la constance ?",
        body: [
          "La salawat est une pratique centrale qui apporte bénédiction à la supplication et apaise le cœur. La constance nourrit l’istiqamah.",
          "Une lecture régulière aide à préserver la présence spirituelle au quotidien.",
        ],
      },
      {
        heading: "Suivi via l’application",
        body: [
          "Delail‑i Hayrat Tracker permet de définir un objectif hebdomadaire, d’enregistrer la lecture quotidienne et de planifier les jours de rattrapage.",
          "Le système de points et de séries encourage doucement la régularité.",
        ],
      },
    ],
  },
  bn: {
    title: "দালাইল‑ই হায়রাত কী?",
    description: "দালাইল‑ই হায়রাত, এর সংকলক এবং পাঠের ঐতিহ্য সম্পর্কে বিস্তারিত পরিচিতি।",
    sections: [
      {
        heading: "সংজ্ঞা",
        body: [
          "দালাইল‑ই হায়রাত (Delail‑i Hayrat) নবী মুহাম্মদ ﷺ‑এর উপর দরুদ ও দোয়ার প্রসিদ্ধ সংকলন, যা শতাব্দীর পর শতাব্দী মুসলিম উম্মাহ পাঠ করে আসছে।",
          "এই পাঠ নবী ﷺ‑এর প্রতি ভালোবাসা নবায়ন করে, হৃদয় জাগ্রত রাখে এবং দৈনন্দিন জীবনে যিকির‑দোয়ার বন্ধন দৃঢ় করে।",
        ],
      },
      {
        heading: "সংকলক: ইমাম আল‑জাজুলী",
        body: [
          "১৫শ শতকের মরক্কোর আলিম ও সুফি ইমাম মুহাম্মদ ইবন সুলাইমান আল‑জাজুলী এটি সংকলন করেন।",
          "তিনি নির্ভরযোগ্য উৎস থেকে দরুদসমূহ একত্র করে দৈনিক/সাপ্তাহিক অংশে সাজিয়েছেন, ফলে নিয়মিত পাঠ সহজ হয়েছে।",
        ],
      },
      {
        heading: "গঠন ও সাপ্তাহিক পাঠ",
        body: [
          "দালাইল‑ই হায়রাত সাধারণত সাপ্তাহিক চক্রে পড়া হয়। গ্রন্থটি প্রতিদিনের জন্য অংশে (হিজব/আওরাদ) বিভক্ত।",
          "অনেকে সপ্তাহে ৫–৭ দিন পাঠের লক্ষ্য স্থির করেন এবং মিস হলে পরে ক্বাযা/রিপ্লেসমেন্ট পাঠ করেন।",
        ],
      },
      {
        heading: "কেন নিয়মিত পাঠ?",
        body: [
          "সালাওয়াত হৃদয়ে প্রশান্তি আনে এবং দোয়ায় বরকত বৃদ্ধি করে বলে ইসলামি ঐতিহ্যে উল্লেখ আছে। নিয়মিত পাঠ ইস্তিকামত গড়ে তোলে।",
          "ধারাবাহিকভাবে পড়লে এই আত্মিক উপকার স্থায়ী হয়।",
        ],
      },
      {
        heading: "অ্যাপ দিয়ে ট্র্যাকিং",
        body: [
          "Delail‑i Hayrat Tracker অ্যাপ সাপ্তাহিক লক্ষ্য নির্ধারণ, দৈনিক পাঠ রেকর্ড ও মিস হওয়া দিনের ক্বাযা পরিকল্পনায় সাহায্য করে।",
          "পয়েন্ট ও স্ট্রীক আপনার অগ্রগতি দেখিয়ে নিয়মিততায় উৎসাহ দেয়।",
        ],
      },
    ],
  },
  pt: {
    title: "O que é Delail‑i Hayrat?",
    description: "Visão detalhada do Delail‑i Hayrat, seu autor e a tradição de leitura.",
    sections: [
      {
        heading: "Definição",
        body: [
          "Delail‑i Hayrat é uma coleção renomada de salawat e súplicas ao Profeta Muhammad (que a paz esteja com ele), recitada há séculos no mundo islâmico.",
          "A leitura regular renova o amor pelo Mensageiro, fortalece o dhikr e aprofunda a consciência espiritual no dia a dia.",
        ],
      },
      {
        heading: "Autor: Imam al‑Jazuli",
        body: [
          "A obra foi compilada no século XV pelo erudito marroquino Imam al‑Jazuli.",
          "Ele reuniu salawat de fontes confiáveis e as organizou em porções diárias para facilitar a constância.",
        ],
      },
      {
        heading: "Estrutura e leitura semanal",
        body: [
          "Tradicionalmente, Delail‑i Hayrat é lido em um ciclo semanal, dividido em partes diárias (hizb/awrad).",
          "Muitos leitores estabelecem metas de 5 a 7 dias por semana e compensam dias perdidos quando necessário.",
        ],
      },
      {
        heading: "Por que ler com regularidade?",
        body: [
          "As salawat são lembranças que iluminam o coração e trazem bênçãos à súplica. A regularidade desenvolve istiqamah.",
          "A prática contínua permite vivenciar melhor esses benefícios espirituais.",
        ],
      },
      {
        heading: "Acompanhamento com o aplicativo",
        body: [
          "O Delail‑i Hayrat Tracker ajuda você a definir objetivos semanais, marcar a leitura diária e registrar leituras de reposição.",
          "Pontos e sequências tornam seu progresso visível e motivador.",
        ],
      },
    ],
  },
  ru: {
    title: "Что такое «Далаиль‑и Хайрат»?",
    description: "Подробное объяснение книги, её автора и традиции чтения.",
    sections: [
      {
        heading: "Определение",
        body: [
          "«Далаиль‑и Хайрат» (Delail‑i Hayrat) — знаменитый сборник салаватов и мольб за Пророка Мухаммада ﷺ, читаемый мусульманами на протяжении веков.",
          "Чтение помогает обновлять любовь к Пророку, оживляет сердце поминанием и укрепляет связь с дуа.",
        ],
      },
      {
        heading: "Автор: имам аль‑Джазули",
        body: [
          "Книгу составил марокканский учёный XV века имам Мухаммад ибн Сулайман аль‑Джазули.",
          "Он собрал известные салаваты из надёжных источников и упорядочил их в удобные ежедневные части.",
        ],
      },
      {
        heading: "Структура и недельный цикл",
        body: [
          "Обычно книгу читают по недельному циклу: текст разделён на ежедневные порции (хизб/аврад).",
          "Многие ставят цель 5–7 дней в неделю и восполняют пропущенные дни позже.",
        ],
      },
      {
        heading: "Зачем читать регулярно?",
        body: [
          "Салават считается источником благодати и спокойствия для сердца. Регулярность развивает духовную устойчивость (истикама).",
          "Постоянная практика помогает сохранить эту пользу в повседневной жизни.",
        ],
      },
      {
        heading: "Отслеживание через приложение",
        body: [
          "Приложение Delail‑i Hayrat Tracker позволяет задавать недельные цели, отмечать ежедневное чтение и планировать восполнение.",
          "Система очков и «серий» мягко мотивирует сохранять ритм.",
        ],
      },
    ],
  },
  ur: {
    title: "دلائلِ خیرات کیا ہے؟",
    description: "دلائلِ خیرات، اس کے مؤلف اور پڑھنے کی روایت کا تفصیلی تعارف۔",
    sections: [
      {
        heading: "تعریف",
        body: [
          "دلائلِ خیرات (Delail‑i Hayrat) حضور نبی کریم ﷺ پر درود و سلام اور دعاؤں کا معروف مجموعہ ہے، جو صدیوں سے عالمِ اسلام میں پڑھا جاتا ہے۔",
          "اس کی تلاوت محبتِ رسول ﷺ کو تازہ کرتی ہے، دل میں ذکر کی بیداری پیدا کرتی ہے اور دعا سے تعلق مضبوط کرتی ہے۔",
        ],
      },
      {
        heading: "مؤلف: امام جزولیؒ",
        body: [
          "یہ کتاب پندرہویں صدی کے مراکشی عالم و صوفی امام محمد بن سلیمان الجزولیؒ نے مرتب کی۔",
          "انہوں نے معتبر روایات سے درود جمع کرکے روزانہ/ہفتہ وار حصوں میں ترتیب دیا تاکہ مسلسل پڑھنا آسان ہو۔",
        ],
      },
      {
        heading: "بناوٹ اور ہفتہ وار تلاوت",
        body: [
          "دلائلِ خیرات عموماً ہفتہ وار نظام کے تحت پڑھی جاتی ہے اور اسے روزانہ کے حصوں (حزب/اوراد) میں تقسیم کیا گیا ہے۔",
          "بہت سے قارئین ہفتے میں ۵ تا ۷ دن پڑھنے کا ہدف رکھتے ہیں اور رہ جانے والے دن بعد میں قضا کر لیتے ہیں۔",
        ],
      },
      {
        heading: "مسلسل پڑھنے کی وجہ",
        body: [
          "اسلامی روایت میں درود شریف دل کی روشنی اور دعا کی برکت کا سبب بتایا گیا ہے۔ باقاعدگی روحانی استقامت پیدا کرتی ہے۔",
          "جتنا پڑھنا باقاعدہ ہوگا اتنا ہی یہ فائدے زندگی میں قائم رہتے ہیں۔",
        ],
      },
      {
        heading: "ایپ کے ذریعے ٹریکنگ",
        body: [
          "Delail‑i Hayrat Tracker ایپ آپ کو ہفتہ وار ہدف مقرر کرنے، روزانہ تلاوت درج کرنے اور قضا دنوں کو منظم طریقے سے پورا کرنے میں مدد دیتی ہے۔",
          "پوائنٹس اور اسٹریک آپ کی پیش رفت نمایاں کر کے نرمی سے حوصلہ افزائی کرتے ہیں۔",
        ],
      },
    ],
  },
  id: {
    title: "Apa itu Dalā’il al‑Khairāt?",
    description: "Penjelasan lengkap tentang Dalā’il al‑Khairāt, penulisnya, dan tradisi pembacaannya.",
    sections: [
      {
        heading: "Definisi",
        body: [
          "Dalā’il al‑Khairāt (Delail‑i Hayrat) adalah kumpulan salawat dan doa untuk Nabi Muhammad ﷺ yang telah dibaca selama berabad‑abad di dunia Islam.",
          "Membacanya membantu memperbarui cinta kepada Rasulullah, menghidupkan dzikir, dan memperdalam kesadaran berdoa dalam keseharian.",
        ],
      },
      {
        heading: "Penyusun: Imam al‑Jazuli",
        body: [
          "Karya ini disusun pada abad ke‑15 oleh ulama Maroko Imam Muhammad ibn Sulayman al‑Jazuli.",
          "Beliau menghimpun salawat dari sumber yang tepercaya dan membaginya menjadi bagian harian/mingguan agar mudah istiqamah.",
        ],
      },
      {
        heading: "Struktur dan siklus mingguan",
        body: [
          "Dalā’il al‑Khairāt biasanya dibaca dalam siklus mingguan, dibagi menjadi porsi harian (hizb/awrad).",
          "Banyak pembaca menargetkan 5–7 hari per minggu dan mengganti hari yang terlewat dengan bacaan qadha.",
        ],
      },
      {
        heading: "Mengapa membaca secara rutin?",
        body: [
          "Salawat adalah amalan yang menenangkan hati dan membawa keberkahan bagi doa. Rutin membaca menumbuhkan istiqamah.",
          "Konsistensi membuat manfaat rohani terasa lebih mendalam dan berkelanjutan.",
        ],
      },
      {
        heading: "Melacak dengan aplikasi",
        body: [
          "Aplikasi Delail‑i Hayrat Tracker membantu menetapkan target mingguan, menandai bacaan harian, dan mencatat bacaan qadha.",
          "Poin dan streak memperlihatkan progres Anda sehingga lebih mudah menjaga ritme.",
        ],
      },
    ],
  },
  de: {
    title: "Was ist Delail‑i Hayrat?",
    description: "Ausführliche Einführung in Delail‑i Hayrat, seinen Autor und die Lesetradition.",
    sections: [
      {
        heading: "Definition",
        body: [
          "Delail‑i Hayrat ist eine bedeutende Sammlung von Salawat und Bittgebeten für den Propheten Muhammad ﷺ, die seit Jahrhunderten in der islamischen Welt rezitiert wird.",
          "Die regelmäßige Rezitation erneuert die Liebe zum Propheten, stärkt das Gedenken (Dhikr) und vertieft die spirituelle Achtsamkeit.",
        ],
      },
      {
        heading: "Autor: Imam al‑Jazuli",
        body: [
          "Das Werk wurde im 15. Jahrhundert vom marokkanischen Gelehrten Imam Muhammad ibn Sulayman al‑Jazuli zusammengestellt.",
          "Er sammelte verbreitete Salawat aus zuverlässigen Quellen und ordnete sie in tägliche Abschnitte, um Beständigkeit zu erleichtern.",
        ],
      },
      {
        heading: "Struktur und Wochenzyklus",
        body: [
          "Traditionell wird Delail‑i Hayrat in einem wöchentlichen Rhythmus gelesen, unterteilt in tägliche Teile (Hizb/Awrad).",
          "Viele Leser setzen sich ein Ziel von 5–7 Tagen pro Woche und holen versäumte Tage nach.",
        ],
      },
      {
        heading: "Warum regelmäßig lesen?",
        body: [
          "Salawat gilt als Quelle von Segen und innerer Ruhe. Regelmäßigkeit fördert die geistige Standhaftigkeit (Istiqamah).",
          "Durch kontinuierliches Lesen werden diese Wirkungen im Alltag spürbarer.",
        ],
      },
      {
        heading: "Nachverfolgung mit der App",
        body: [
          "Delail‑i Hayrat Tracker hilft, Wochenziele zu setzen, tägliche Fortschritte zu markieren und Nachhol‑Lesungen zu planen.",
          "Punkte und Streaks machen Beständigkeit sichtbar und motivierend.",
        ],
      },
    ],
  },
  ja: {
    title: "ダラーイル・ハイラートとは？",
    description: "ダラーイル・ハイラートの内容、著者、読誦の伝統を詳しく解説します。",
    sections: [
      {
        heading: "概要",
        body: [
          "ダラーイル・ハイラート（Delail‑i Hayrat）は、預言者ムハンマド ﷺ へのサラワート（祝福の祈り）と嘆願を集めた名高い書で、イスラーム世界で長く読誦されてきました。",
          "読誦を通じて預言者への愛を新たにし、心の記憶（ズィクル）を深め、日常の祈りの意識を高めます。",
        ],
      },
      {
        heading: "著者：アル＝ジャズーリー師",
        body: [
          "本書は15世紀モロッコの学者・スーフィーであるイマーム・アル＝ジャズーリーによって編纂されました。",
          "信頼できる伝承からサラワートを集め、毎日読めるよう週の区分に整理したことで広く普及しました。",
        ],
      },
      {
        heading: "構成と週間読誦",
        body: [
          "一般に一週間のサイクルで読まれ、テキストは日ごとの部分（ヒズブ／アウラード）に分かれています。",
          "多くの読者は週5～7日の目標を立て、逃した日は後から補読します。",
        ],
      },
      {
        heading: "なぜ継続するのか",
        body: [
          "サラワートは心を清め、祈りに祝福をもたらす行いとして尊ばれます。継続は霊的な安定（イスティカーマ）を育てます。",
          "一定のリズムで続けることで、その恩恵を日常で感じやすくなります。",
        ],
      },
      {
        heading: "アプリでの記録",
        body: [
          "Delail‑i Hayrat Tracker は週間目標の設定、日々の読誦記録、補読日の管理を簡単にします。",
          "ポイントと連続記録が進捗を可視化し、穏やかに励まします。",
        ],
      },
    ],
  },
  sw: {
    title: "Delail‑i Hayrat ni nini?",
    description: "Maelezo ya kina kuhusu Delail‑i Hayrat, mtunzi wake na desturi ya usomaji.",
    sections: [
      {
        heading: "Ufafanuzi",
        body: [
          "Delail‑i Hayrat ni mkusanyiko maarufu wa salawat na dua kwa Mtume Muhammad ﷺ, uliosomwa kwa karne nyingi katika ulimwengu wa Kiislamu.",
          "Kusoma kwa utaratibu kunahuisha dhikr, kunarejesha mapenzi kwa Mtume na kuimarisha uhusiano na dua katika maisha ya kila siku.",
        ],
      },
      {
        heading: "Mtunzi: Imam al‑Jazuli",
        body: [
          "Kitabu hiki kilikusanywa katika karne ya 15 na mwanazuoni wa Morocco Imam Muhammad ibn Sulayman al‑Jazuli.",
          "Aliyapanga salawat yaliyopokelewa kutoka vyanzo vinavyoaminika katika sehemu za kila siku ili kusaidia kuendelea kwa uthabiti.",
        ],
      },
      {
        heading: "Muundo na usomaji wa wiki",
        body: [
          "Kwa kawaida Delail‑i Hayrat husomwa kwa mzunguko wa wiki, kimegawanywa katika sehemu za kila siku (hizb/awrad).",
          "Wasomaji wengi huweka lengo la siku 5–7 kwa wiki na hulipa siku zilizokosekana baadaye.",
        ],
      },
      {
        heading: "Kwa nini kusoma kwa kudumu?",
        body: [
          "Salawat ni ibada inayotuliza moyo na kuleta baraka kwa dua. Uthabiti hujenga istiqamah.",
          "Kuendelea kwa mpangilio hufanya manufaa haya ya kiroho yadumu.",
        ],
      },
      {
        heading: "Ufuatiliaji kupitia programu",
        body: [
          "Delail‑i Hayrat Tracker hukusaidia kuweka malengo ya wiki, kuashiria usomaji wa kila siku na kupanga siku za kulipa.",
          "Pointi na mfululizo huonyesha maendeleo yako na kukutia moyo kwa upole.",
        ],
      },
    ],
  },
  mr: {
    title: "दलाईल‑ए‑हयرات म्हणजे काय?",
    description: "दलाईल‑ए‑हयرات, त्याचे संकलक आणि वाचन परंपरा याविषयी सविस्तर माहिती.",
    sections: [
      {
        heading: "परिचय",
        body: [
          "दलाईल‑ए‑हयرات (Delail‑i Hayrat) हे पैगंबर मुहम्मद ﷺ यांच्यावर सलावत व दुआंचे प्रसिध्द संकलन आहे, जे शेकडो वर्षांपासून मुस्लिम समाजात वाचले जाते.",
          "याचे नियमित वाचन प्रेम‑ए‑रसूल ﷺ ताजे करते, हृदयाला झिक्रने जागृत ठेवते आणि दुआबद्दलची जाणीव वाढवते.",
        ],
      },
      {
        heading: "संकलक: इमाम अल‑जझूली",
        body: [
          "हे ग्रंथ १५व्या शतकात मोरोक्कोच्या इमाम अल‑जझूली यांनी संकलित केले.",
          "विश्वसनीय स्रोतांतील सलावत एकत्र करून त्यांनी त्यांना दररोज/आठवड्याच्या भागांत मांडले, जेणेकरून सातत्य राखणे सोपे झाले.",
        ],
      },
      {
        heading: "रचना व साप्ताहिक वाचन",
        body: [
          "परंपरेनुसार दलाईल‑ए‑हयرات आठवड्याच्या चक्रात वाचले जाते; ग्रंथ दिवसनिहाय भागांत (हिज्ब/अवराद) विभागलेला आहे.",
          "बहुतेक वाचक आठवड्यात ५–७ दिवसांचे लक्ष्य ठेवतात आणि चुकलेल्या दिवसांची क़ज़ा नंतर करतात.",
        ],
      },
      {
        heading: "सातत्य का आवश्यक?",
        body: [
          "सलावत हृदयाला शांती देते व दुआमध्ये बरकत वाढवते असे परंपरेत सांगितले जाते. नियमितता इस्तिकामत निर्माण करते.",
          "सतत वाचन केल्याने हा आध्यात्मिक लाभ टिकून राहतो.",
        ],
      },
      {
        heading: "अॅपद्वारे ट्रॅकिंग",
        body: [
          "Delail‑i Hayrat Tracker अॅप आठवड्याचे लक्ष्य ठरवणे, रोजची वाचन नोंद ठेवणे आणि क़ज़ा दिवस नियोजनात मदत करतो.",
          "पॉइंट्स व स्ट्रीक तुमची प्रगती दाखवून प्रेरणा देतात.",
        ],
      },
    ],
  },
  te: {
    title: "దలాయిల్‑ఇ హయరాత్ ఏమిటి?",
    description: "దలాయిల్‑ఇ హయరాత్, రచయిత, మరియు పఠన పరంపరపై విస్తృత వివరణ.",
    sections: [
      {
        heading: "పరిచయం",
        body: [
          "దలాయిల్‑ఇ హయరాత్ (Delail‑i Hayrat) ప్రవక్త ముహమ్మద్ ﷺ పై సలావాత్‌లు మరియు దువాల ప్రసిద్ధ సంకలనం, ఇది శతాబ్దాలుగా ఇస్లాం ప్రపంచంలో పఠించబడుతోంది.",
          "నిత్య పఠనం ప్రవక్తపై ప్రేమను నవీకరిస్తుంది, హృదయాన్ని జిక్రుతో ఉత్సాహపరుస్తుంది మరియు దువాపట్ల అవగాహనను పెంచుతుంది.",
        ],
      },
      {
        heading: "రచయిత: ఇమామ్ అల్‑జజూలీ",
        body: [
          "ఈ గ్రంథాన్ని 15వ శతాబ్దంలో మొరాకోకు చెందిన ఇమామ్ అల్‑జజూలీ సంకలనం చేశారు.",
          "ఆయన విశ్వసనీయ మూలాల నుండి సలావాత్‌లను సేకరించి రోజువారీ/వారాంత భాగాలుగా క్రమబద్ధం చేశారు.",
        ],
      },
      {
        heading: "రూపకల్పన మరియు వారపు పఠనం",
        body: [
          "సాంప్రదాయంగా ఇది వారపు చక్రంలో చదవబడుతుంది; గ్రంథం రోజువారీ భాగాలుగా (హిజ్బ్/అవ్రాద్) విభజించబడింది.",
          "చాలా మంది వారానికి 5–7 రోజులు పఠన లక్ష్యంగా పెట్టుకుని మిస్సైన రోజులను తరువాత క఼దా ద్వారా పూర్తి చేస్తారు.",
        ],
      },
      {
        heading: "ఎందుకు నిరంతరం చదవాలి?",
        body: [
          "సలావాత్ హృదయానికి శాంతిని ఇస్తుంది, దువాకు బరకత్‌ను పెంచుతుంది. నిరంతరత ఇస్తికామాను పెంపొందిస్తుంది.",
          "సుదీర్ఘంగా కొనసాగిస్తే ఆధ్యాత్మిక లాభాలు జీవనంలో నిలకడగా ఉంటాయి.",
        ],
      },
      {
        heading: "యాప్‌తో ట్రాకింగ్",
        body: [
          "Delail‑i Hayrat Tracker యాప్ వారపు లక్ష్యాలను సెట్ చేయడం, రోజువారీ పఠనాన్ని గుర్తించడం, మరియు క఼దా పఠనాన్ని నిర్వహించడంలో సహాయపడుతుంది.",
          "పాయింట్లు మరియు స్ట్రీక్‌లు మీ పురోగతిని చూపుతూ ప్రోత్సహిస్తాయి.",
        ],
      },
    ],
  },
  ta: {
    title: "தலாயில்‑இ ஹயராத் என்ன?",
    description: "தலாயில்‑இ ஹயராத், அதன் ஆசிரியர் மற்றும் வாசிப்பு மரபு பற்றிய விரிவான விளக்கம்.",
    sections: [
      {
        heading: "வரையறை",
        body: [
          "தலாயில்‑இ ஹயராத் (Delail‑i Hayrat) நபி முஹம்மது ﷺ மீது சலாவாத்தும் துஆவுகளும் அடங்கிய பிரபல தொகுப்பு; இது நூற்றாண்டுகளாக இஸ்லாமிய உலகில் வாசிக்கப்படுகிறது.",
          "இதனை முறையாகப் படிப்பது நபி மீது உள்ள அன்பை புதுப்பித்து, இதயத்தில் திக்ரை உயிரோட்டமாக வைத்திருக்க உதவுகிறது.",
        ],
      },
      {
        heading: "ஆசிரியர்: இமாம் அல்‑ஜஜூலி",
        body: [
          "15‑ஆம் நூற்றாண்டில் மொராக்கோவைச் சேர்ந்த இமாம் அல்‑ஜஜூலி இந்த நூலை தொகுத்தார்.",
          "நம்பத்தகுந்த ஆதாரங்களில் இருந்து சலாவாத்துகளை சேகரித்து தினசரி/வாராந்த பகுதி முறையில் அமைத்தார்.",
        ],
      },
      {
        heading: "கட்டமைப்பு மற்றும் வாராந்த வாசிப்பு",
        body: [
          "தலாயில்‑இ ஹயராத் பொதுவாக வாரச் சுற்றுப்பாதையில் படிக்கப்படுகிறது; இது தினசரி பகுதிகளாக (ஹிஜ்ப்/அவ்ராத்) பிரிக்கப்பட்டுள்ளது.",
          "பலர் வாரத்திற்கு 5–7 நாட்கள் இலக்காக வைத்து தவறிய நாட்களை பிறகு கஸா வாசிப்பால் நிரப்புகின்றனர்.",
        ],
      },
      {
        heading: "ஏன் தொடர்ந்து படிக்க வேண்டும்?",
        body: [
          "சலாவாத் இதயத்திற்கு அமைதியைத் தரும் மற்றும் துஆவில் பரகத்தை அதிகரிக்கும் என்று மரபில் கூறப்படுகிறது. தொடர்ச்சி இஸ்திகாமாவை வளர்க்கும்.",
          "ஒழுங்கான பழக்கம் உருவானால் ஆன்மீக பயன்கள் நிலைத்திருக்கும்.",
        ],
      },
      {
        heading: "அப்பின் மூலம் கண்காணிப்பு",
        body: [
          "Delail‑i Hayrat Tracker அப் வார இலக்கை அமைக்க, தினசரி வாசிப்பை பதிவு செய்ய, கஸா நாட்களை திட்டமிட உதவுகிறது.",
          "பாயிண்ட் மற்றும் ஸ்ட்ரீக் உங்கள் நிலைத்தன்மையை தெளிவாக காட்டுகின்றன.",
        ],
      },
    ],
  },
  vi: {
    title: "Delail‑i Hayrat là gì?",
    description: "Giới thiệu chi tiết về Delail‑i Hayrat, tác giả và truyền thống đọc.",
    sections: [
      {
        heading: "Định nghĩa",
        body: [
          "Delail‑i Hayrat là tuyển tập nổi tiếng gồm salawat và lời cầu nguyện dành cho Nhà Tiên tri Muhammad ﷺ, được đọc rộng rãi trong thế giới Hồi giáo suốt nhiều thế kỷ.",
          "Việc đọc đều đặn giúp làm mới tình yêu với Tiên tri, nuôi dưỡng dhikr trong tim và tăng sự gắn kết với dua hằng ngày.",
        ],
      },
      {
        heading: "Tác giả: Imam al‑Jazuli",
        body: [
          "Tác phẩm do học giả Maroc thế kỷ XV Imam al‑Jazuli biên soạn.",
          "Ngài tập hợp các salawat từ nguồn đáng tin cậy và sắp xếp thành phần đọc hằng ngày/tuần để dễ duy trì.",
        ],
      },
      {
        heading: "Cấu trúc và chu kỳ tuần",
        body: [
          "Delail‑i Hayrat thường được đọc theo chu kỳ một tuần, chia thành các phần mỗi ngày (hizb/awrad).",
          "Nhiều người đặt mục tiêu 5–7 ngày mỗi tuần và bù các ngày bị lỡ khi cần.",
        ],
      },
      {
        heading: "Vì sao cần đọc đều đặn?",
        body: [
          "Salawat mang lại sự an yên cho trái tim và phúc lành cho lời cầu nguyện. Sự đều đặn giúp xây dựng istiqamah.",
          "Khi giữ nhịp đọc ổn định, lợi ích tinh thần trở nên bền vững hơn.",
        ],
      },
      {
        heading: "Theo dõi bằng ứng dụng",
        body: [
          "Delail‑i Hayrat Tracker cho phép bạn đặt mục tiêu tuần, đánh dấu tiến độ hằng ngày và ghi lại đọc bù.",
          "Điểm và streak giúp bạn thấy rõ sự kiên trì của mình.",
        ],
      },
    ],
  },
  ko: {
    title: "달라일‑이 하이라트란?",
    description: "달라일‑이 하이라트의 내용, 저자, 그리고 독송 전통을 자세히 소개합니다.",
    sections: [
      {
        heading: "정의",
        body: [
          "달라일‑이 하이라트(Delail‑i Hayrat)는 예언자 무함마드 ﷺ께 드리는 살라왓과 기도를 모은 유명한 모음집으로, 수세기 동안 이슬람 세계에서 낭독되어 왔습니다.",
          "이를 꾸준히 읽으면 예언자에 대한 사랑을 새롭게 하고, 마음속 디크르(기억)를 살아 있게 하며, 일상 속 두아와의 연결을 깊게 합니다.",
        ],
      },
      {
        heading: "저자: 이맘 알‑자줄리",
        body: [
          "이 책은 15세기 모로코의 학자이자 수피 지도자인 이맘 알‑자줄리가 편찬했습니다.",
          "신뢰할 수 있는 전승에서 살라왓을 모아 주간/일일 분량으로 정리하여 꾸준히 읽기 쉽게 만들었습니다.",
        ],
      },
      {
        heading: "구성과 주간 독송",
        body: [
          "전통적으로 한 주 단위로 읽으며, 본문은 매일의 부분(hizb/awrad)으로 나뉘어 있습니다.",
          "많은 독자들이 주 5–7일 목표를 세우고, 놓친 날은 나중에 보충 독송합니다.",
        ],
      },
      {
        heading: "왜 꾸준히 읽어야 하나요?",
        body: [
          "살라왓은 마음을 밝히고 두아에 바라고(복)을 더해주는 기억의 행위로 여겨집니다. 규칙성은 이스티카마(지속성)를 키웁니다.",
          "계속해서 읽을수록 이러한 영적 유익을 더 안정적으로 느낄 수 있습니다.",
        ],
      },
      {
        heading: "앱으로 기록하기",
        body: [
          "Delail‑i Hayrat Tracker는 주간 목표 설정, 일일 독송 기록, 보충 독송 계획을 돕습니다.",
          "포인트와 스트릭은 꾸준함을 눈에 보이게 해 주어 동기를 높입니다.",
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
    path: "/app/info/what-is",
    title: `${t.brand} | ${page.title}`,
    description: page.description,
    type: "article",
  });
}

export default function WhatIsPage({ params }: { params: { locale: Locale } }) {
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
