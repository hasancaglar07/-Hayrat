# Kullanıcı Odaklı Yayın Öncesi Planı

## Kritik (yayını engeller)
- Puan sömürüsü riski: `src/context/ReadingContext.tsx` ve `src/screens/Reading/ReadingScreen.tsx` tekrar okuma kaydında haftalık/streak bonuslarını yeniden hesaplayıp logu güncelliyor. Aynı gün tekrar tamamlayarak puanı sınırsız artırmak mümkün. Tamamla aksiyonunu idempotent yapın (tamamlanan tarihte yeni puan yazılmasın; bonus sadece ilk seferde eklensin) ve butonu/tostu tamamlandıktan sonra kilitleyin.
- Haftalık bonus yanlış hafta için tetikleniyor: `checkWeeklyCompletion` tamamlanan tarihin haftasını kullanıyor. Geçmiş haftaya kaza okuması yapınca da haftalık bonus ve önizleme çıkıyor, Home’daki bu hafta ilerlemesi ile tutarsız. Haftalık bonusu sadece içinde bulunulan hafta için hesaplayın ya da UI metnini “okunan haftaya” göre güncelleyin.

## Önemli
- Yeni kullanıcı ilk açılışta “kaçan günler” görüyor: `src/utils/missedDays.ts`, `src/screens/Home/HomeScreen.tsx`, `src/screens/Home/MissedDaysScreen.tsx` son 7 günü log olmaksızın “missed” sayıyor. Onboarding tarihi öncesini sayma veya ilk tamamlamaya kadar kaçan gün banner’ını gizleme şartı ekleyin.
- Onboarding niyet kutusu ve “misafir” akışı anlamsız: `src/screens/Onboarding/IntentSetupScreen.tsx` niyet onayı state’i hiçbir yerde kullanılmıyor; `src/screens/Onboarding/WelcomeScreen.tsx` misafir CTA’sı ana CTA ile aynı sayfaya gidiyor. Niyet onayı olmadan devamı engelleyin ya da kaldırın; misafir butonunu gerçekten minimal ayarlarla geçecek şekilde ayrıştırın. Profil kaydı başarısız olursa (AsyncStorage hatası) kullanıcıya bilgi vermeden MainTabs’e geçiliyor, hata durumunu yakalayıp kullanıcıyı uyarın.
- Hedef uyumsuzluğu: Niyet ekranı `khatmDays` seçimini 1–7 ile sınırlar, `src/screens/Ranking/ProfileScreen.tsx` 30 güne kadar izin veriyor. Limitleri ve metinleri hizalayın, aksi halde profil düzenlemede farklı değerler gösteriliyor.
- Global sıralama gerçekte yokmuş gibi: `src/screens/Ranking/RankingScreen.tsx` API adresi yoksa sessizce sahte liderboard gösteriyor ve “Global’e katıl” toggle’ı sadece yerelde kayıt oluyor. Fallback modunda bilgi rozeti gösterin, opt-in butonunu devre dışı bırakın ya da backend çağrısını zorunlu hale getirin.
- Hatırlatıcı izni alınmıyor: Ranking ekranındaki bildirim toggle’ı (`toggleReminder`) izni sormadan `notificationsEnabled` durumunu değiştiriyor; iOS/Android’de sessizce başarısız olabilir. `requestPermission` çağırıp reddi kullanıcıya bildirin.

## UX / İçerik
- Puan kırılımı yerelleşmiyor: `src/screens/Reading/ReadingScreen.tsx` içindeki `pointsBreakdownParts` “bugün/kaza” Türkçe sabitleriyle dönüyor. i18n anahtarlarıyla gösterin.
- Bildirim saatleri için doğrulama yok: `src/screens/More/AppSettingsScreen.tsx` serbest metin alıyor, `src/utils/notifications.ts` hatalı girişte 21:00’a düşüyor ama kullanıcıya söylenmiyor. Saat seçici veya regex doğrulama + hata mesajı ekleyin.
- IBAN kopyalama gerçekten kopyalamıyor: `src/screens/More/DonateScreen.tsx` Share kullanıyor, panoya yazmıyor. `Clipboard.setStringAsync` + kısa başarı tost’u ekleyin.
- SSS boş kalabiliyor: `src/screens/Info/FAQScreen.tsx` cevap default’u boş string; eksik çeviride boş kart çıkıyor. İngilizce/Türkçe fallback gösterin ve çeviri dosyalarındaki eksikleri tamamlayın.
- Ülke seçimi yanılgısı: `src/screens/Ranking/ProfileScreen.tsx` seçili ülke yokken TR’yi aktif gösteriyor. Varsayılanı “seçilmedi” yapın ve kaydetmeden highlight etmeyin.
- Tema tercihi “system” değeri tüm uygulamada ışık olarak kalıyor: `src/components/AppShell.tsx` sadece okuma temasına bakıyor, sistem temasını yansıtmıyor. Sistem temasını dinleyip shell arka planını eşleyin.

## Son kontrol listesi
- [ ] İlk kurulum akışı: Onboarding → Home’da missed banner davranışı → bugün okuması → Missed Days → Reading ayarları modali.
- [ ] Puanlama: Aynı gün tekrar tamamlama denemesiyle puanın sabit kaldığını ve haftalık bonusun sadece ilgili haftada çalıştığını doğrulayın.
- [ ] Global sıralama: API adresi olmayan durumda uyarı/fallback rozeti, opt-in buton durumu ve hatırlatıcı izni akışını manuel test edin.
- [ ] Bağış & hukuk: IBAN kopyalama, online bağış linki fallback uyarısı, gizlilik/şartlar linklerinin açılması.
- [ ] Bildirimler: Günlük ve kaçan gün hatırlatmaları için zaman formatı doğrulaması ve izin reddi senaryolarını test edin.
