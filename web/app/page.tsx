import LandingPage from "./[locale]/page";
import { defaultLocale } from "@/i18n/config";

export default function Home() {
  return <LandingPage params={{ locale: defaultLocale }} />;
}
