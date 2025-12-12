# Tespitler ve İş Planı

## Sorun Özeti
- Haftalık hedefler 7 güne sabitlenmiş; 3-4 gün hedef koyanlar hem Home ilerlemesinde hem “kaçan günler”de hatalı uyarı alıyor. Bonus metinleri de 7/7 üzerinden gidiyor.
- Kaza okumalarda hedef tarihi kullanıldığı için geçmiş haftalara puan ve streak bonusu yazılabiliyor; streak hesaplaması gerçek tamamlanma gününü dikkate almıyor.
- Bildirim zamanı girişleri serbest metin, geçersiz saatler sessizce kaydediliyor; hatırlatma satırı tıklanınca hiçbir şey olmuyor.
- Onboarding’de niyet kutusu kaydedilmiyor; dev’de varsayılan olarak onboarding’e zorlama açık.
- FAQ çevirisi eksikse cevap boş görünüyor.
- Puan kırılımları sabit TR metinlerle gösteriliyor; diğer dillerde karışık dil çıkıyor.
- Bağış ekranında IBAN “kopyala” paylaşım menüsüne bağlı, kopyalama garantili değil ve geri bildirim yok.

## Yapılacaklar
1) Haftalık hedef uyumu: Home ilerleme ve kaçan günler hedefe göre çalışacak; kaçan gün listesi sadece hedeflenen eksik sayıyı gösterecek.  
2) Bonus/streak sağlamlığı: Haftalık bonus yalnızca içinde bulunulan hafta hedefi tamamlanınca verilecek; streak ve puan hesapları gerçek tamamlanma tarihini kullanacak.  
3) Bildirim UX: Saat girişleri doğrulanacak, hatalı girişte uyarı verilecek.  
4) Onboarding niyet: Kutucuk işaretlenmeden devam edilemeyecek; onboarding zorlaması dev’de varsayılan kapalı.  
5) İçerik güvenliği: FAQ cevapları çeviri yoksa İngilizce düşecek; puan metinleri i18n’e bağlanacak.  
6) Bağış kopyalama: IBAN doğrudan panoya kopyalanacak ve bilgilendirme gösterilecek.
