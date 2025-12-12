import Link from "next/link";
import Image from "next/image";
import { getMessages, type Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { FooterAuthActions } from "@/components/layout/FooterAuthActions";

export function Footer({ locale, variant = "default" }: { locale: Locale; variant?: "default" | "guest" }) {
  const t = getMessages(locale);
  const year = new Date().getFullYear();
  const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL;
  const mobileAppUrl = process.env.NEXT_PUBLIC_MOBILE_APP_URL;
  const mobileLabel = locale === "tr" ? "Mobil Uygulama" : locale === "ar" ? "تطبيق الجوال" : "Mobile App";
  const guestReadLabel = locale === "tr" ? "Misafir oku" : locale === "ar" ? "اقرأ كضيف" : "Read as guest";

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="page-section py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-5 lg:col-span-5">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <Image
                src="/images/logo2.png"
                alt={t.brand}
                width={52}
                height={52}
                className="h-[52px] w-[52px] rounded-2xl ring-1 ring-primary/20 shadow-glow"
              />
              <span className="logo-text">{t.brand}</span>
            </Link>

            <p className="text-base text-text-medium">{t.footer.tagline}</p>
            <p className="text-base leading-relaxed text-text-light">{t.footer.seoBlurb}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href={`/${locale}/app/info/what-is`}
                className="rounded-full bg-primary/10 px-3 py-1 text-micro font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                {t.footer.sections.info.links.whatIs}
              </Link>
              <Link
                href={`/${locale}/app/info/virtues`}
                className="rounded-full bg-primary/10 px-3 py-1 text-micro font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                {t.footer.sections.info.links.virtues}
              </Link>
              <Link
                href={`/${locale}/app/info/benefits-of-reading`}
                className="rounded-full bg-primary/10 px-3 py-1 text-micro font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                {t.footer.sections.info.links.readingBenefits}
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              <FooterAuthActions
                locale={locale}
                openLabel={t.footer.sections.app.links.app}
                signInLabel={t.nav.signIn}
                signOutLabel={t.nav.signOut}
                profileLabel={t.nav.profile}
                guestReadLabel={guestReadLabel}
              />
              {donateUrl ? (
                <Button asChild size="sm" variant="outline" className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10">
                  <a href={donateUrl} target="_blank" rel="noreferrer">
                    {t.nav.donate}
                  </a>
                </Button>
              ) : null}
              {mobileAppUrl ? (
                <Button asChild size="sm" variant="outline" className="border-border text-foreground hover:text-primary">
                  <a href={mobileAppUrl} target="_blank" rel="noreferrer">
                    {mobileLabel}
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            <div className="space-y-3 text-sm">
              <h4 className="font-semibold text-text-dark">{t.footer.sections.app.title}</h4>
              <div className="flex flex-col gap-2 text-text-light">
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/about`}>
                  {t.footer.sections.app.links.about}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/info/benefits`}>
                  {t.footer.sections.app.links.benefits}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/info/faq`}>
                  {t.footer.sections.app.links.faq}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/donate`}>
                  {t.footer.sections.app.links.donate}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app`}>
                  {t.footer.sections.app.links.app}
                </Link>
                {variant !== "guest" ? (
                  <>
                    <Link className="transition-colors hover:text-primary" href={`/${locale}/app/missed`}>
                      {t.footer.sections.app.links.missed}
                    </Link>
                    <Link className="transition-colors hover:text-primary" href={`/${locale}/app/ranking`}>
                      {t.footer.sections.app.links.ranking}
                    </Link>
                  </>
                ) : null}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <h4 className="font-semibold text-text-dark">{t.footer.sections.info.title}</h4>
              <div className="flex flex-col gap-2 text-text-light">
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/info/what-is`}>
                  {t.footer.sections.info.links.whatIs}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/info/virtues`}>
                  {t.footer.sections.info.links.virtues}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/info/benefits-of-reading`}>
                  {t.footer.sections.info.links.readingBenefits}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/info/etiquette`}>
                  {t.footer.sections.info.links.etiquette}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/info/weekly-plan`}>
                  {t.footer.sections.info.links.weeklyPlan}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/info/author-history`}>
                  {t.footer.sections.info.links.authorHistory}
                </Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <h4 className="font-semibold text-text-dark">{t.footer.sections.legal.title}</h4>
              <div className="flex flex-col gap-2 text-text-light">
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/legal/privacy-policy`}>
                  {t.footer.sections.legal.links.privacy}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/legal/terms-of-use`}>
                  {t.footer.sections.legal.links.terms}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/legal/cookie-policy`}>
                  {t.footer.sections.legal.links.cookies}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/legal/data-protection`}>
                  {t.footer.sections.legal.links.dataProtection}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/legal/disclaimer`}>
                  {t.footer.sections.legal.links.disclaimer}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/legal/accessibility`}>
                  {t.footer.sections.legal.links.accessibility}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/legal/security`}>
                  {t.footer.sections.legal.links.security}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/legal/copyright`}>
                  {t.footer.sections.legal.links.copyright}
                </Link>
                <Link className="transition-colors hover:text-primary" href={`/${locale}/app/legal/contact`}>
                  {t.footer.sections.legal.links.contact}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-micro text-text-light md:flex-row">
          <span>
            © {year} {t.brand}. {t.footer.bottom.rights}
          </span>
          <span className="text-center">{t.footer.bottom.description}</span>
        </div>
      </div>
    </footer>
  );
}
