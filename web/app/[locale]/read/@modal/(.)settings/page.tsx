import type { Locale } from "@/i18n/config";
import { RouteModal } from "@/components/ui/RouteModal";
import ReadSettingsPage from "../../settings/page";

export default function ReadSettingsModalPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { saved?: string; reset?: string; next?: string };
}) {
  return (
    <RouteModal>
      <ReadSettingsPage params={params} searchParams={searchParams} />
    </RouteModal>
  );
}

