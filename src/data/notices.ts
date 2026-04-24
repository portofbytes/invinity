export const notices = {
  cookie: {
    eyebrow: "A quiet note",
    body:
      "We use a small number of first-party cookies to remember your cart and your age confirmation. We do not use advertising trackers.",
    privacyLinkLabel: "Read the privacy page.",
    cta: "Acknowledged",
  },
  ageGate: {
    headline: "Before you enter the house.",
    body:
      "Please confirm you are of legal drinking age in your region before entering an online house of sparkling wine.",
    acceptLabel: (age: number) => `I am ${age} or older`,
    leaveLabel: "Leave quietly",
    leaveHref: "https://www.google.com/",
  },
  releaseList: {
    eyebrow: "Receive release notes",
    headline: "Join the house list.",
    body:
      "A quiet dispatch, two or three times a year, when a new cuvée is disgorged or a private tasting is offered. No discounts, no noise.",
    successLine: "You are on the release list. We'll be in touch.",
  },
  checkout: {
    handoffMessage: "Checkout handoff would continue to the commerce provider in production.",
  },
  announcement: {
    current: {
      id: "gcbdb-2018-spring-2024",
      message: "Grande Cuvée Blanc de Blancs 2018 · disgorged Spring 2024 · now available",
      href: "/wines/grande-cuvee-brut-blanc-de-blancs-2018",
    },
  },
};
