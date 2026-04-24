import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AgeGate } from "@/components/age-gate";
import { Reveal } from "@/components/reveal";
import { CartProvider } from "@/components/cart";
import { CookieBanner } from "@/components/cookie-banner";
import { PageTransition } from "@/components/page-transition";
import { Axe } from "@/components/axe";
import { OceanWaves } from "@/components/ambient";
import { AnnouncementStrip } from "@/components/announcement";
import { notices } from "@/data/notices";
import { site } from "@/data/site";
import { publicEnv } from "@/lib/env";
import { JsonLd, organizationLd, localBusinessLd } from "@/lib/ld";

const displaySerif = Cormorant_Garamond({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const textSans = Inter({
  variable: "--font-text-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: { default: `${site.name} — Sparkling Wine House`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${displaySerif.variable} ${textSans.variable} antialiased h-full`}
    >
      <body className="min-h-full flex flex-col surface-chalk">
        <JsonLd data={[organizationLd(), localBusinessLd()]} />
        <CartProvider>
          <Axe />
          <AgeGate minimumAge={site.legal.minimumAge} />
          <Reveal />
          <AnnouncementStrip {...notices.announcement.current} />
          <Header />
          <main id="main" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <OceanWaves />
          <Footer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
