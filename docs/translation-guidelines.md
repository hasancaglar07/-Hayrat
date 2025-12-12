# Delâilü'l-Hayrât Çeviri Kılavuzu

Bu kılavuz, Türkçe kaynak metni diğer dillere (özellikle İngilizce ve Arapça) çevirirken tutarlılığı ve saygılı üslubu korumak için hazırlanmıştır.

## 1) Terminoloji
- **salât / salavat**: Dua/blessing; EN: “salat (invoking blessings)”; AR: “الصلاة على النبي”.
- **âl-i / ehl-i beyt**: EN: “family/household”; AR: “آل / أهل البيت”.
- **Makâm-ı Mahmûd**: EN: “Al-Maqām al-Maḥmūd”; AR: “المقام المحمود”.
- **Vesîle**: EN: “al-Wasīla (the special rank)”; AR: “الوسيلة”.
- **Kevser havuzu**: EN: “Hawd al-Kawthar (Kawthar basin)”; AR: “حوض الكوثر”.
- **Şefaat**: EN: “intercession”; AR: “الشفاعة”.
- **Rahmân / Rahîm**: EN: “The Most Merciful / The Especially Merciful”; AR: “الرحمن / الرحيم”.
- **mü’min / müslüman**: EN: “believer / Muslim”; AR: “مؤمن / مسلم”.
- Özel isimler (peygamberler, sahabe, melekler): Latin harfli biçimi sabit, Arapça’da klasik yazım.

## 2) Üslup ve Ton
- Dua ve saygı tonu korunacak; yalın ve nazik dil. EN/FR/ID’de “O Allah” / “Ya Allah” formu; AR’da klasik dua üslubu.
- Kişi: İkinci tekil (Sen/Sana) tutarlı; EN’de gerekirse “You/Your” büyük harf.
- Noktalama: Uzun cümleler anlamı bozmadan hafif sadeleştirilebilir; gereksiz ünlemden kaçının.
- Transliterasyon: Şimdilik boş; gerekirse ayrı katman.
- Sadakat: Ek açıklama ekleme, kısaltma yapma; terim biliniyorsa aynen bırak, gerekiyorsa parantez içinde kısa açıklama (EN/FR/ID).
- Arapça: Hareke zorunlu değil; dua kalıpları klasik yazımla.

## 3) Segmentasyon
- Her `readingSection` ayrı çeviri birimi: Giriş (order 0) + numaralı bölümler.
- Çok uzun paragraflar tek segmentte kalsın, ancak EN/FR/ID’de anlamı bozmadan cümleleri noktalı hale getirilebilir.

## 4) Yapı ve JSON
- `id`, `weekday`, `order`, `title` aynen korunacak; sadece `translations.<lang>` doldurulacak.
- Dil dosyaları: `src/content/readingSections.<lang>.json` (tr/en/ar/fr/id). TR kaynak referans olarak kalır.

## 5) Kalite Kontrol
- Yapısal doğrulama: JSON geçerli, tüm segmentler eksiksiz, `order` aralığında boşluk yok.
- Dil kontrolü: Glossary uyumu, özel isimler, dua üslubu, sayı/ölçü terimleri doğru.
- Hızlı gözden geçirme: EN ve AR taslakları için ikinci kontrol (isimler, üslup, kayıp cümle).

## 6) Çalışma Sırası (öneri)
1. Glossary ve stil kılavuzunu onayla (bu dosya).
2. EN taslak çeviri: kaynak TR → EN; glossary’e sadık, saygılı dua tonu.
3. AR taslak çeviri: klasik dua üslubu; özel terimler glossary’e göre.
4. FR ve ID çevirileri: saygılı, sade; terimleri gerekirse parantezle açıklama.
5. QC ve yapısal test: JSON doğrulama, eksik segment kontrolü, uygulamada hızlı smoke test.
