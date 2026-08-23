export type SceneId =
  | "hq"
  | "lobby"
  | "data"
  | "software"
  | "security"
  | "ai"
  | "district"
  | "globe"
  | "contact";

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
}

export const SCENE_CAMERAS: Record<SceneId, CameraState> = {
  hq:       { position: [0, 10, 44],    target: [0, 6, 0] },
  lobby:    { position: [0, 5, 10],     target: [0, 4, 0] },
  data:     { position: [-200, 12, 32], target: [-200, 6, 0] },
  software: { position: [200, 12, 32],  target: [200, 6, 0] },
  security: { position: [0, 12, -168],  target: [0, 6, -200] },
  ai:       { position: [-400, 14, 32], target: [-400, 7, 0] },
  district: { position: [400, 55, 65],  target: [400, 0, 0] },
  globe:    { position: [0, 0, -370],   target: [0, 0, -400] },
  contact:  { position: [0, 7, 232],    target: [0, 4, 200] },
};

export const SCENE_LABELS: Record<SceneId, string> = {
  hq:       "FERRIVOX",
  lobby:    "OUR SERVICES",
  data:     "DATA & ANALYTICS",
  software: "SOFTWARE ENGINEERING",
  security: "CYBERSECURITY",
  ai:       "AI & AUTOMATION",
  district: "PORTFOLIO",
  globe:    "GLOBAL REACH",
  contact:  "CONTACT US",
};

export const SCENE_DESCRIPTIONS: Record<SceneId, string> = {
  hq:       "Building the future of technology from Africa",
  lobby:    "Explore our capabilities",
  data:     "Transform raw data into actionable intelligence",
  software: "Custom platforms, APIs, and enterprise systems",
  security: "Protect, detect, and respond to threats",
  ai:       "Intelligent automation and machine learning solutions",
  district: "Our products and case studies",
  globe:    "Serving clients worldwide from our base in Kigali",
  contact:  "Let's build something great together",
};
