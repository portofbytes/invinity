import { LegalPage } from "@/components/legal";
import { accessibilityContent } from "@/data/legal";

export const metadata = { title: "Accessibility" };

export default function Page() {
  return <LegalPage {...accessibilityContent} />;
}
