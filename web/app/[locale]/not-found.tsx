import { defaultLocale, getMessages, type Locale } from "@/i18n/config";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound({ params }: { params?: { locale?: Locale } }) {
  const t = getMessages(params?.locale ?? defaultLocale);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-3 text-center sm:px-4">
      <Card className="w-full sm:max-w-xl">
        <CardContent className="p-6 sm:p-10">
          <h1 className="mb-2 section-title font-extrabold text-foreground">{t.common.notFoundTitle}</h1>
          <p className="text-base text-muted-foreground">{t.common.notFoundBody}</p>
        </CardContent>
      </Card>
    </div>
  );
}
