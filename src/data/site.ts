export const site = {
  name: "Invinity",
  longName: "Invinity Sparkling House",
  tagline: "A sparkling house on the edge of the Pacific.",
  description:
    "A small, family-run sparkling house on Vancouver Island. Traditional method, naturally made, in micro-production.",
  address: {
    line1: "10755 Madrona Drive",
    city: "North Saanich",
    region: "British Columbia",
    country: "Canada",
  },
  email: "sparks@invinity.ca",
  phone: "250-532-0123",
  instagram: "https://instagram.com/invinitysparklingwinehouse",
  facebook: "https://facebook.com/InvinitySparklingWineHouse",
  owners: "Kaine and Sarah Sparks",
  legal: {
    minimumAge: 19,
  },
} as const;

export const nav = {
  primary: [
    { href: "/house", label: "House" },
    { href: "/wines", label: "Wines" },
    { href: "/club", label: "Club" },
    { href: "/experiences", label: "Experiences" },
    { href: "/contact", label: "Contact" },
  ],
  secondary: [
    { href: "/journal", label: "Journal" },
    { href: "/faq", label: "Frequently Asked" },
    { href: "/shipping", label: "Shipping & Pickup" },
    { href: "/accessibility", label: "Accessibility" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
} as const;
