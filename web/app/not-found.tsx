import { cookies } from "next/headers";
import { defaultLocale, getMessages, locales, type Locale } from "@/i18n/config";
import { Card, CardContent } from "@/components/ui/card";

const resolveLocale = (): Locale => {
  const cookieLocale = cookies().get("locale")?.value as Locale | undefined;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;
  return defaultLocale;
};

export default function NotFound() {
  const locale = resolveLocale();
  const t = getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Card className="w-full max-w-xl">
        <CardContent className="p-10">
          <h1 className="mb-2 section-title font-extrabold text-foreground">{t.common.notFoundTitle}</h1>
          <p className="text-base text-muted-foreground">{t.common.notFoundBody}</p>
        </CardContent>
      </Card>
    </div>
  );
}
