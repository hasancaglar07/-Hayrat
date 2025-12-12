# Web Tasarım ve Sayfa Parite Planı (Mobil ile Birebir)

Bu doküman, mobil uygulamadaki tüm ekranları web’de aynı deneyimle sunmak için detaylı planı içerir. Amaç: Supabase destekli Next.js web sürümünde her akışın (okuma, onboarding, ranking, profil, ayarlar) aynı görünüm ve davranışa sahip olması; API yoksa mock fallback ile çalışmaya devam etmesi.

## 1) Tasarım ilkeleri
- Renk paleti: `@delail/design-tokens` (background #f7f9f8, card #fff, accent #00a69c, warning #e47b2c, border #dfe7e3, text #13241a/#51635a).
- Tipografi: InterVariable (Latin) + Scheherazade/Noto Naskh (Arapça); kalınlıklar mobil ile aynı. Başlıklar -0.02em letter spacing.
- Köşeler/gölgeler: radius lg/md, yumuşak gölge (`--shadow-soft`).
- Motion: sayfa girişlerinde hafif fade/slide; CTA hover/active durumları.
- Karanlık/sepya: mobildeki themePreference (system/light/dark/sepia) web’de CSS değişkenleriyle sağlanır.
- Responsive: Mobil (≤640), tablet (641–1024), desktop (1025+). Mobilde alt sekme barı; desktop’ta sol nav + üst header.

## 2) Global layout
- Header: logo + ürün adı, hızlı aksiyonlar (devam et, sıralama, profil), dil/tema toggles. Mobilde kompakt; desktop’ta breadcrumb + CTA.
- Ana navigasyon:
  - Mobil: alt tab bar (Home, Reading, Ranking, Profile/Settings, More).
  - Desktop: sol nav (ikon + etiket) ve üstte kullanıcı menüsü.
- Footer: telif/metin, destek/geri bildirim linkleri, gizlilik ve KVKK.
- AppShell: max-width 1200px içerik, sağ/sol boşluk; arkaplanda yumuşak gradient lekeleri (mobil renkleri).
- Banner/alert alanı: Supabase yok/erişilemiyor -> “Mock mod / offline mısın?” bandı; veri yazmaları kilitli.

## 3) Veri ve durum
- Supabase var: gerçek profil/log/stats/leaderboard; opt-in/opt-out sunucuya yazılır.
- Supabase yok: local storage profil/log, mock leaderboard JSON; UI’da belirgin uyarı ve yazma kilidi.
- Auth: Supabase Auth (email+magic, Google/Apple). Geçici olarak anon/mock profil mümkün, ancak opt-in kapalı tutulur.
- Cache: last leaderboard + reading snippet localStorage; stale etiketi ile.

## 4) Sayfa bazlı tasarım ve davranış

### 4.1 Ana Ekran (/ veya /home)
- Hero: “Bugünkü okuma” kartı, ilerleme yüzdesi, CTA “Devam et”.
- Haftalık hedef: 7/hafta ilerleme barı, “bugün tamamlandı” badge; streak/puan özetleri (stats.current/longest/points).
- Hızlı aksiyonlar: “Okumaya başla”, “Sıralama”, “Geçmiş/Günlükler”, “Ayarlar”.
- İçerik snippet: bugünün bölümlerinden ilk 1-2 satır (Arapça + çeviri).
- Durum bandı: Supabase bağlı / mock mod; offline kuyruğu boş/dolu.

### 4.2 Okuma (/reading, /reading/[day])
- İçerik kolonları: Arapça metin, transliteration (opsiyon), çeviri (seçili diller). Font ve satır aralığı mobil ile aynı.
- Kontroller: font-size, line-height, tema, ekran kilidi/auto-scroll (web için smooth scroll). Alt yapışık progress bar.
- Gün seçimi: haftalık sekmeler (Paz–Cts) ve “Makeup” modu.
- Loglama: “Bugünü tamamla” butonu -> Supabase `reading_logs` upsert (+ trigger stats) veya offline kuyruğa push.
- Feedback: başarı animasyonu (hafif) + streak/puan güncellemesi; haptics eşleniği olarak micro animation.
- Kenar durumlar: tekrar tamamla (overwrite), tarih geriye dönük log, Supabase hata -> uyarı + retry.

### 4.3 Ranking (/ranking)
- Filtreler: Haftalık / Aylık / Tümü / Yakınım (ülke/puan bandı). Toggle bar üstte.
- Opt-in toggle: Supabase profilindeki `opt_in`; mock modda disabled + uyarı.
- Liste kartları: sıra numarası, avatar, ad/nickname, ülke bayrağı, puan ve streak badge. “Sen” satırı sabitlenmiş.
- Banner: “API yok, mock liste” veya “Veri taze/Stale”; son yenileme zamanı.
- Paylaş: “İlerlemeni paylaş” (stats üzerinden mesaj).
- Boş durum: opt-out ise rehber mesaj + opt-in CTA.

### 4.4 Onboarding (/onboarding)
- Adım 1: Dil seçimi (i18n paketinden), appLanguage değişimi.
- Adım 2: Hedef gün/hafta, hatim süresi slider.
- Adım 3: Opt-in tercihi (varsayılan kapalı). Supabase bağlı ise profil oluşturma; yoksa local mock profil.
- Adım 4: Avatar + ülke seçimi (Storage upload veya placeholder).
- Özet: tercihleri göster; “Başla” -> home/reading’e yönlendir.
- Hata/bağlantı: Supabase yoksa “offline profil” etiketi.

### 4.5 Profil (/profile)
- Alanlar: display_name, avatar, ülke, dil, opt_in, hedef gün/hafta, hatim süresi.
- Okuma istatistikleri: toplam puan, streak, haftalık/aylık puanlar (read-only).
- Avatar upload: Supabase Storage signed URL veya Vercel Blob (karar sonrası); progress + hata durumları.
- Opt-in: toggle + açıklama; değişiklik Supabase’e PATCH (yoksa local).

### 4.6 Ayarlar (/settings)
- Tema: system/light/dark/sepia.
- Tipografi: font boyutu, satır aralığı, Arapça font seçimi (Noto vs Scheherazade).
- Okuma tercihleri: content languages seçimi, auto-scroll, haptics eşleniği (animasyon).
- Bildirim: günlük hatırlatma saati (web push ileride); Supabase’e opsiyonel kaydet.

### 4.7 Geçmiş/Günlükler (/history veya /logs)
- Takvim veya liste görünümü; günlere tıklayınca log detayı (puan, tamamlanma saati).
- Filtre: haftalık/aylık; export (JSON) opsiyonu.
- Supabase: `reading_logs` sorgusu; mock modda local storage.

### 4.8 Bilgi/More (/more, /info)
- Statik sayfalar: Hakkında, Destek, Gizlilik/KVKK, SSS.
- Linkler: mobildeki More sekmesindeki tüm linkler web’de de yer alır.

## 5) Bileşen kütüphanesi (mobil → web eşlemesi)
- Card (radius lg, border + soft shadow), Badge, Pill, Progress bar, Tab bar, Toggle, Segmented control, Snackbar/Banner, Modal.
- List item: avatar + başlık + ikincil metin + sağ aksiyon.
- Form bileşenleri: input, select, slider/stepper, file upload.
- Layout: AppShell (header/nav/footer), PageSection (başlık + alt başlık + aksiyon).

## 6) Durum yönetimi ve veri katmanı
- Supabase client/server yardımcıları hazır; `hasSupabaseConfig` ile mock modu belirle.
- API sözleşmesi:
  - GET leaderboard?period=week|month|all
  - PUT /profile (display_name, opt_in, avatar, ülke, dil)
  - POST /reading (date, points, completedAt, sectionIds)
  - GET /stats (aggregated)
- Offline stratejisi: yazma kuyruğu localStorage; bağlantı gelince flush; UI’da “bekleyen x işlem” etiketi.

## 7) Responsive ve erişilebilirlik
- Breakpoint’lere göre nav pozisyonu (alt bar vs sol nav).
- Touch hedefleri ≥44px; klavye erişimi, odak stilleri.
- ARIA: toggles, sliders, file input için etiketler.

## 8) Performans ve SEO
- RSC ile SSR; public sayfalar için meta/OG etiketleri.
- Lazy loading: ağır animasyonlar/Lottie opsiyonel; düşük bant için basit animasyon.
- Revalidate: leaderboard 30–60 sn; public landing ISR.

## 9) Uygulama sırası (yüksek seviye)
1. UI kit + AppShell (header/nav/footer) ve tema değişkenleri.
2. Home + Reading sayfaları (içerik, loglama butonları, offline kuyruğu iskeleti).
3. Ranking (filtreler, mock/supabase bandı, opt-in toggle).
4. Onboarding + Profile + Settings akışları.
5. History/logs sayfası.
6. Statik sayfalar (About/Privacy/Support) ve footer.
7. Supabase entegrasyonu: gerçek sorgular, types, error/loading durumları.
8. Son dokunuşlar: animasyon, A11y, SEO, test.

## 10) Açık kararlar
- Avatar/medya: Supabase Storage mı, Vercel Blob mu? (Tek yerde tutmak için Supabase önerildi).
- Yakınım filtresi: ülke bazlı mı, puan yakınlığı mı? API sözleşmesi netleştirilmeli.
- Dark/sepya temanın web’de default durumu (system öncelikli mi?).***

## 11) Detaylı sayfa tasarımları ve UX akışları (mobil parite)
Bu bölüm her sayfayı mobildeki tasarım hissiyle, web’e uyarlanmış haliyle özetler. Amaç: “aynı uygulama hissi” + okunabilirlik + ileri düzey web davranışları.

### Ana sayfa (/)
- Layout: Geniş hero kartı (accent vurgulu CTA), altında 2 kolon (desktop) / tek kolon (mobil) kart ızgarası. Max width 1200px, yan boşluklar 24–32px.
- Bölümler:
  - Hero: “Bugünkü okuma” CTA, hedef/streak/puan özet rozetleri, Supabase durumu bandı.
  - Haftalık hedef kartı: bar/pill progress, “Bugün tamamlandı” badge, “Hedefi güncelle” linki.
  - “Devam et” kartı: Bugünün bölüm snippet’i (Arapça + çeviri), okuma ekranına yönlendiren büyük buton.
  - “Hızlı aksiyon”lar: Sıralama / Geçmiş / Ayarlar butonları (ikon + etiket).
  - “Teknik durum” bandı: Supabase bağlı/moc; offline kuyruğu sayacı.
- Görsel dil: Mobil kart radius (md/lg), accentSoft arka planlı rozetler, hafif gölge. Hover/active: border-accent + scale 0.99.
- Responsive: 1 kolondan 2 kolona geçiş ≥1024px; alt tab bar mobilde görünür.

### Okuma (/reading, /reading/[day]) — “gelişmiş okuma”
- Layout: Üstte gün seçimi (segment kontrol), altında çift sütun (desktop) / tek sütun (mobil): solda Arapça, sağda transliteration/çeviri; kullanıcı tercihine göre gizle/göster.
- Tipografi: Arapça (19px, line-height 30), Latin (17px, line-height 26); büyük başlıklar 24–28px. Sepya/dark destekli.
- Kontroller: Font boyutu slider (14–22px), satır aralığı, tema (light/dark/sepya), içerik dilleri toggle’ları, “ekran kilidi” (scroll lock), “auto-scroll” hız seçici. Web’de smooth scroll + butonla “satır atla”.
- İlerleme: Sticky alt bar; “Bugünü tamamla” ana CTA (accent), “Tekrar işaretle” uyarı tonu. Tamamlandıktan sonra streak/puan rozetleri animasyonla belirir.
- Loglama: Supabase’a yaz (reading_logs) veya offline kuyruğa push; durum etiketi (“x bekleyen kayıt”). Hata halinde retry butonu.
- Erişilebilirlik: Klavye kısayolları (↑↓ font, T tema), yüksek kontrast; ARIA label’ları.

### Ranking (/ranking)
- Layout: Üstte filtre segmenti (Haftalık / Aylık / Tümü / Yakınım), opt-in toggle, durum bandı (Supabase/mock/stale). Liste kartları tek kolon (mobil) / 2 kolon (desktop grid).
- Liste kartı: sıra numarası, avatar, ad, ülke bayrağı, puan badge (accentSoft), streak badge (card). “Sen” satırı sabitlenir (highlight).
- Banner: “Mock mod / Supabase yok” uyarısı; “Yazma kilitli” alt metni. Son yenileme zamanı + refresh ikonu.
- CTA: “İlerlemeni paylaş” butonu (stats tabanlı mesaj), “Yakınım” için info tooltip (ülke/puan bandı).
- Boş durum: Opt-out ise rehber kart + opt-in CTA.

### Onboarding (/onboarding)
- Adım 1: Dil seçimi (grid butonları, bayrak/dil etiketi).
- Adım 2: Hedef gün/hafta, hatim süresi slider; önizleme texti (“7/hafta → bitiş tarihi”).
- Adım 3: Opt-in toggle + gizlilik açıklaması. Supabase bağlıysa profil create; yoksa local mock (bilinen band).
- Adım 4: Avatar + ülke seçimi (file upload + avatar crop), ülke dropdown.
- Özet: Tercihleri gösteren kart + “Başla” CTA.
- Durum: Supabase banner; bağlantı yoksa “profil local, opt-in pasif”.

### Profil (/profile)
- Alanlar: ad/nickname, ülke, dil, opt_in toggle, hedef gün/hafta, hatim süresi, avatar. Form kartı + “Kaydet” CTA; yükleme durum rozetleri.
- İstatistik: toplam puan, streak, haftalık/aylık puanlar (read-only kart).
- Avatar: upload + progress; Supabase Storage/Blob kararına göre endpoint; hata durumunda uyarı.
- Opt-in: açıklama balonu; toggle değişince kaydet butonu aktif olur.

### Ayarlar (/settings)
- Tema: system/light/dark/sepia seçicisi (segment + canlı önizleme mini-kart).
- Tipografi: font boyutu, satır aralığı, Arapça font seçimi (Noto vs Scheherazade) toggle.
- İçerik: diller (Arapça, TR, EN vb.) çoklu seçim; auto-scroll, haptics/animasyon şiddeti slider (web eşleniği).
- Bildirim: günlük hatırlatma saati; web push ileride. Şimdilik local preference veya Supabase’e yazma opsiyonu.
- Data: “Önbelleği temizle”, “Offline kuyruğunu gönder” butonları.

### Geçmiş/Günlükler (/history veya /logs)
- Takvim veya liste görünümü: takvimde tamamlanmış günler accentSoft halkalı; liste modunda tarih + puan + saat rozetleri.
- Filtre: hafta/ay/tümü; “Export JSON” butonu (Supabase bağlıysa server, yoksa local).
- Gün detayı modal: puan, tamamlanma zamanı, mod (today/makeup), bölüm listesi.
- Offline mod: local storage’dan beslenir; uyarı bandı.

### Diğer/Info (/more)
- Kart ızgarası: Hakkında, Gizlilik/KVKK, Destek, SSS. Hover’da border-accent.
- Erişilebilirlik ve destek linkleri; sosyal/feedback linkleri (opsiyon).

### Global bileşenler
- Card, Badge, Pill, Progress bar, Segmented control, Toggle, Snackbar/Banner, Modal/Drawer.
- Icon set: mobildeki ikonlara denk minimalist line ikonlar; emoji placeholder geçici.
- Animasyon: sayfa giriş fade+slide, CTA hover scale, progress doldurma animasyonu; düşük hareket için “reduce motion” kontrolü.

### Okunabilirlik özel notları
- Arapça ve Latin için yeterli satır yüksekliği (30px/26px), max line width ~72ch; büyük bloklarda 2 sütun ama mobilde tek sütun.
- Sepya modu: arkaplan #f4ecd8, metin #2f2415; link/CTA tonları accent uyumlu.
- Kontrast: minimum AA; accent butonlar beyaz metinle; disabled durumunda opaklık azaltma + kenar çizgisi.
