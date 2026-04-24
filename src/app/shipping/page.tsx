import { LegalPage } from "@/components/legal";
import { shippingContent } from "@/data/legal";

export const metadata = { title: "Shipping & Pickup" };

export default function Page() {
  return <LegalPage {...shippingContent} />;
}
