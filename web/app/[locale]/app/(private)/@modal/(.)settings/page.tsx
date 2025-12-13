import type { Locale } from "@/i18n/config";
import { RouteModal } from "@/components/ui/RouteModal";
import SettingsPage from "../../settings/page";

export default function AppSettingsModalPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { next?: string };
}) {
  return (
    <RouteModal className="max-w-none">
      <SettingsPage params={params} />
    </RouteModal>
  );
}

