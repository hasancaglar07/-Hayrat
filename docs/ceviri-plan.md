&nbsp;Çok Dilli Çeviri Planı



&nbsp; - Kapsam \& Öncelik: Önce en çok kullanılan ~10 dil (EN,

&nbsp;   AR, ES, FR, DE, RU, PT, HI/UR, ID, ZH). Ardından bölgesel

&nbsp;   (TR’de konuşulan: FA, KU, AZ; Afrika: SW; Avrupa: IT, PL;

&nbsp;   Asya: BN, JA, KO). Kullanıcı kitlesi ve pazar önceliğine

&nbsp;   göre sırala.

&nbsp; - Kaynak \& Stil: TR ana kaynak; mevcut EN/AR kılavuz

&nbsp;   terimleri genişlet. Dil başına kısa glossary + saygılı dua

&nbsp;   üslubu rehberi (siz + dini bağlamda saygı, “O Allah”/“Ya

&nbsp;   Allah” formları, şekersiz üslup).

&nbsp; - Dosya Yapısı: Her dil için readingSections.<lang>.json

&nbsp;   (472 kayıt, translations.<lang>). Yapı TR/EN/AR ile

&nbsp;   birebir. Ortak intro (order 0) kopyalanır.

&nbsp; - Çeviri Sırası (fazlar):

&nbsp;     1. FR → ES → DE → PT → RU → ID → HI/UR → ZH → ek diller.

&nbsp;     2. Gün bazlı iterasyon (Pazar→Cumartesi) her dilde

&nbsp;        tamamlayıp kalite kontrol.

&nbsp;     3. Son tur: sayısal/ölçüsel ifadeler, özel isimler, dua

&nbsp;        kalıpları tutarlılık kontrolü.

&nbsp; - Kalite Kontrol:

&nbsp;     - Otomatik: Türkçe karakter/tam cümle kalmadı mı? JSON

&nbsp;       doğrulama.

&nbsp;     - Stil: “O Allah / Seigneur / Señor / Господи / Ya

&nbsp;       Allah” vb. tutarlı; büyük harf saygı.

&nbsp;     - Terimler: Makam-ı Mahmûd = “al-Maqām al-Maḥmūd”;

&nbsp;       Vesîle = “al-Wasīla”; Kevser havuzu = “Hawd al-

&nbsp;       Kawthar”. Numara/tekrar doğru aktarım.

&nbsp;     - Spot inceleme: her gün 3-5 rastgele kayıt, uzun

&nbsp;       dualarda anlam bütünlüğü.

&nbsp; - Araç/İş Akışı:

&nbsp;     - TR → hedef dil manuel saygılı çeviri; gerekirse EN

&nbsp;       destek.

&nbsp;     - Her dil için ayrı commit/faz (veya klasör) yerine tek

&nbsp;       JSON dosyası.

&nbsp;     - Günlük ilerleme raporu: tamamlanan günler/diller.

&nbsp; - Riskler \& Önlemler:

&nbsp;     - Uzun metinlerde anlam kaybı: paragrafları bölmeden

&nbsp;       çeviri, dua tonu korunur.

&nbsp;     - Özel isim/terim bozulması: glossary sabit, translit

&nbsp;       gerekmez.

&nbsp;     - Performans: 472×N dil; fazlandırma ve otomatik

&nbsp;       kontrollerle hız.

