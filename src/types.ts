export type SceneId = "hq" | "lobby" | "data" | "software" | "security" | "ai" | "district" | "globe" | "contact"

/**
 * Canonical visit order for the 3D tour — drives arrow-key navigation,
 * the dot rail, and any "next/previous" affordances.
 */
export const SCENE_ORDER: SceneId[] = [
  "hq",

  "lobby",

  "data",

  "ai",

  "software",

  "security",

  "district",

  "globe",

  "contact",
]

/** Camera tween duration in ms — CameraRig and the progress bar share this. */
export const SCENE_TRANSITION_MS = 2800

export interface CameraState {
  position: [number, number, number]

  target: [number, number, number]
}

export const SCENE_CAMERAS: Record<SceneId, CameraState> = {
  hq: { position: [0, 10, 44], target: [0, 6, 0] },

  lobby: { position: [0, 5, 10], target: [0, 4, 0] },

  data: { position: [-200, 12, 32], target: [-200, 6, 0] },

  software: { position: [200, 12, 32], target: [200, 6, 0] },

  security: { position: [0, 12, -168], target: [0, 6, -200] },

  ai: { position: [-400, 14, 32], target: [-400, 7, 0] },

  district: { position: [400, 55, 65], target: [400, 0, 0] },

  globe: { position: [0, 0, -370], target: [0, 0, -400] },

  contact: { position: [0, 7, 232], target: [0, 4, 200] },
}

export const SCENE_LABELS: Record<SceneId, string> = {
  hq: "FERRIVOX",

  lobby: "TECHNOLOGY",

  data: "01 — FERRIVOX DATA",

  software: "03 — FERRIVOX ENGINEERING",

  security: "04 — FERRIVOX SECURITY",

  ai: "02 — FERRIVOX INTELLIGENCE",

  district: "PROJECT DISTRICT",

  globe: "COMPANY",

  contact: "START A PROJECT",
}

export const SCENE_DESCRIPTIONS: Record<SceneId, string> = {
  hq: "We Build What Powers Tomorrow.",

  lobby: "Four engineering divisions. One company.",

  data: "From raw data to AI-ready datasets",

  software: "Platforms, APIs, and enterprise systems",

  security: "Protect, detect, and respond",

  ai: "From prepared data to intelligent systems",

  district: "The products we build",

  globe: "An engineering company, built from Africa",

  contact: "Have something difficult to build?",
}

/* ── The 4 divisions ─────────────────────────────── */

export interface Division {
  id: SceneId

  index: string

  name: string

  tagline: string

  description: string

  services: string[]
}

export const DIVISIONS: Division[] = [
  {
    id: "data",

    index: "01",

    name: "Ferrivox Data",

    tagline: "Data, prepared for intelligence",

    description:
      "We collect, structure, clean, annotate, and validate the datasets that modern AI depends on.",

    services: [
      "Data collection",

      "Image & video annotation",

      "Audio transcription",

      "Text datasets",

      "Data cleaning & validation",

      "Synthetic data",

      "Dataset preparation",

      "Quality analysis",
    ],
  },

  {
    id: "ai",

    index: "02",

    name: "Ferrivox Intelligence",

    tagline: "From prepared data to intelligent systems",

    description:
      "We turn prepared data into working intelligence — assistants, agents, vision, and prediction systems.",

    services: [
      "AI assistants",

      "RAG systems",

      "Computer vision",

      "NLP",

      "AI agents",

      "Recommendation systems",

      "Prediction systems",

      "Model evaluation",
    ],
  },

  {
    id: "software",

    index: "03",

    name: "Ferrivox Engineering",

    tagline: "We don't just use technology. We build it.",

    description:
      "Custom platforms, applications, and the systems that run businesses — engineered end to end.",

    services: [
      "Web applications",

      "Mobile applications",

      "Enterprise systems",

      "APIs & SaaS",

      "Dashboards",

      "Payment systems",

      "Business automation",

      "Cloud infrastructure",
    ],
  },

  {
    id: "security",

    index: "04",

    name: "Ferrivox Security",

    tagline: "Security engineered in, not bolted on",

    description:
      "Secure architecture, assessment, and monitoring for systems where data protection is not optional.",

    services: [
      "Security architecture",

      "Vulnerability assessment",

      "Secure software development",

      "Infrastructure security",

      "Identity & access",

      "Application security",

      "Security monitoring",

      "Security awareness",
    ],
  },
]

/* ── Built-with stack ────────────────────────────── */

export const TECH_STACK = [
  "React",

  "TypeScript",

  "Node.js",

  "Python",

  "Three.js",

  "PostgreSQL",

  "Supabase",

  "Docker",

  "Cloud Infrastructure",

  "AI Models",

  "APIs",
]

/* ── Proof metrics (homepage ticker) ─────────────── */

export const METRICS = [
  { value: "2.4M+", label: "records processed" },

  { value: "98.7%", label: "annotation QA accuracy" },

  { value: "50+", label: "projects delivered" },

  { value: "12+", label: "countries served" },
]

/* ── Project District ────────────────────────────── */

export interface Project {
  id: string

  name: string

  subtitle: string

  description: string

  tags: string[]

  status: "LIVE" | "IN DEVELOPMENT" | "PLANNED"
}

export const PROJECTS: Project[] = [
  {
    id: "ishami",

    name: "ISHAMI",

    subtitle: "Rwanda Traffic Intelligence",

    description:
      "Rwanda traffic-rules learning and driving-test preparation platform. Interactive learning powered by AI and 3D simulation.",

    tags: ["3D Simulation", "Traffic Education", "AI", "Interactive Learning"],

    status: "LIVE",
  },

  {
    id: "genda",

    name: "GENDA",

    subtitle: "Ride-Sharing Platform",

    description:
      "Long-distance driver-to-passenger transportation and ride-sharing concept connecting people traveling between Kigali and other parts of Rwanda.",

    tags: ["Transportation", "Ride-Sharing", "Mobility"],

    status: "IN DEVELOPMENT",
  },

  {
    id: "ikibina",

    name: "IKIBINA",

    subtitle: "Digital Platform",

    description:
      "A digital product in the Ferrivox ecosystem — built to solve practical problems with modern technology.",

    tags: ["Digital Platform", "Product"],

    status: "IN DEVELOPMENT",
  },

  {
    id: "ifaranga",

    name: "IFARANGA",

    subtitle: "Financial Technology",

    description:
      "A financial and digital technology project in the Ferrivox ecosystem — engineered for real-world impact.",

    tags: ["FinTech", "Digital Finance"],

    status: "IN DEVELOPMENT",
  },
]
