import type { Locale } from "@/i18n/config";
import { RouteModal } from "@/components/ui/RouteModal";
import SettingsPage from "../../settings/page";

export default function AppSettingsModalPage(props: {
  params: { locale: Locale };
  searchParams?: { next?: string };
}) {
  const { params } = props;

  return (
    <RouteModal contentClassName="max-w-4xl">
      <SettingsPage params={params} searchParams={props.searchParams} />
    </RouteModal>
  );
}
