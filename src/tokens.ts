export const color = {
  chalk: "#F4F0E8",
  paper: "#EAE3D6",
  stone: "#C7C0B4",
  slate: "#4B4B47",
  graphite: "#232320",
  bottle: "#1E2B25",
  bottleDark: "#0E1612",
  bottleLight: "#243B33",
  oxide: "#6A6A60",
  champagne: "#B09A6B",
  champagneDark: "#8A7650",
  roseGlassDark: "#2A1E20",
  roseGlassMid: "#160E10",
  roseGlassLight: "#3A2A2D",
  oceanGlassDark: "#04100C",
  oceanGlassMid: "#163028",
  oceanGlassLight: "#2A4A3E",
  clubGlassDark: "#140709",
  clubGlassMid: "#2A1519",
  clubGlassLight: "#3A1F24",
  clubFoil: "#7C2A2F",
  sparklingGlassDark: "#131612",
  sparklingGlassMid: "#2B2E28",
  sparklingGlassLight: "#343830",
  sparklingFoil: "#8E8876",
  // Paisley textile palette — used by PaisleyFrame decoratives.
  paisleyHighlight: "#F5DA8A",
  paisleyGold: "#E8C56A",
  paisleyGoldMid: "#C99232",
  paisleyGoldDeep: "#8C5C18",
  paisleyHighlightPeach: "#FCEAB0",
  paisleyGround: "#070504",
  paisleyShadow: "#3A2810",
} as const;

export const duration = {
  micro: 180,
  standard: 340,
  cinematic: 780,
} as const;

export const easing = {
  outQuiet: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  inOutQuiet: "cubic-bezier(0.65, 0.05, 0.36, 1)",
  reveal: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const space = {
  s24: 24,
  s40: 40,
  s64: 64,
  s96: 96,
  s144: 144,
  s192: 192,
} as const;

export const layout = {
  container: 1440,
  reading: 720,
  commerce: 560,
} as const;

export type ColorToken = keyof typeof color;
