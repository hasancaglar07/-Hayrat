import { AuthWidget } from "@/components/auth/AuthWidget";
import { getMessages, type Locale } from "@/i18n/config";
import { getCurrentUser } from "@/lib/auth/server";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { redirect } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/auth",
    title: `${t.brand} | ${t.nav.signIn}`,
    description: t.auth.description,
    noindex: true,
  });
}

export default async function AuthPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { next?: string; error?: string };
}) {
  const defaultNext = `/${params.locale}/app`;
  const next =
    typeof searchParams?.next === "string" &&
    searchParams.next.startsWith(`/${params.locale}/`) &&
    !searchParams.next.startsWith("//") &&
    !searchParams.next.includes("://")
      ? searchParams.next
      : defaultNext;

  const user = await getCurrentUser();
  if (user) redirect(next);
  const t = getMessages(params.locale);
  const kicker = params.locale === "tr" ? "Şifresiz giriş" : params.locale === "ar" ? "تسجيل دخول بدون كلمة مرور" : "Passwordless sign-in";
  const trackingKicker =
    params.locale === "tr"
      ? "Takip için giriş yap"
      : params.locale === "ar"
        ? "سجّل الدخول للمتابعة"
        : "Sign in to track";
  const guestReadLabel = params.locale === "tr" ? "Misafir oku" : params.locale === "ar" ? "اقرأ كضيف" : "Read as guest";
  const existingUserHint =
    params.locale === "tr"
      ? "Daha önce üye olduysan da aynı e-postayı yaz. Şifre yok; her girişte mailine bir link gelir."
      : params.locale === "ar"
        ? "إذا كان لديك حساب مسبقًا، أدخل نفس البريد الإلكتروني. لا توجد كلمة مرور — سيتم إرسال رابط تسجيل دخول في كل مرة."
        : "If you already have an account, enter the same email. No password — you’ll get a sign-in link each time.";
  const whyTitle = params.locale === "tr" ? "Neden giriş yapmalıyım?" : params.locale === "ar" ? "لماذا تسجيل الدخول؟" : "Why sign in?";
  const trackingHint =
    params.locale === "tr"
      ? "Takip (puan/streak/eksik günler) için giriş yapmalısın."
      : params.locale === "ar"
        ? "للمتابعة (النقاط/السلسلة/الأيام الفائتة) يجب تسجيل الدخول."
        : "To track (points/streak/missed days), you need to sign in.";
  const benefit1 =
    params.locale === "tr"
      ? "Puan ve streak otomatik hesaplanır."
      : params.locale === "ar"
        ? "سيتم احتساب النقاط والسلسلة تلقائيًا."
        : "Points and streak are tracked automatically.";
  const benefit2 =
    params.locale === "tr"
      ? "Kaçırdığın günleri (kaza) kolayca görürsün."
      : params.locale === "ar"
        ? "سترى الأيام الفائتة (القضاء) بسهولة."
        : "See missed days (make-up) easily.";
  const benefit3 =
    params.locale === "tr"
      ? "İlerleme cihazlar arasında senkron olur."
      : params.locale === "ar"
        ? "ستتم مزامنة التقدم بين الأجهزة."
        : "Progress syncs across devices.";
  const howTitle = params.locale === "tr" ? "Nasıl giriş yapılır?" : params.locale === "ar" ? "كيف يتم تسجيل الدخول؟" : "How it works";
  const step1 =
    params.locale === "tr" ? "E-postanı yaz ve giriş linkini gönder." : params.locale === "ar" ? "اكتب بريدك الإلكتروني وأرسل رابط تسجيل الدخول." : "Enter your email and send the sign-in link.";
  const step2 =
    params.locale === "tr" ? "Mailine gelen linke tıkla (aynı tarayıcıda)." : params.locale === "ar" ? "افتح الرابط من نفس المتصفح." : "Open the link in the same browser.";
  const step3 =
    params.locale === "tr"
      ? `Takip paneline yönlendirilirsin: ${t.nav.missed} · ${t.nav.ranking} · ${t.nav.settings}`
      : params.locale === "ar"
        ? `ستنتقل إلى لوحة المتابعة: ${t.nav.missed} · ${t.nav.ranking} · ${t.nav.settings}`
        : `You’ll be taken to your tracking panel: ${t.nav.missed} · ${t.nav.ranking} · ${t.nav.settings}`;
  const guestReadDesc =
    params.locale === "tr"
      ? "Giriş yapmadan okumaya başlayabilirsin; ancak okuma takibi cihazlar arasında senkron olmaz."
      : params.locale === "ar"
        ? "يمكنك البدء بالقراءة كضيف، لكن التتبع لن يتزامن بين الأجهزة."
        : "You can read as a guest, but progress won’t sync across devices.";
  return (
    <div className="relative min-h-screen overflow-hidden bg-secondary px-4 py-10 text-text-dark sm:px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_16%,white)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-44 -right-24 h-[560px] w-[560px] rounded-full bg-primary/10 blur-3xl liquid-blob liquid-blob--slow" />
      <div className="pointer-events-none absolute -bottom-52 -left-28 h-[520px] w-[520px] rounded-full bg-primary/5 blur-3xl liquid-blob liquid-blob--fast" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="order-2 lg:order-1 space-y-6">
            <Card className="w-full rounded-3xl border-primary/15 bg-primary/5">
              <CardHeader className="space-y-2">
                <h2 className="section-title">{whyTitle}</h2>
                <p className="text-base text-text-medium">{trackingHint}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-base text-text-medium">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-primary ring-1 ring-primary/15">
                      <span className="material-symbols-outlined text-[22px]">local_fire_department</span>
                    </span>
                    <span className="leading-relaxed">{benefit1}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-primary ring-1 ring-primary/15">
                      <span className="material-symbols-outlined text-[22px]">history</span>
                    </span>
                    <span className="leading-relaxed">{benefit2}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-primary ring-1 ring-primary/15">
                      <span className="material-symbols-outlined text-[22px]">sync</span>
                    </span>
                    <span className="leading-relaxed">{benefit3}</span>
                  </li>
                </ul>

                <div className="rounded-3xl border border-border bg-background/70 p-5">
                  <h3 className="text-base font-semibold text-text-dark">{howTitle}</h3>
                  <ol className="mt-3 space-y-3 text-base text-text-medium">
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-sm font-bold text-primary ring-1 ring-primary/15">
                        1
                      </span>
                      <span className="leading-relaxed">{step1}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-sm font-bold text-primary ring-1 ring-primary/15">
                        2
                      </span>
                      <span className="leading-relaxed">{step2}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-sm font-bold text-primary ring-1 ring-primary/15">
                        3
                      </span>
                      <span className="leading-relaxed">{step3}</span>
                    </li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-2">
                <Link
                  className="text-sm font-semibold text-text-medium underline underline-offset-4 hover:text-primary"
                  href={`/${params.locale}/app/legal/privacy-policy`}
                >
                  {t.footer.sections.legal.links.privacy}
                </Link>
                <Link
                  className="text-sm font-semibold text-text-medium underline underline-offset-4 hover:text-primary"
                  href={`/${params.locale}/app/legal/terms-of-use`}
                >
                  {t.footer.sections.legal.links.terms}
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Card className="order-1 lg:order-2 w-full rounded-3xl">
            <CardHeader className="space-y-5">
              <Link href={`/${params.locale}`} className="inline-flex items-center gap-3">
                <Image
                  src="/images/logo2.png"
                  alt={t.brand}
                  width={52}
                  height={52}
                  className="h-12 w-12 rounded-2xl ring-1 ring-primary/20 shadow-glow"
                  priority
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary">{t.brand}</p>
                  <h1 className="page-title">{t.nav.signIn}</h1>
                </div>
              </Link>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/80 text-primary shadow-soft ring-1 ring-primary/10 backdrop-blur dark:bg-background-offwhite">
                  {kicker}
                </Badge>
                <Badge variant="outline" className="bg-white/60 shadow-soft ring-1 ring-primary/10 backdrop-blur dark:bg-background-offwhite">
                  {trackingKicker}
                </Badge>
              </div>

              <p className="text-base leading-relaxed text-text-medium">{t.auth.description}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <AuthWidget
                locale={params.locale}
                redirectTo={next}
                initialError={typeof searchParams?.error === "string" ? searchParams.error : undefined}
              />
              <p className="text-sm text-text-light">{existingUserHint}</p>
            </CardContent>

            <CardFooter className="flex flex-col items-stretch gap-3">
              <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:text-primary">
                <Link href={`/${params.locale}/read`}>{guestReadLabel}</Link>
              </Button>
              <p className="text-sm text-text-medium">{guestReadDesc}</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
