import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getOrCreateProfile, updateProfile } from "@/lib/data/profile";
import { getCurrentUser } from "@/lib/auth/server";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/app/profile",
    title: `${t.brand} | ${t.nav.profile}`,
    description: t.profile.subtitle,
    noindex: true,
  });
}

export default async function ProfilePage({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale);
  const user = await getCurrentUser();
  if (!user) return null;
  const userId = user.id;
  const profile = await getOrCreateProfile(userId);
  const countries = t.profile.countries as Record<string, string>;
  const countryOptions = [
    { code: "TR", label: "Türkiye" },
    { code: "US", label: "United States" },
    { code: "GB", label: "United Kingdom" },
    { code: "FR", label: "France" },
    { code: "DE", label: "Germany" },
    { code: "CA", label: "Canada" },
    { code: "AU", label: "Australia" },
    { code: "SA", label: "Saudi Arabia" },
    { code: "AE", label: "UAE" },
    { code: "ID", label: "Indonesia" },
    { code: "MY", label: "Malaysia" },
    { code: "PK", label: "Pakistan" },
    { code: "IN", label: "India" },
    { code: "BD", label: "Bangladesh" },
    { code: "NL", label: "Netherlands" },
  ] as const;

  const saveProfile = async (formData: FormData) => {
    "use server";
    const nickname = (formData.get("nickname") as string) || "Reader";
    const country = (formData.get("country") as string) || "TR";
    const target = Number(formData.get("target") ?? 7);
    const khatm = Number(formData.get("khatm") ?? 7);
    const showRanking = formData.get("showRanking") === "on";

    const user = await getCurrentUser();
    if (!user) return;

    await updateProfile(user.id, {
      nickname,
      countryCode: country,
      targetReadingDaysPerWeek: target,
      khatmDurationDays: khatm,
      showInGlobalRanking: showRanking,
    });

    revalidatePath(`/${params.locale}/app/profile`);
    revalidatePath(`/${params.locale}/app/ranking`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-semibold text-primary">{t.profile.title}</p>
          <h1 className="page-title">{t.profile.subtitle}</h1>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <form action={saveProfile} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-dark" htmlFor="email">
                {t.auth.emailPlaceholder}
              </label>
              <Input id="email" value={user.email ?? ""} disabled />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-dark" htmlFor="nickname">
                {t.profile.nickname}
              </label>
              <Input id="nickname" name="nickname" defaultValue={profile.nickname} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-dark" htmlFor="country">
                {t.profile.country}
              </label>
              <select
                id="country"
                name="country"
                defaultValue={profile.countryCode ?? "TR"}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-dark shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background"
              >
                {countryOptions.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {code} · {countries[code] ?? label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-dark" htmlFor="target">
                  {t.profile.targetDays}
                </label>
                <Input
                  id="target"
                  name="target"
                  type="number"
                  min={1}
                  max={7}
                  defaultValue={profile.targetReadingDaysPerWeek}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-dark" htmlFor="khatm">
                  {t.profile.khatmDuration}
                </label>
                <Input
                  id="khatm"
                  name="khatm"
                  type="number"
                  min={1}
                  max={30}
                  defaultValue={profile.khatmDurationDays}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-semibold text-text-dark shadow-sm dark:bg-background-offwhite">
              <input
                type="checkbox"
                name="showRanking"
                defaultChecked={profile.showInGlobalRanking}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
              {t.profile.showRanking}
            </label>

            <SubmitButton label={t.profile.save} loadingLabel={t.common.saving} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
