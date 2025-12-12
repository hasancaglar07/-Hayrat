# Supabase + Next.js Web Geliştirme Planı

Bu plan, mevcut mobil uygulamanın tasarımını ve davranışını koruyarak Next.js (App Router) ile Vercel’e dağıtılacak bir web sürümü çıkarmak için izlenecek adımları içerir. Backend olarak Supabase kullanılacak ve mobil + web aynı veritabanını paylaşacaktır. Mock leaderboard fallback’ı (API_BASE_URL yok/erişilemez ise) korunacak.

## 1) Kapsam ve hedefler
- Mobildeki ana akışların web’de birebir paritesi: onboarding, günlük okuma, geçmiş/günlükler, global sıralama, profil/ayarlar.
- Aynı renk paleti/typografi (src/theme/designTokens.ts, typography.ts) ve dil dosyaları (src/i18n/*.json) yeniden kullanılır.
- Backend netliği: Supabase Postgres + Auth + RLS + Storage; global sıralama/istatistikler Supabase’den gelir, opt-in/opt-out sunucuya yazılır.
- Vercel dağıtımı; çevre değişkeni yoksa mock leaderboard gösterme ve yazma işlemlerini devre dışı bırakma.

## 2) Teknoloji ve mimarî kararlar
- Next.js 14 App Router + TypeScript + React Server Components; UI tarafında Tailwind (veya mevcut NativeWind sınıflarını karşılayacak sınırlı set) + Radix UI (opsiyon).
- Supabase: Postgres, Auth (email-magic-link + Google/Apple), Storage (avatar/kapak görselleri).
- Tasarım paylaşımları: `packages/design-tokens` (colors/radii/spacing) ve `packages/i18n` (JSON çeviriler) ile hem mobil hem web aynı kaynaklardan beslenecek; mobildeki import yolları bu pakete taşınacak.
- Auth stratejisi: Supabase Auth tüm platformlarda ana kaynak; mobildeki Clerk akışı aşamalı olarak Supabase’e taşınır (geçiş sürecinde Next API proxy ile Clerk token → service role ile Supabase yazma opsiyonu yedek olarak eklenir).

## 3) Supabase şeması ve politikalar
- Tablolar
  - `profiles`: id (uuid, auth uid), display_name, avatar_url, country, opt_in boolean, app_language, created_at, updated_at.
  - `reading_logs`: profile_id, date (date), weekday, mode, completed, points_earned, completed_at, section_ids jsonb.
  - `reading_stats`: profile_id, total_points, weekly_points, monthly_points, current_streak_days, longest_streak_days, last_completed_date, updated_at (materialized/güncel tutulacak).
- Görünümler/func
  - `leaderboard_view`: opt_in=true kullanıcılar için puan/streak toplamlarını döner; period filtreleri için (week/month/all) view veya SQL function.
  - Trigger/function: reading_logs insert/upsert sonrasında reading_stats güncellemesi.
- RLS (ana hat)
  - `profiles`: kullanıcı kendi satırını okuyup yazabilir; `opt_in=true` satırlar leaderboard view üzerinden okunabilir (anon read).
  - `reading_logs`: sadece sahibi okuyup yazabilir.
  - `reading_stats`: sahibi okuyabilir; leaderboard view için opt_in filtreli public read.
- Indexler: `reading_logs(date, profile_id)`, `reading_stats(total_points desc)`, composite week/month materialized hesaplar için.
- Storage: bucket `avatars` (public değil, signed URL ile); RLS: kullanıcı kendi dosyasını yazıp silebilir.

## 4) Çevre değişkenleri ve fallback
- Next.js: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (yalnızca route handler/server actions için), `NEXT_PUBLIC_APP_VERSION`, `NEXT_PUBLIC_FEATURE_MOCK_LEADERBOARD`.
- Mobil: aynı URL/anon key; yoksa mevcut mock leaderboard + local storage yazmaları devam eder, UI’da “offline/mısın?” banner.
- Sağlık kontrolü: Uygulama açılışında Supabase ping; başarısızsa mock moda geçiş ve yazmaları kilitleme.

## 5) Monorepo klasör yapısı (öneri)
- `web/` — Next.js projesi (app router).
- `packages/design-tokens/` — colors/radii/spacing/font scale (mevcut src/theme’den taşınacak).
- `packages/i18n/` — JSON çeviriler + tipler.
- `packages/content/` — okuma içerikleri (readingSections.*.json) paylaşımı.
- Mobil tarafında import yolları yeni paketlere güncellenir; böylece tek kaynaklı tasarım ve içerik sağlanır.

## 6) UI/UX rehberi (mobil paritesi)
- Renk paleti (mevcut): background `#f7f9f8`, backgroundAlt `#eef3ef`, card `#ffffff`, cardMuted `#f2f6f3`, border `#dfe7e3`, borderMuted `#e7eeea`, accent `#00a69c`, accentDark `#007a73`, accentSoft `#d7f4f1`, accentAlt `#009087`, warning `#e47b2c`, warningSoft `#fff3e8`, warningBorder `#f3d4b2`, textPrimary `#13241a`, textSecondary `#51635a`, textMuted `#7b8b83`.
- Typografi: InterVariable (Latin) + ScheherazadeNew (Arapça); web için font-face eklenir, FOUT önleyici preload yapılır.
- Bileşen seti: AppShell benzeri layout, kartlar (radius md/lg), yumuşak gölgeler, progress pill’leri, badge’ler (accentSoft arkaplan, accent text).
- Animasyon: sayfa girişlerinde hafif fade/slide; CTA butonlarında hover/active durumları.

## 7) Sayfa ve özellik planı (Next.js)
- `/` (Landing/Home): günlük okuma kartı, haftalık hedef ilerleme, bugün tamamlandı mı.
- `/onboarding`: dil seçimi, hedef gün/hafta, opt-in tercihi; supabase profil oluşturma + log seed.
- `/reading/[day]`: ilgili günün içeriklerini (shared content JSON) gösterme, ilerleme kaydı; server action ile log yazma; offline ise localStorage kuyruğu.
- `/ranking`: filtre (week/month/all/nearby), opt-in toggle, paylaşım; Supabase leaderboard_view çağrısı; API yoksa mock liste + banner.
- `/profile`: dil, bildirim tercihleri, hedef gün, opt-in, avatar upload (Supabase Storage).
- `/settings`: tema, okuma ayarları (font-size/line-height), haptics eşleniği için web animasyon ayarı.
- `/about`/`/privacy`: statik içerik.

## 8) Veri akışı ve caching
- `web/lib/supabase/server.ts`: RSC için server client; `web/lib/supabase/client.ts`: istemci tarafı.
- `web/lib/api/leaderboard.ts`, `profile.ts`, `reading.ts`: tiplenmiş veri erişim katmanı; hem SSR hem CSR’da kullanılabilir.
- ISR/SSR stratejisi: landing/ranking sayfaları 30–60 sn revalidate; kullanıcıya özel veriler RSC veya client fetch ile (auth token).
- Offline/cache: localStorage ile son leaderboard/snippet saklama; “stale” etiketi ile gösterim.

## 9) Test ve kalite
- Birim test: Supabase sorgu yardımcıları, leaderboard dönüştürme fonksiyonları, tarih hesapları.
- Entegrasyon/e2e: Playwright ile onboarding → okuma kaydı → ranking görünümü akışı; mock Supabase (msw) ile API yok senaryosu.
- Tip güvenliği: Supabase types generator (`supabase gen types typescript`) ile web ve mobil paylaşımı.

## 10) Dağıtım ve DevOps
- Vercel prod/staging projeleri; env değişkenleri Vercel Project Settings’ten yönetilir.
- Supabase migrationlar için `supabase/migrations` klasörü ve CI adımı; deploy’da otomatik uygulanır.
- Preview deploy’larda Supabase sandbox (ayrı veritabanı) veya feature branch DB.

## 11) Yol haritası (öneri sprintler)
1. Altyapı: Supabase projesi, şema + RLS, storage bucket, types generation; packages/design-tokens & i18n & content oluşturma.
2. Next.js iskelet: web/ projesi, supabase client setup, temel layout + tema + font yükleme, routing iskeleti.
3. Özellik paritesi: onboarding, profil/ayarlar, reading sayfası, stats yazımı (reading_logs), leaderboard ekranı + mock fallback, avatar upload.
4. Parlatma ve geçiş: mobilde Supabase entegrasyon katmanı, Clerk→Supabase geçiş planı, e2e testler, performans/erişilebilirlik düzeltmeleri.
5. Yayın: Vercel prod, Supabase rate limit/monitoring ayarları, dokümantasyon ve el kitabı.

## 12) Açık noktalar (karar gerektirir)
- Auth geçişi: Direkt Supabase Auth’a mı geçiliyor, yoksa kısa vadede Clerk token’ı server-side doğrulayıp Supabase service role ile mi yazacağız?
- Avatar/medya: Supabase Storage mı, Vercel Blob mu? (Tek elde tutmak için Supabase önerildi).
- Dark/sepia tema: web’de de desteklenecek mi? (mobildeki themePreference aynen taşınabilir).
- SEO: Landing sayfası halka açık mı, yoksa auth arkasında sadece uygulama mı?
