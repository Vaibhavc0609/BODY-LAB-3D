/**
 * Continuous scroll choreography keyframes for the Three.js anatomical story stages.
 * Shifts `target.x` negatively so the 3D human specimen stands prominently on the right side
 * while left-aligned editorial blocks scroll cleanly beside it without occlusion.
 */
export const STORY_CHAPTERS = [
  {
    id: "chapter-hero",
    num: "01",
    shortLabel: "Overview",
    eyebrow: "THREE.JS BIOLOGICAL SIMULATION",
    title: "The Human Architecture, Mapped in Real Time",
    description:
      "Explore 884 interconnected anatomical structures rendered directly in WebGL with sex-specific skeletal proportions, regional vasculature, and real-time optical dissection.",
    t: 0.0,
    cameraPos: [-0.55, 0.22, 6.25],
    cameraTarget: [-0.88, 0.06, 0.0],
    explode: 0.0,
    swayAmp: 0.14,
  },
  {
    id: "chapter-layers",
    num: "02",
    shortLabel: "Systems",
    eyebrow: "CHAPTER 02 · STRUCTURAL STRATIFICATION",
    title: "Layered Skeleton, Musculature & Fascia",
    description:
      "Smoothly separate cranial vaults, hyaline costal cartilage, Z-Anatomy muscle groups, and deeper visceral columns along anatomical axes as you scroll.",
    t: 0.24,
    cameraPos: [-2.35, 0.56, 5.45],
    cameraTarget: [-0.84, 0.08, 0.0],
    explode: 0.42,
    swayAmp: 0.08,
  },
  {
    id: "chapter-thorax",
    num: "03",
    shortLabel: "Thorax",
    eyebrow: "CHAPTER 03 · CARDIOPULMONARY CORE",
    title: "Thoracic Chambers & Pulmonary Branching",
    description:
      "Dolly directly into the mediastinum to inspect coronary arteries, tracheal bifurcation, bilateral lung lobes, and diaphragmatic geometry.",
    t: 0.5,
    cameraPos: [1.35, 0.82, 2.75],
    cameraTarget: [-0.42, 0.55, 0.04],
    explode: 0.12,
    swayAmp: 0.06,
  },
  {
    id: "chapter-abdomen",
    num: "04",
    shortLabel: "Abdomen",
    eyebrow: "CHAPTER 04 · VISCERAL & RENAL AXIS",
    title: "Hepatic Lobe, Gastric Curvature & Kidneys",
    description:
      "Sweep around the epigastric and lumbar planes to examine the stomach fundus, biliary tract, folded intestines, and retroperitoneal kidneys.",
    t: 0.74,
    cameraPos: [-1.58, -0.02, 2.85],
    cameraTarget: [-0.46, -0.04, 0.0],
    explode: 0.18,
    swayAmp: 0.06,
  },
  {
    id: "chapter-dimorphism",
    num: "05",
    shortLabel: "Dimorphism",
    eyebrow: "CHAPTER 05 · SEXUAL DIMORPHISM",
    title: "Android Male vs. Gynecoid Female Form",
    description:
      "Compare ribcage taper, cranial jaw contour, subpubic pelvic angles, and reproductive anatomy dynamically rebuilt inside the live 3D rig.",
    t: 1.0,
    cameraPos: [1.45, -0.56, 2.75],
    cameraTarget: [-0.42, -0.56, 0.0],
    explode: 0.05,
    swayAmp: 0.08,
  },
];

function smoothstep(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Evaluates smoothly blended camera position, orbit target, idle sway amplitude,
 * and structural separation progress at normalized story scroll `progress` in [0, 1].
 */
export function evaluateStoryKeyframe(progress) {
  const p = Math.max(0, Math.min(1, progress));
  const len = STORY_CHAPTERS.length;

  let prev = STORY_CHAPTERS[0];
  let next = STORY_CHAPTERS[len - 1];
  for (let i = 0; i < len - 1; i++) {
    if (p >= STORY_CHAPTERS[i].t && p <= STORY_CHAPTERS[i + 1].t) {
      prev = STORY_CHAPTERS[i];
      next = STORY_CHAPTERS[i + 1];
      break;
    }
  }

  const span = next.t - prev.t;
  const localT = span > 0.0001 ? smoothstep((p - prev.t) / span) : 0;

  return {
    pos: [
      lerp(prev.cameraPos[0], next.cameraPos[0], localT),
      lerp(prev.cameraPos[1], next.cameraPos[1], localT),
      lerp(prev.cameraPos[2], next.cameraPos[2], localT),
    ],
    target: [
      lerp(prev.cameraTarget[0], next.cameraTarget[0], localT),
      lerp(prev.cameraTarget[1], next.cameraTarget[1], localT),
      lerp(prev.cameraTarget[2], next.cameraTarget[2], localT),
    ],
    explode: lerp(prev.explode, next.explode, localT),
    swayAmp: lerp(prev.swayAmp, next.swayAmp, localT),
  };
}
