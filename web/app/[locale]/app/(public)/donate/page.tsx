import { permanentRedirect } from "next/navigation";

const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL || "https://verenel.org/tr/gazzeye-verenel-ol";

export default function DonatePage() {
  permanentRedirect(DONATE_URL);
}
