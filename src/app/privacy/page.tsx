import { LegalPage } from "@/components/legal";
import { privacyContent } from "@/data/legal";

export const metadata = { title: "Privacy" };

export default function Page() {
  return <LegalPage {...privacyContent} />;
}
