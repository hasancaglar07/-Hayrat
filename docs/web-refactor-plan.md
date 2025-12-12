# Next.js + Tailwind (shadcn-stil) Refactor Planı — Mobil Parite + OKLCH Tema

Hedef: Stitch HTML’lerini tamamen kaldırıp, Next.js App Router + Tailwind (OKLCH değişkenleriyle) + shadcn tarzı bileşenlerle A-Z çalışan, Expo mobil akışının birebir web paritesini sağlayan bir sürüm çıkarmak. Tüm sayfalar dinamik React bileşenleri olacak; CTA’lar Next router ile çalışacak; tek tasarım sistemi: verilen OKLCH palette.

## 0) Tema değişkenleri (OKLCH)
`:root` ve `.dark` altında aşağıdaki değişkenler kullanılacak; Tailwind theme’e map edilecek:
```
--radius: 0.65rem;
--background: oklch(1 0 0);
--foreground: oklch(0.141 0.005 285.823);
--card: oklch(1 0 0);
--card-foreground: oklch(0.141 0.005 285.823);
--popover: oklch(1 0 0);
--popover-foreground: oklch(0.141 0.005 285.823);
--primary: oklch(0.648 0.2 131.684);
--primary-foreground: oklch(0.986 0.031 120.757);
--secondary: oklch(0.967 0.001 286.375);
--secondary-foreground: oklch(0.21 0.006 285.885);
--muted: oklch(0.967 0.001 286.375);
--muted-foreground: oklch(0.552 0.016 285.938);
--accent: oklch(0.967 0.001 286.375);
--accent-foreground: oklch(0.21 0.006 285.885);
--destructive: oklch(0.577 0.245 27.325);
--border: oklch(0.92 0.004 286.32);
--input: oklch(0.92 0.004 286.32);
--ring: oklch(0.841 0.238 128.85);
--chart-1…chart-5, --sidebar* (değerler yukarıdaki blokta).
.dark: verilen blok.
```
Font: Spline Sans; ikon: Material Symbols.

## 1) Temel altyapı
- Tailwind config: OKLCH değişkenlerini theme renklerine bağla; radius 0.65rem default; card/popover/sidebar renkleri map edilecek. `globals.css` sade, base tipografi + theme vars.
- UI kit (shadcn-stil, kendi implementasyonumuz):
  - Button (primary/secondary/ghost/destructive)
  - Input/Select/Radio/Checkbox/Switch/Slider
  - Card/Popover/Modal/Drawer
  - Badge/Pill/Tag, Tabs/Segmented, Progress
  - Layout primitives: Section, Container, PageHeader
- Fonts/Icons: Spline Sans + Material Symbols (Next font + `<link>`), importlar head/layout’tan yönetilecek.

## 2) Eski yükleyicileri temizle
- Tüm HTML render/parsing (stitchLoader, stitch-rendered-page vs.) silinecek; sayfalar JSX/Tailwind ile yeniden yazılacak.
- AppShell yok; sayfalar kendi üst barlarını içerir veya ortak Header bileşeni yapılır.

## 3) Rota ve sayfa haritası
- `/welcome`
- `/language`
- `/intent`
- `/benefits`
- `/home` (ana/haftalık)
- `/reading`
- `/reading-settings` (modal component olarak import)
- `/ranking`
- `/profile`
- `/settings`
- `/missed`
- `/faq`
- `/about`
- `/donate`
- `/` → `/welcome` redirect

## 4) Sayfa tasarımları (React + Tailwind)
Her sayfa Stitch görsellerini referans alacak, ancak JSX + Tailwind ile yeniden yazılacak; inline stil yok, component bazlı.
- Welcome: hero görsel (bg-image), dil butonu, Begin/Guest CTA.
- Language: kartlı dil listesi (radio), Continue/Back, info kartı.
- Intent: hedef/checkbox + Save CTA.
- Benefits: hero + benefits grid + start CTA.
- Home: haftalık overview kartları, CTA’lar (reading/ranking/profile/settings).
- Reading: okuma metni, kontroller (font/line-height/auto-scroll), tamamla CTA, reading-settings modal bileşeni.
- Ranking: filtreler, liste kartları, opt-in toggle.
- Profile: form alanları, avatar alanı, save CTA.
- Settings: tema/font/okuma ayarları listesi.
- Missed: uyarı kartı + go home.
- FAQ/About/Donate: statik içerik, kart/section düzeni.

## 5) Navigasyon ve CTA akışı
- Button click → Next router push. Route haritası:
  - Welcome: Begin→/language, Guest→/home
  - Language: Continue→/intent, Back→/welcome
  - Intent: Save→/benefits, Back→/language
  - Benefits: Start→/home, Back→/welcome
  - Home: okumaya devam→/reading; diğer kartlar ilgili rota
  - Reading: Finish→/ranking (veya /home), View duas→/home
  - Ranking/Profile/Settings/Missed/FAQ/About/Donate: Back→/home (gerektiği yerde özelleştir)
- Form state: controlled React state; şimdilik mock data.

## 6) Data/Mock
- Mobil kurguyla uyum:
  - User: `targetReadingDaysPerWeek`, `khatmDurationDays`, `showInGlobalRanking`, `countryCode`, `appLanguage`.
  - Stats: `totalPoints`, `currentStreakDays`, `longestStreakDays`, `weeklyPoints`, `monthlyPoints`, `logs` (date, mode, completed).
  - Settings: themePreference, font size/line-height, contentLanguages.
- Supabase entegrasyonu refactor sonrasında; şimdilik local mock context (useUserMock/useStatsMock/useSettingsMock) + localStorage persister.

## 7) CSS ve tema
- `globals.css`: verilen OKLCH değişkenleri, base tipografi, body bg. Tailwind renk map’leri bu değişkenlere bağlanacak.
- Karanlık mod: `.dark` class; toggle ileride eklenir (varsayılan dark açık kalabilir).

## 8) Uygulama sırası
1) Tailwind config + globals (OKLCH) + UI kit.
2) Eski Stitch loader/HTML tümden kaldır.
3) Sayfaları sırasıyla yaz: Welcome → Language → Intent → Benefits → Home → Reading (+modal) → Ranking → Profile → Settings → Missed → FAQ → About → Donate. Mobile UX referansı: `src/navigation/MainTabs` ve ilgili screen componentleri.
4) CTA router bağlantıları, controlled state, mock contextler.
5) Temizlik: lint, `npm run dev` ile görsel kontrol.

## 9) Sonraki adım
