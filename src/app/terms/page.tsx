import { LegalPage } from "@/components/legal";
import { termsContent } from "@/data/legal";

export const metadata = { title: "Terms" };

export default function Page() {
  return <LegalPage {...termsContent} />;
}
