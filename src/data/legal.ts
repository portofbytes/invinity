import { site } from "./site";

export const legalUpdated = "April 2026";

export const privacyContent = {
  title: "Privacy",
  updated: legalUpdated,
  sections: [
    {
      heading: "What we collect",
      body: [
        "Only what we need to ship your wine and write to you — name, address, email, and a phone number if you provide one. Payment is handled by our commerce platform and never stored on our servers.",
      ],
    },
    {
      heading: "How we use it",
      body: [
        "To fulfill your order, to send requested release notes, and to reply to your correspondence. We do not sell your information, and we do not share it with marketing third parties.",
      ],
    },
    {
      heading: "Your control",
      body: [
        `Write to ${site.email} to review, correct, or delete your information at any time. You may unsubscribe from release notes from any email we send.`,
      ],
    },
  ],
};

export const termsContent = {
  title: "Terms",
  updated: legalUpdated,
  sections: [
    { heading: "Ordering", body: ["By placing an order you confirm that you are of legal drinking age in your region. We may refuse or cancel any order at our discretion, with a full refund."] },
    { heading: "Shipping", body: ["We ship within British Columbia and Alberta. Delivery times depend on courier; please allow up to ten business days."] },
    { heading: "Returns", body: [`Corked or faulty bottles will be replaced. Write to ${site.email} within seven days of delivery.`] },
    { heading: "Liability", body: ["The house is liable only for the value of the wine purchased. Please drink responsibly."] },
  ],
};

export const shippingContent = {
  title: "Shipping & Pickup",
  updated: legalUpdated,
  sections: [
    { heading: "Pickup at the estate", body: ["Complimentary. Choose pickup at checkout; the house will confirm a window by email within one business day."] },
    { heading: "Greater Victoria", body: ["Complimentary delivery on orders of one bottle or more. Delivery is arranged personally."] },
    { heading: "British Columbia", body: ["$30 flat-rate shipping on orders of six bottles or more. Courier will ask for an adult signature at delivery."] },
    { heading: "Alberta", body: ["$30 flat-rate shipping on orders of twelve bottles or more, as permitted by federal interprovincial rules."] },
    { heading: "Elsewhere", body: ["Other provinces are served as federal rules allow. Write to the house if you are not sure."] },
  ],
};

export const accessibilityContent = {
  title: "Accessibility",
  updated: legalUpdated,
  sections: [
    { heading: "Our commitment", body: ["We build this site to WCAG 2.2 AA as a baseline. We aim for keyboard-complete navigation, visible focus, sensible heading structure, reduced-motion handling, and proper form labeling."] },
    { heading: "Tell us where we fall short", body: [`If anything on this site is difficult for you to use, please write to ${site.email}. We will respond and, where possible, correct the issue promptly.`] },
    { heading: "Reduced motion", body: ["If your operating system requests reduced motion, we honour it — reveal animations are disabled, transitions are shortened, and no page is conditional on movement."] },
  ],
};
