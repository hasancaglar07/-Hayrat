# Web Stitch Tasarım Uygulama Planı (sayfa sayfa)

Amaç: `web/stitch_welcome_screen/*/code.html` ve `screen.png` dosyalarındaki tasarımları birebir Next.js (App Router) web sürümüne taşımak; önceki placeholder sayfaları kaldırıp/yerine gerçek tasarımları koymak. Supabase entegrasyonu daha sonra; bu adım saf UI/HTML portu.

## Kaynak klasörleri
- Tasarım HTML/PNG: `web/stitch_welcome_screen/<page>/code.html` ve `screen.png`
- Sayfa klasörleri: welcome_screen, language_select_screen, intent_setup_screen, benefits_screen, home_screen_(weekly_overview), reading_screen, reading_settings_modal, ranking_screen, profile_screen, app_settings_screen, missed_days_screen, faq_screen, about_screen, donate_screen.

## Route eşlemesi (öneri)
- `/welcome` → welcome_screen
- `/language` → language_select_screen
- `/intent` → intent_setup_screen
- `/benefits` → benefits_screen
- `/home` (veya `/`) → home_screen_(weekly_overview)
- `/reading` → reading_screen (+ reading_settings_modal bileşen olarak)
- `/ranking` → ranking_screen
- `/profile` → profile_screen
- `/settings` → app_settings_screen (genel ayarlar)
- `/missed` → missed_days_screen
- `/faq` → faq_screen
- `/about` → about_screen
- `/donate` → donate_screen

## Uygulama sırası
1) **Temizleme**: Önceki placeholder sayfaları (home/reading/ranking/settings/profile/history/more) kaldır veya yeni tasarımla değiştir.
2) **Ortak stil**: code.html içindeki CSS’i çıkarıp `src/styles/stitch.css` (veya global) olarak ekle; font/renk değişkenlerini token’larla uyumlu hale getir (gerekirse yeni tokenlar).
3) **Layout**: AppShell’i stitch tasarımına göre yeniden düzenle (header/nav/footer yoksa minimal root); sayfaların kendi üst barları varsa AppShell’i sadeleştir.
4) **Bileşen çıkarımı**: code.html’lerden ortak bileşenler (buton, card, pill, progress, toggle, tab/segmented, modal) oluştur; inline stilleri kaldırıp sınıflarla besle.
5) **Sayfa portu** (tek tek):
   - welcome_screen → `/welcome`
   - language_select_screen → `/language`
   - intent_setup_screen → `/intent`
   - benefits_screen → `/benefits`
   - home_screen_(weekly_overview) → `/home`
   - reading_screen (+ reading_settings_modal component)
   - ranking_screen
   - profile_screen
   - app_settings_screen (veya `/settings`)
   - missed_days_screen
   - faq_screen
   - about_screen
   - donate_screen
6) **Responsive kontrolü**: code.html’deki grid/flex yapıyı Tailwind/CSS’e taşı; mobil kırılımı doğrula (≤640px).
7) **Temizlik ve lint**: Kullanılmayan eski UI yardımcılarını kaldır; `npm run lint` + görsel kontrol.

## Stil stratejisi
- Öncelik: code.html’deki CSS’i yeniden kullan; sınıf adlarını koruyup global stil veya module’a taşı.
- Renk/typografi: mevcut design tokens yeterli değilse yeni değişkenler ekle; fontlar code.html’e göre güncellenecek.
- Modallar: reading_settings_modal ayrı component olarak import edilecek.

## Sonraki adım
- Bu plana göre sırasıyla temizleme + ortak stil çıkarımı + sayfa portu yapılacak.*** End Patch" }```
