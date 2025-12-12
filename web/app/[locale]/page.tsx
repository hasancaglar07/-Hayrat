import Link from "next/link";
import Script from "next/script";
import { getMessages, type Locale } from "@/i18n/config";
import { Footer } from "@/components/layout/Footer";
import { LandingNav } from "@/components/layout/LandingNav";
import { LiquidHeroWave } from "@/components/layout/LiquidHeroWave";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale);
  const mobileAppUrl = process.env.NEXT_PUBLIC_MOBILE_APP_URL;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: t.brand,
        url: `/${params.locale}`,
        inLanguage: params.locale,
        description: t.landing.seoDescription,
        publisher: {
          "@type": "Organization",
          name: t.brand,
          logo: {
            "@type": "ImageObject",
            url: "/images/logo2.png",
          },
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `/${params.locale}/app?query={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: t.brand,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: t.landing.seoDescription,
      },
      {
        "@type": "FAQPage",
        mainEntity: t.landing.detailedFaqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
      <div className="flex min-h-screen flex-col bg-transparent text-text-dark">
      <Script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <LandingNav locale={params.locale} t={t} />

      <header className="relative overflow-hidden pb-24 pt-10 lg:pb-32 lg:pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_20%,white)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-40 -right-24 h-[640px] w-[640px] rounded-full bg-primary/10 blur-3xl liquid-blob liquid-blob--slow" />
        <div className="pointer-events-none absolute -bottom-48 -left-28 h-[540px] w-[540px] rounded-full bg-primary/5 blur-3xl liquid-blob liquid-blob--fast" />
        <div className="page-section relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
            <Badge className="mb-4 inline-flex items-center gap-2 bg-white/80 px-4 py-1.5 text-primary shadow-soft ring-1 ring-primary/10 backdrop-blur dark:bg-background-offwhite">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              {t.landing.statsTitle}
            </Badge>
            <h1 className="mb-5 text-balance text-3xl font-extrabold leading-[1.06] tracking-tight text-text-dark sm:text-4xl lg:text-5xl xl:text-6xl">
              {(() => {
                const highlight = t.landing.heroHighlight;
                const parts = highlight ? t.landing.heroTitle.split(highlight) : [t.landing.heroTitle];
                if (parts.length === 1) return t.landing.heroTitle;
                const [before, after] = parts;
                return (
                  <>
                    {before}
                    <span className="text-gradient">{highlight}</span>
                    {after}
                  </>
                );
              })()}
            </h1>
            <p className="mb-7 max-w-xl text-base leading-relaxed text-text-medium/90 sm:text-lg">{t.landing.heroDescription}</p>
            <div className="mb-8 flex flex-wrap gap-2">
              {t.landing.features.slice(0, 3).map((feature) => (
                <Badge
                  key={feature.title}
                  className="inline-flex items-center gap-2 bg-white/90 px-4 py-2 text-sm font-semibold text-text-dark shadow-soft ring-1 ring-primary/10 backdrop-blur dark:bg-background-offwhite"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">{feature.icon}</span>
                  {feature.title}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="group h-auto rounded-2xl px-8 py-4 text-base font-semibold shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40 hover:bg-primary-dark"
              >
                <Link href={`/${params.locale}/app`}>
                  {t.landing.ctaOpen}
                  <span className="material-symbols-outlined ml-2 text-[20px] transition-transform group-hover:translate-x-0.5">arrow_forward</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto rounded-2xl border-primary/25 px-8 py-4 text-base font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5 dark:bg-background-offwhite dark:border-primary/40"
              >
                <a href="#features">{t.landing.ctaMore}</a>
              </Button>
            </div>
          </div>

          <div className="relative">
	            <div className="premium-surface relative rounded-3xl p-4 shadow-[0_24px_80px_rgba(0,0,0,0.08)] ring-1 ring-primary/10 md:p-6 animate-in fade-in zoom-in-95 duration-700 motion-reduce:animate-none">
	              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary/10 dark:from-background-dark dark:via-background-dark dark:to-primary/10" />
	              <div className="relative grid gap-4">
	                <div className="relative overflow-hidden rounded-3xl border border-border-light bg-black/5 ring-1 ring-primary/10 dark:bg-white/5">
	                  <video
	                    src="/video-logo.mp4"
	                    autoPlay
	                    preload="metadata"
                    muted
                    loop
                    playsInline
                    className="h-72 w-full object-cover md:h-80 lg:h-96"
                  />
	                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/85 via-white/10 to-transparent dark:from-black/80 dark:via-black/40" />
                  <div className="pointer-events-none absolute -left-16 -top-14 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                  <div className="pointer-events-none absolute -right-16 -bottom-14 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />

	                  <Badge className="absolute left-4 top-4 inline-flex items-center gap-2 bg-white/85 px-3 py-1.5 text-text-dark shadow-soft ring-1 ring-primary/10 backdrop-blur dark:bg-background-offwhite">
	                    <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
	                    {t.weekly.title}
	                  </Badge>
                  <Badge className="absolute right-4 bottom-4 inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 font-bold text-primary shadow-soft ring-1 ring-primary/15 backdrop-blur">
                    <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                    12 {t.weekly.streakLabel.replace("{days}", "").trim()}
                  </Badge>
                </div>
		                  <div className="premium-surface grid gap-3 rounded-2xl p-4 ring-border-light/70">
		                    <div className="flex items-center justify-between">
		                    <div className="text-sm font-semibold text-text-light">{t.landing.demoProgressLabel}</div>
			                    <div className="text-2xl font-extrabold tracking-tight text-text-dark">75%</div>
	                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-background-offwhite">
                    <div className="h-full w-3/4 rounded-full bg-primary" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-text-medium">
                    <span>{t.weekly.progressLabel.replace("{done}", "5").replace("{total}", "7")}</span>
                    <span className="font-semibold text-primary">{t.weekly.viewAll}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-5 -bottom-5 -z-10 h-full w-full rounded-3xl border border-primary/15" />
          </div>
        </div>
        <LiquidHeroWave />
      </header>

      <section className="py-14 sm:py-16">
        <div className="page-section">
          <div className="premium-surface relative grid gap-6 p-6 md:grid-cols-4 md:gap-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/10" />
            <div className="md:col-span-1">
	              <h2 className="relative section-title-sm">{t.landing.statsTitle}</h2>
              <p className="relative mt-2 text-sm text-text-light">{t.landing.statsSubtitle}</p>
            </div>
            <div className="relative md:col-span-3 grid gap-4 sm:grid-cols-3">
              {t.landing.stats.map((stat, index) => (
	                <div
	                  key={stat.label}
                    style={{ animationDelay: `${index * 80}ms` }}
	                  className="premium-card p-6 text-center animate-in fade-in slide-in-from-bottom-3 duration-700 motion-reduce:animate-none"
	                >
		                  <div className="text-3xl font-extrabold tracking-tight text-text-dark">{stat.value}</div>
	                  <div className="mt-1 text-sm font-semibold text-text-medium">{stat.label}</div>
	                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

	      <section className="py-14 sm:py-16" id="features">
	        <div className="page-section">
	          <div className="mx-auto mb-16 max-w-3xl text-center">
	            <h2 className="mb-4 section-title">{t.landing.featuresTitle}</h2>
            <p className="text-base text-text-light">{t.landing.featuresSubtitle}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.landing.features.map((feature, index) => (
	              <div
	                key={feature.title}
                  style={{ animationDelay: `${index * 70}ms` }}
	                className="group premium-card relative p-6 animate-in fade-in slide-in-from-bottom-3 duration-700 motion-reduce:animate-none"
	              >
	                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
	                <div className="mb-4 premium-icon">
	                  <span className="material-symbols-outlined text-[28px]">{feature.icon}</span>
                </div>
                <h3 className="mb-2 section-title-sm">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-text-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landing intentionally keeps above-the-fold short; details live in /app/about and /app/info. */}

      <section className="relative overflow-hidden py-14 sm:py-16">
        <div className="page-section relative z-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="kicker mb-3">{t.nav.benefits}</p>
              <h2 className="mb-4 section-title">{t.landing.benefitsTitle}</h2>
	              <p className="text-base text-text-light">{t.landing.benefitsSubtitle}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
		                {t.landing.benefits.map((benefit, index) => (
		                  <div
                        key={benefit.title}
                        style={{ animationDelay: `${index * 70}ms` }}
                        className="group premium-card p-5 animate-in fade-in slide-in-from-bottom-3 duration-700 motion-reduce:animate-none"
                      >
		                    <div className="mb-3 premium-icon-sm">
		                      <span className="material-symbols-outlined text-[22px]">{benefit.icon}</span>
		                    </div>
	                    <h3 className="section-title-sm">{benefit.title}</h3>
	                    <p className="mt-1 text-sm leading-relaxed text-text-medium">{benefit.description}</p>
	                  </div>
	                ))}
              </div>
              <Link
                href={`/${params.locale}/app/info/benefits`}
                className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-dark"
              >
                {t.nav.benefits}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="relative">
              <div className="premium-surface p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
	                <div className="relative overflow-hidden rounded-3xl border border-border-light/70 bg-white/70 p-6 shadow-soft ring-1 ring-primary/10 dark:bg-card/40">
                  <div className="pointer-events-none absolute -left-16 -top-14 h-48 w-48 rounded-full bg-primary/10 blur-3xl liquid-blob liquid-blob--slow" />
                  <div className="pointer-events-none absolute -right-16 -bottom-14 h-52 w-52 rounded-full bg-primary/10 blur-3xl liquid-blob liquid-blob--fast" />
                  <div className="relative grid gap-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-white/80 text-primary shadow-soft ring-1 ring-primary/10 backdrop-blur dark:bg-background-offwhite">
                        {t.weekly.title}
                      </Badge>
	                      <span className="text-2xl font-extrabold tracking-tight text-text-dark">75%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-background-offwhite">
                      <div className="h-full w-3/4 rounded-full bg-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="premium-card p-4">
                        <div className="text-micro font-semibold text-text-light">{t.landing.demoProgressLabel}</div>
	                        <div className="mt-1 text-base font-bold text-text-dark">5/7</div>
                      </div>
                      <div className="premium-card p-4">
                        <div className="text-micro font-semibold text-text-light">
                          {t.weekly.streakLabel.replace("{days}", "").trim()}
                        </div>
	                        <div className="mt-1 text-base font-bold text-text-dark">12</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {t.landing.features.slice(0, 3).map((feature) => (
                    <div
                      key={feature.title}
                      className="group flex items-start gap-3 rounded-xl border border-border-light/70 bg-secondary/60 p-4 shadow-soft ring-1 ring-primary/5 backdrop-blur-sm transition-colors hover:bg-secondary/80 dark:border-gray-700/70 dark:bg-background-offwhite dark:hover:bg-background-dark"
                    >
                      <div className="premium-icon-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[20px]">{feature.icon}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-text-dark">{feature.title}</div>
                        <div className="text-sm text-text-medium">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute -left-6 -top-6 -z-10 h-full w-full rounded-3xl border border-primary/15" />
            </div>
          </div>
        </div>
      </section>

	      <section className="bg-secondary/50 backdrop-blur-sm py-14 sm:py-16 dark:bg-transparent">
	        <div className="page-section">
	          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-3 section-title">{t.landing.faqPreviewTitle}</h2>
	            <p className="text-base text-text-light">{t.landing.faqPreviewSubtitle}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {t.landing.faqPreviewItems.map((item, index) => (
              <div
                key={item.q}
                style={{ animationDelay: `${index * 70}ms` }}
                className="group premium-card p-6 animate-in fade-in slide-in-from-bottom-3 duration-700 motion-reduce:animate-none"
              >
                <div className="mb-3 premium-icon-sm">
                  <span className="material-symbols-outlined text-[20px]">help</span>
                </div>
                <h3 className="section-title-sm">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-medium">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button
              asChild
              variant="outline"
              className="h-auto rounded-xl border-primary/25 bg-white px-7 py-3.5 text-base font-semibold text-primary shadow-sm hover:bg-primary/5 dark:bg-background-offwhite dark:border-primary/40"
            >
              <Link href={`/${params.locale}/app/info/faq`}>{t.landing.faqPreviewCta}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="page-section">
          <div className="premium-surface grid gap-8 p-8 md:grid-cols-2 md:items-center md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
            <div>
              <h2 className="section-title">{t.landing.supportTitle}</h2>
	              <p className="mt-3 text-base text-text-light">{t.landing.supportSubtitle}</p>
              <div className="mt-6">
                <Button
                  asChild
                  className="h-auto rounded-2xl px-7 py-3.5 text-base font-semibold shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
                >
                  <Link href={`/${params.locale}/app/donate`}>{t.landing.supportCta}</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-border-light/60 bg-secondary/60 p-6 shadow-soft ring-1 ring-primary/5 backdrop-blur-sm dark:border-gray-700/70 dark:bg-background-offwhite">
              <p className="kicker mb-3">{t.landing.trustTitle}</p>
              <ul className="grid gap-3">
                {t.landing.trustPoints.slice(0, 3).map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-[20px] text-primary">verified_user</span>
	                    <span className="text-base text-text-dark">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-14 sm:py-16">
        <div className="page-section relative z-10">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-center text-white shadow-2xl md:p-16">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <h2 className="relative z-10 mb-4 section-title text-white">{t.landing.bannerTitle}</h2>
	            <p className="relative z-10 mx-auto mb-8 max-w-2xl text-base text-primary-light">{t.landing.bannerSubtitle}</p>
            <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                variant="secondary"
                className="h-auto rounded-xl bg-white px-8 py-3 font-bold text-primary shadow-lg transition-colors hover:bg-gray-50"
              >
                <Link href={`/${params.locale}/app`}>{t.landing.bannerPrimary}</Link>
              </Button>
              {mobileAppUrl ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-auto rounded-xl border-white/20 bg-primary-dark/30 px-8 py-3 font-bold text-white backdrop-blur-sm transition-colors hover:bg-primary-dark/50"
                >
                  <a href={mobileAppUrl} target="_blank" rel="noreferrer">
                    {t.landing.bannerSecondary}
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <Footer locale={params.locale} />
    </div>
  );
}
