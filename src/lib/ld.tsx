import { publicEnv } from "./env";
import { site } from "@/data/site";

type Json = Record<string, unknown>;

export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const BASE = publicEnv.NEXT_PUBLIC_SITE_URL;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}#organization`,
    name: site.longName,
    url: BASE,
    logo: `${BASE}/opengraph-image`,
    email: site.email,
    telephone: site.phone,
    sameAs: [site.instagram].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
  };
}

export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Winery",
    "@id": `${BASE}#winery`,
    name: site.longName,
    url: BASE,
    email: site.email,
    telephone: site.phone,
    image: `${BASE}/opengraph-image`,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "British Columbia" },
      { "@type": "AdministrativeArea", name: "Alberta" },
    ],
  };
}

export function breadcrumbLd(trail: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.label,
      item: `${BASE}${t.href}`,
    })),
  };
}

export function productLd(wine: {
  slug: string;
  name: string;
  cuveeLabel?: string;
  descriptor: string;
  price: number;
  status: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE}/wines/${wine.slug}`,
    name: `${wine.name}${wine.cuveeLabel ? ` — ${wine.cuveeLabel}` : ""}`,
    description: wine.descriptor,
    sku: wine.slug,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url: `${BASE}/wines/${wine.slug}`,
      price: wine.price,
      priceCurrency: publicEnv.NEXT_PUBLIC_CURRENCY,
      availability:
        wine.status === "available" || wine.status === "limited"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}

export function eventLd(ex: {
  slug: string;
  title: string;
  description: string;
  priceLine: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ex.title,
    description: ex.description,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: site.longName,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.line1,
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
    },
    organizer: { "@type": "Organization", name: site.longName, url: BASE },
    url: `${BASE}/experiences/${ex.slug}`,
    offers: {
      "@type": "Offer",
      description: ex.priceLine,
      availability: "https://schema.org/LimitedAvailability",
    },
  };
}

export function articleLd(a: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    author: a.author ? { "@type": "Person", name: a.author } : undefined,
    publisher: { "@type": "Organization", name: site.longName, url: BASE },
    url: `${BASE}/journal/${a.slug}`,
    image: `${BASE}/opengraph-image`,
  };
}
