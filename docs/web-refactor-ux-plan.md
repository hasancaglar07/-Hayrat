# Web Refactor UX Planı (Expo Mobil Paritesi)

 Amaç: Expo mobildeki akışları (RootStack/MainTabs ve ekranları) birebir web’e taşırken OKLCH temalı, tutarlı, okunabilir bir UI oluşturmak. Stitch HTML kullanılmayacak; React + Tailwind (OKLCH theme) + shadcn tarzı bileşenlerle her sayfa yeniden tasarlanacak. Hedef: “mobildeki ne varsa web’de de aynı içerik, aynı CTA akışı ve anlaşılır layout”, Supabase AsyncStorage’ın yerini alacak.

## 1) Tema ve tasarım sistemi
- OKLCH değişkenleri (verilen blok) Tailwind theme’e map: background/foreground/card/border/primary/secondary/muted/accent/destructive/ring/radius.
- Tipografi: Spline Sans (H1 32/38, H2 24/30, body 16/24), letter-spacing -0.01em, weight: 700/600/500.
- Spacing: 8px base; kart içi 20–24px; grid 16px; radius 10–16px.
- Gölge: tek tip shadow-sm (0 10 30 rgba(0,0,0,0.06)); accent soft arka planlar sınırlı kullanılır.
- Icon: Material Symbols; hero görseller `public/`a taşınıp `next/image` ile.

## 2) UI kit (shadcn benzeri, zaten başlananları tamamla)
- Button (primary/secondary/ghost/outline/destructive; sm/md/lg, icon slot).
- Input, Textarea, Select (custom), Checkbox/Radio, Toggle, Slider.
- Card, Badge, Progress, Segmented/Tabs, Modal/Drawer, Alert/Callout.
- Layout primitives: PageShell (header+subtitle+actions), Section (title+meta).

## 3) Navigasyon ve rota eşlemesi (mobil parite)
- `/welcome` (OnboardingStack.Welcome)
- `/language` (Dil seçimi)
- `/intent` (Niyet/goal)
- `/benefits` (Faziletler) — mobil “Info” içeriği
- `/home` (HomeStack.Home) — haftalık overview, missed link
- `/missed` (HomeStack.MissedDays)
- `/reading` (ReadingStack.Reading) — “today” veya “makeup” modu
- `/reading-settings` (ReadingSettingsModal)
- `/ranking` (RankingStack.Ranking)
- `/profile` (RankingStack.Profile)
- `/settings` (AppSettings from “More”)
- `/faq` (Info.FAQ)
- `/about` (More.About)
- `/donate` (More.Donate)
- `/` → `/welcome`

 App Router yapılandırması (prompt gereği):
 - `/` → landing veya redirect `/app`
 - `/app` → Home (weekly overview)
 - `/app/reading/[day]`
 - `/app/missed`
 - `/app/ranking`
 - `/app/profile`
 - `/app/info/benefits`
 - `/app/info/faq`
 - `/app/about`
 - `/app/donate`
 - `/app/settings`

CTA akışı (Expo’ya uyum):
- Welcome: Begin→/language, Guest→/home
- Language: Continue→/intent, Back→/welcome
- Intent: Save→/benefits, Back→/language
- Benefits: Start→/home, Back→/welcome
- Home: “Bugün oku”→/reading; “Kaçanlar”→/missed; quick links→/ranking,/profile,/settings
- Reading: Finish→/ranking (veya /home), Settings→/reading-settings
- Ranking/Profile/Settings/Missed/FAQ/About/Donate: Back→/home

## 4) Sayfa bazlı UX rehberi (Expo referansı)
- Welcome: Hero görsel, dil butonu, primary CTA; arka plan blob’ları hafif; headline+body.
- Language: Kart listesi (radio), info callout, continue/back. Başlık bar sade.
- Intent: Hedef gösterge (page/min), +/- butonlar, niyet checkbox, Save CTA.
- Benefits: Grid kartlar, hero başlık, Start/Back CTA.
- Home: Haftalık progress bar + gün pill’leri, puan/streak kartları, bugünkü okuma snippet’i, quick actions grid. Missed banner -> /missed.
- Reading: Arapça metin + çeviri, kontroller (font/line-height/auto-scroll/çeviri toggle), progress % + primary CTA, settings modal link. “today/makeup” segmented.
- Reading-settings: Basit toggles/sliders, save CTA.
- Ranking: Period segmented (week/month/all/nearby), opt-in toggle, list kartları (rank/avatar/name/country/points/streak), status badge.
- Profile: Form (nickname, country, email, language), opt-in toggle, weekly goal/hatim süresi inputları, save/cancel.
- Settings: Theme segmented (system/light/dark/sepya), toggles (notifications/auto-scroll/haptics/content languages), save.
- Missed: Kaçan gün listesi, kaza CTA.
- FAQ/About/Donate: Statik kart/section düzeni, geri/ana CTA’lar.

## 4.1) Web proje yapısı (App Router)
- `app/layout.tsx` (global), `app/page.tsx` (landing/redirect)
- `app/app/layout.tsx` (opsiyonel nested)
- `app/app/page.tsx` → Home
- `app/app/reading/[day]/page.tsx`
- `app/app/missed/page.tsx`
- `app/app/ranking/page.tsx`
- `app/app/profile/page.tsx`
- `app/app/info/benefits/page.tsx`
- `app/app/info/faq/page.tsx`
- `app/app/about/page.tsx`
- `app/app/donate/page.tsx`
- `app/app/settings/page.tsx`
- `lib/core/types.ts` (mobil tipler)
- `lib/core/date.ts`, `lib/core/streak.ts`, `lib/core/points.ts` (mobil utils)
- `lib/content/readingSections.ts` (JSON import)
- `lib/supabaseClient.ts`
- `lib/supabase/helpers.ts` (getOrCreateProfile, settings fetch/update, reading logs CRUD)

## 5) Veri mock ve state
- Mock contextler: useUserMock (targetReadingDaysPerWeek, khatmDurationDays, showInGlobalRanking, country, appLanguage), useStatsMock (totalPoints, streaks, weeklyPoints, logs), useSettingsMock (themePreference, font size/line-height, content languages, notifications).
- Şimdilik local state + optional localStorage persist; Supabase entegrasyonu sonraki faz.
- Reading log mock: tamamlanan günler, weekly progress; Ranking mock: 4-5 satır.

## 6) Temizlik
- Stitch loader/HTML kalıntıları zaten silindi; devam: Tailwind config’e OKLCH map ekle, gereksiz bağımlılıkları temizle.
- Layout’lar PageShell ile yeniden hizalanacak; spacing/typografi tutarlı hale getirilecek.

## 7) Uygulama sırası
1) Tailwind config’i OKLCH değişkenlerine map et (theme colors, radius, fontFamily). PageShell/Section base stilleri.
2) UI kit’i tamamla (Select, Modal/Drawer, Alert, Tabs) ve var olanları OKLCH theme ile uyumlu hale getir.
3) Sayfaları tek tek refine et (Welcome→Donate sırası), PageShell kullanarak başlık/CTA hizalarını düzelt; quick actions, progress bar, kart görünümlerini iyileştir.
4) Mock context ekle (user/stats/settings) ve CTA’ları bu state’le besle (örn. Home’da isim/puan/streak, Reading’de ilerleme yüzdesi).
5) Görsel varlıkları `public/`e al, `next/image` ile optimize et.
6) Lint + manual QA (`npm run dev`) ile görsel kontrol.

## 8) Supabase şeması (AsyncStorage yerine)
- `profiles (id uuid pk, nickname, app_language, target_reading_days_per_week, khatm_duration_days, show_in_global_ranking, country_code, created_at, updated_at)`
- `reading_logs (id uuid pk, user_id fk, date, weekday, mode, completed, points_earned, completed_at, section_ids text[])`
- `reading_settings (user_id pk, font_size, line_height, theme, show_arabic, show_transliteration, show_translation, auto_scroll)`
- `app_settings (user_id pk, language, notifications_enabled, notification_time, remind_missed_days, theme_preference)`
- Opsiyonel: stats view/aggregate ileride; RLS/Auth ileride.
- SQL migration hazırlanacak; helper’lar getOrCreateProfile, get/update settings, reading logs CRUD yazılacak (şimdilik demo user id sabitlenebilir).

## 9) Paylaşılan core
- Tipler: Weekday, AppLanguage, ReadingMode, ThemeMode, ReadingSection, UserProfile, DayReadingLog, UserStats, ReadingSettings, AppSettings (mobil `src/data/types.ts` aynen).
- Utils: date, streak, points (mobil `src/utils/...` aynen).
- İçerik: readingSections JSON (mobil `src/content`).

## 10) Çıkış kriterleri (bu faz)
- Stitch/HTML yok; tüm sayfalar JSX+Tailwind.
- OKLCH tema uygulanmış, UI kit hazır.
- Supabase schema/migration dosyası hazır; helper’lar (getOrCreateProfile, settings, logs insert/query) yazılmış.
- Sayfa akışları ve CTA’lar mobil paritesiyle çalışır (mock/Supabase).
