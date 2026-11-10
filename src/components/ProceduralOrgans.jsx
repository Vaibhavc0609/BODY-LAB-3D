import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * Generates an anatomically contoured organic mesh array from parametric definitions.
 * Supports:
 * - Multi-part explosion / dismantle separation (`explosionProgress`, `dismantleMode`)
 * - CT/MRI clipping planes (`clippingPlanes`)
 * - Sub-part raycast click selection (`selectedPart`)
 * - Spotlight visual modes (`spotlightMode`)
 */

function createCurvedTubePart({
  name,
  displayName,
  points,
  radiusFn,
  tubularSegments = 48,
  radialSegments = 20,
  color,
  roughness = 0.36,
  metalness = 0.04,
  clearcoat = 0.45,
  explodeVec = [0, 0, 0],
  capEnds = true,
}) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const geom = new THREE.BufferGeometry();

  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const center = curve.getPointAt(t);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const radius = Math.max(0.004, radiusFn(t));

    for (let j = 0; j <= radialSegments; j++) {
      const u = (j / radialSegments) * Math.PI * 2;
      const sin = Math.sin(u);
      const cos = -Math.cos(u);

      // Organic micro-asymmetry / subtle mucosal contour
      const organicRipple = 1 + 0.03 * Math.sin(u * 4 + t * Math.PI * 6);
      const r = radius * organicRipple;

      const nx = cos * N.x + sin * B.x;
      const ny = cos * N.y + sin * B.y;
      const nz = cos * N.z + sin * B.z;

      positions.push(center.x + r * nx, center.y + r * ny, center.z + r * nz);
      normals.push(nx, ny, nz);
      uvs.push(j / radialSegments, t);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = (i + 1) * (radialSegments + 1) + j;
      const c = (i + 1) * (radialSegments + 1) + (j + 1);
      const d = i * (radialSegments + 1) + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  if (capEnds) {
    // Start cap
    const p0 = curve.getPointAt(0);
    const startIdx = positions.length / 3;
    const t0 = frames.tangents[0];
    positions.push(p0.x, p0.y, p0.z);
    normals.push(-t0.x, -t0.y, -t0.z);
    uvs.push(0.5, 0);
    for (let j = 0; j < radialSegments; j++) {
      indices.push(startIdx, j + 1, j);
    }
    // End cap
    const p1 = curve.getPointAt(1);
    const endCenterIdx = positions.length / 3;
    const t1 = frames.tangents[tubularSegments];
    const lastRingStart = tubularSegments * (radialSegments + 1);
    positions.push(p1.x, p1.y, p1.z);
    normals.push(t1.x, t1.y, t1.z);
    uvs.push(0.5, 1);
    for (let j = 0; j < radialSegments; j++) {
      indices.push(endCenterIdx, lastRingStart + j, lastRingStart + j + 1);
    }
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return {
    name,
    displayName,
    geometry: geom,
    color,
    roughness,
    metalness,
    clearcoat,
    position: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    explodeVec,
  };
}

function createSculptedSpherePart({
  name,
  displayName,
  radius = 0.3,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  roughness = 0.35,
  metalness = 0.05,
  clearcoat = 0.45,
  explodeVec = [0, 0, 0],
  segments = 32,
}) {
  const geom = new THREE.SphereGeometry(radius, segments, segments);
  // Subtle organic irregularity on vertices
  const posAttr = geom.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i);
    const vz = posAttr.getZ(i);
    const noise = 1 + 0.025 * Math.sin(vx * 9 + vy * 7) * Math.cos(vz * 8);
    posAttr.setXYZ(i, vx * noise, vy * noise, vz * noise);
  }
  geom.computeVertexNormals();

  return {
    name,
    displayName,
    geometry: geom,
    color,
    roughness,
    metalness,
    clearcoat,
    position,
    scale,
    rotation,
    explodeVec,
  };
}

/**
 * Builds distinct anatomical 3D structures keyed by `proceduralType`.
 */
function buildProceduralParts(type) {
  switch (type) {
    case "stomach": {
      return [
        createCurvedTubePart({
          name: "Stomach_Abdominal_Esophagus_Cardia",
          displayName: "Esophagogastric Cardia",
          points: [
            [-0.22, 1.05, -0.04],
            [-0.20, 0.78, -0.02],
            [-0.18, 0.56, 0.02],
          ],
          radiusFn: (t) => 0.14 + t * 0.04,
          color: "#d98284",
          explodeVec: [-0.25, 0.65, 0],
        }),
        createSculptedSpherePart({
          name: "Stomach_Gastric_Fundus",
          displayName: "Gastric Fundus (Dome)",
          radius: 0.34,
          position: [-0.42, 0.58, -0.04],
          scale: [1.1, 1.15, 0.92],
          color: "#cb6a6e",
          explodeVec: [-0.75, 0.55, 0.1],
        }),
        createCurvedTubePart({
          name: "Stomach_Corpus_Greater_Curvature",
          displayName: "Gastric Body & Rugae (Corpus)",
          points: [
            [-0.38, 0.54, -0.02],
            [-0.46, 0.16, 0.05],
            [-0.36, -0.28, 0.08],
            [-0.08, -0.58, 0.08],
            [0.24, -0.56, 0.05],
          ],
          radiusFn: (t) => {
            // Widest through body/corpus, tapering smoothly toward pyloric antrum
            const bell = Math.sin(t * Math.PI);
            return 0.23 + 0.19 * bell - 0.08 * t;
          },
          tubularSegments: 64,
          radialSegments: 28,
          color: "#c86266",
          explodeVec: [0, 0, 0.25],
        }),
        createCurvedTubePart({
          name: "Stomach_Pyloric_Antrum_Sphincter",
          displayName: "Pyloric Antrum & Sphincter",
          points: [
            [0.18, -0.56, 0.05],
            [0.44, -0.46, 0.02],
            [0.64, -0.32, -0.02],
          ],
          radiusFn: (t) => 0.22 - 0.1 * t,
          color: "#cf7478",
          explodeVec: [0.65, -0.35, 0],
        }),
        createCurvedTubePart({
          name: "Stomach_Duodenal_Bulb",
          displayName: "Superior Duodenum (Cap)",
          points: [
            [0.62, -0.33, -0.02],
            [0.78, -0.28, -0.08],
            [0.82, -0.58, -0.14],
          ],
          radiusFn: () => 0.13,
          color: "#daa096",
          explodeVec: [0.95, -0.45, -0.1],
        }),
      ];
    }

    case "gallbladder": {
      return [
        createCurvedTubePart({
          name: "Gallbladder_Pear_Pouch",
          displayName: "Gallbladder Fundus & Body",
          points: [
            [-0.38, -0.52, 0.28],
            [-0.18, -0.24, 0.18],
            [0.02, 0.04, 0.08],
            [0.18, 0.26, 0.0],
          ],
          radiusFn: (t) => 0.32 * Math.sin((1 - t * 0.72) * Math.PI * 0.52) + 0.06,
          tubularSegments: 44,
          color: "#2b7a58",
          roughness: 0.28,
          clearcoat: 0.65,
          explodeVec: [-0.55, -0.45, 0.25],
        }),
        createCurvedTubePart({
          name: "Gallbladder_Cystic_Duct",
          displayName: "Cystic Duct (Spiral Valves)",
          points: [
            [0.16, 0.25, 0.0],
            [0.26, 0.36, -0.02],
            [0.34, 0.44, -0.05],
          ],
          radiusFn: (t) => 0.065 + 0.015 * Math.sin(t * Math.PI * 10),
          color: "#3f9c6d",
          explodeVec: [0.25, 0.35, 0],
        }),
        createCurvedTubePart({
          name: "Gallbladder_Hepatic_Ducts",
          displayName: "Left & Right Hepatic Ducts",
          points: [
            [0.12, 0.85, -0.08],
            [0.34, 0.56, -0.06],
            [0.34, 0.44, -0.05],
          ],
          radiusFn: () => 0.055,
          color: "#47a877",
          explodeVec: [0.15, 0.65, 0],
        }),
        createCurvedTubePart({
          name: "Gallbladder_Common_Bile_Duct",
          displayName: "Common Bile Duct (Choledochus)",
          points: [
            [0.34, 0.46, -0.05],
            [0.36, 0.08, -0.06],
            [0.32, -0.36, -0.08],
            [0.24, -0.68, -0.06],
          ],
          radiusFn: (t) => 0.068 - t * 0.012,
          color: "#358d64",
          explodeVec: [0.65, -0.25, 0],
        }),
      ];
    }

    case "esophagus":
    case "pharynx": {
      return [
        createCurvedTubePart({
          name: "Pharynx_Naso_Oro_Laryngopharynx",
          displayName: "Pharyngeal Muscular Tube",
          points: [
            [0, 1.05, 0.06],
            [0, 0.82, 0.02],
            [0, 0.58, 0.0],
          ],
          radiusFn: (t) => 0.24 - 0.08 * t,
          color: "#d4797b",
          explodeVec: [0, 0.6, 0],
        }),
        createCurvedTubePart({
          name: "Esophagus_Thoracic_Muscularis",
          displayName: "Thoracic Esophagus",
          points: [
            [0, 0.58, 0.0],
            [-0.02, 0.22, -0.03],
            [0.03, -0.18, -0.04],
            [-0.04, -0.58, 0.01],
          ],
          radiusFn: (t) => 0.13 + 0.015 * Math.sin(t * Math.PI * 5),
          color: "#c6696b",
          explodeVec: [0, 0, 0.2],
        }),
        createCurvedTubePart({
          name: "Esophagus_LES_Gastric_Junction",
          displayName: "Lower Esophageal Sphincter (LES)",
          points: [
            [-0.04, -0.58, 0.01],
            [-0.14, -0.82, 0.05],
            [-0.32, -0.96, 0.08],
          ],
          radiusFn: (t) => 0.14 + 0.08 * t,
          color: "#df888a",
          explodeVec: [0, -0.6, 0],
        }),
      ];
    }

    case "prostate": {
      return [
        createSculptedSpherePart({
          name: "Prostate_Left_Peripheral_Lobe",
          displayName: "Left Prostatic Lobe",
          radius: 0.42,
          position: [-0.22, -0.05, 0.04],
          scale: [0.95, 1.05, 0.92],
          color: "#c97476",
          explodeVec: [-0.55, 0, 0.1],
        }),
        createSculptedSpherePart({
          name: "Prostate_Right_Peripheral_Lobe",
          displayName: "Right Prostatic Lobe",
          radius: 0.42,
          position: [0.22, -0.05, 0.04],
          scale: [0.95, 1.05, 0.92],
          color: "#c97476",
          explodeVec: [0.55, 0, 0.1],
        }),
        createSculptedSpherePart({
          name: "Prostate_Central_Zone_Urethra",
          displayName: "Prostatic Urethra Conduit",
          radius: 0.14,
          position: [0, -0.02, 0.02],
          scale: [0.8, 3.6, 0.8],
          color: "#e69f9e",
          explodeVec: [0, 0.5, 0.3],
        }),
        createCurvedTubePart({
          name: "Prostate_Left_Seminal_Vesicle",
          displayName: "Left Seminal Vesicle",
          points: [
            [-0.16, 0.32, -0.14],
            [-0.42, 0.56, -0.22],
            [-0.68, 0.72, -0.2],
          ],
          radiusFn: (t) => 0.16 * Math.sin(t * Math.PI * 0.85 + 0.25) * (1 + 0.18 * Math.sin(t * 18)),
          tubularSegments: 40,
          color: "#d99d7c",
          explodeVec: [-0.7, 0.5, -0.35],
        }),
        createCurvedTubePart({
          name: "Prostate_Right_Seminal_Vesicle",
          displayName: "Right Seminal Vesicle",
          points: [
            [0.16, 0.32, -0.14],
            [0.42, 0.56, -0.22],
            [0.68, 0.72, -0.2],
          ],
          radiusFn: (t) => 0.16 * Math.sin(t * Math.PI * 0.85 + 0.25) * (1 + 0.18 * Math.sin(t * 18)),
          tubularSegments: 40,
          color: "#d99d7c",
          explodeVec: [0.7, 0.5, -0.35],
        }),
        createCurvedTubePart({
          name: "Prostate_Vas_Deferens_Ampullae",
          displayName: "Ampulla of Vas Deferens",
          points: [
            [-0.12, 0.38, -0.16],
            [-0.25, 0.72, -0.25],
            [-0.36, 0.96, -0.15],
          ],
          radiusFn: () => 0.055,
          color: "#dfb29a",
          explodeVec: [-0.35, 0.75, 0],
        }),
      ];
    }

    case "testes":
    case "vas_deferens":
    case "penis": {
      return [
        createSculptedSpherePart({
          name: "Testes_Left_Gonad",
          displayName: "Left Testis (Tunica Albuginea)",
          radius: 0.36,
          position: [-0.38, -0.18, 0.04],
          scale: [0.78, 1.15, 0.85],
          rotation: [0.1, 0, -0.08],
          color: "#dfb0a8",
          clearcoat: 0.55,
          explodeVec: [-0.65, -0.25, 0.1],
        }),
        createSculptedSpherePart({
          name: "Testes_Right_Gonad",
          displayName: "Right Testis (Tunica Albuginea)",
          radius: 0.36,
          position: [0.38, -0.12, 0.04],
          scale: [0.78, 1.15, 0.85],
          rotation: [0.1, 0, 0.08],
          color: "#dfb0a8",
          clearcoat: 0.55,
          explodeVec: [0.65, -0.25, 0.1],
        }),
        createCurvedTubePart({
          name: "Testes_Left_Epididymis",
          displayName: "Left Epididymis (Caput-Cauda)",
          points: [
            [-0.32, 0.24, 0.14],
            [-0.58, 0.08, -0.18],
            [-0.56, -0.35, -0.22],
            [-0.42, -0.52, -0.16],
          ],
          radiusFn: (t) => 0.11 - 0.045 * t,
          color: "#d9927b",
          explodeVec: [-0.95, 0.1, -0.25],
        }),
        createCurvedTubePart({
          name: "Testes_Right_Epididymis",
          displayName: "Right Epididymis (Caput-Cauda)",
          points: [
            [0.32, 0.3, 0.14],
            [0.58, 0.14, -0.18],
            [0.56, -0.29, -0.22],
            [0.42, -0.46, -0.16],
          ],
          radiusFn: (t) => 0.11 - 0.045 * t,
          color: "#d9927b",
          explodeVec: [0.95, 0.1, -0.25],
        }),
        createCurvedTubePart({
          name: "Vas_Deferens_Left_Cord",
          displayName: "Left Spermatic Cord & Vas Deferens",
          points: [
            [-0.42, -0.52, -0.16],
            [-0.36, 0.15, -0.1],
            [-0.32, 0.92, 0.0],
          ],
          radiusFn: () => 0.055,
          color: "#e2aa8e",
          explodeVec: [-0.45, 0.65, 0],
        }),
        createCurvedTubePart({
          name: "Vas_Deferens_Right_Cord",
          displayName: "Right Spermatic Cord & Vas Deferens",
          points: [
            [0.42, -0.46, -0.16],
            [0.36, 0.2, -0.1],
            [0.32, 0.92, 0.0],
          ],
          radiusFn: () => 0.055,
          color: "#e2aa8e",
          explodeVec: [0.45, 0.65, 0],
        }),
      ];
    }

    case "ovaries":
    case "fallopian_tubes": {
      return [
        // Central Uterine Fundus reference anchor so adnexa sit naturally in context
        createSculptedSpherePart({
          name: "Female_Uterine_Fundus_Anchor",
          displayName: "Uterine Corpus & Fundus",
          radius: 0.38,
          position: [0, -0.1, 0],
          scale: [0.95, 1.25, 0.72],
          color: "#b95965",
          explodeVec: [0, -0.35, -0.2],
        }),
        createCurvedTubePart({
          name: "Fallopian_Tube_Left_Oviduct",
          displayName: "Left Fallopian Tube (Ampulla & Fimbriae)",
          points: [
            [-0.28, 0.18, 0.0],
            [-0.58, 0.32, -0.05],
            [-0.86, 0.18, -0.14],
            [-0.92, -0.08, -0.16],
          ],
          radiusFn: (t) => 0.045 + 0.055 * Math.pow(t, 1.5),
          color: "#d47380",
          explodeVec: [-0.65, 0.5, 0],
        }),
        createCurvedTubePart({
          name: "Fallopian_Tube_Right_Oviduct",
          displayName: "Right Fallopian Tube (Ampulla & Fimbriae)",
          points: [
            [0.28, 0.18, 0.0],
            [0.58, 0.32, -0.05],
            [0.86, 0.18, -0.14],
            [0.92, -0.08, -0.16],
          ],
          radiusFn: (t) => 0.045 + 0.055 * Math.pow(t, 1.5),
          color: "#d47380",
          explodeVec: [0.65, 0.5, 0],
        }),
        createSculptedSpherePart({
          name: "Ovary_Left_Gonad",
          displayName: "Left Ovary & Ovarian Follicles",
          radius: 0.22,
          position: [-0.68, -0.06, -0.14],
          scale: [1.15, 0.85, 0.75],
          rotation: [0, 0, -0.25],
          color: "#f2c6c2",
          clearcoat: 0.65,
          explodeVec: [-0.85, -0.35, 0.25],
        }),
        createSculptedSpherePart({
          name: "Ovary_Right_Gonad",
          displayName: "Right Ovary & Corpus Luteum",
          radius: 0.22,
          position: [0.68, -0.06, -0.14],
          scale: [1.15, 0.85, 0.75],
          rotation: [0, 0, 0.25],
          color: "#f2c6c2",
          clearcoat: 0.65,
          explodeVec: [0.85, -0.35, 0.25],
        }),
      ];
    }

    case "thyroid":
    case "parathyroid": {
      return [
        // Central Tracheal Cartilage Tube frame
        createCurvedTubePart({
          name: "Thyroid_Trachea_Cartilage_Support",
          displayName: "Cricoid & Tracheal Rings",
          points: [
            [0, 0.85, -0.12],
            [0, 0.0, -0.12],
            [0, -0.85, -0.12],
          ],
          radiusFn: (t) => 0.22 + 0.02 * Math.sin(t * Math.PI * 16),
          color: "#e7e5e4",
          clearcoat: 0.2,
          explodeVec: [0, 0, -0.45],
        }),
        createSculptedSpherePart({
          name: "Thyroid_Left_Lobe",
          displayName: "Left Lateral Thyroid Lobe",
          radius: 0.34,
          position: [-0.36, 0.1, 0.05],
          scale: [0.75, 1.65, 0.85],
          rotation: [0, 0, -0.14],
          color: "#b44c54",
          explodeVec: [-0.65, 0, 0.15],
        }),
        createSculptedSpherePart({
          name: "Thyroid_Right_Lobe",
          displayName: "Right Lateral Thyroid Lobe",
          radius: 0.34,
          position: [0.36, 0.1, 0.05],
          scale: [0.75, 1.65, 0.85],
          rotation: [0, 0, 0.14],
          color: "#b44c54",
          explodeVec: [0.65, 0, 0.15],
        }),
        createSculptedSpherePart({
          name: "Thyroid_Isthmus_Bridge",
          displayName: "Thyroid Isthmus",
          radius: 0.2,
          position: [0, -0.05, 0.15],
          scale: [1.35, 0.68, 0.45],
          color: "#c0565e",
          explodeVec: [0, -0.35, 0.45],
        }),
        // 4 Golden Posterior Parathyroid Glands
        createSculptedSpherePart({
          name: "Parathyroid_Superior_Left",
          displayName: "Left Superior Parathyroid Gland",
          radius: 0.065,
          position: [-0.34, 0.36, -0.18],
          color: "#f59e0b",
          explodeVec: [-0.75, 0.45, -0.35],
        }),
        createSculptedSpherePart({
          name: "Parathyroid_Inferior_Left",
          displayName: "Left Inferior Parathyroid Gland",
          radius: 0.065,
          position: [-0.36, -0.16, -0.18],
          color: "#f59e0b",
          explodeVec: [-0.75, -0.45, -0.35],
        }),
        createSculptedSpherePart({
          name: "Parathyroid_Superior_Right",
          displayName: "Right Superior Parathyroid Gland",
          radius: 0.065,
          position: [0.34, 0.36, -0.18],
          color: "#f59e0b",
          explodeVec: [0.75, 0.45, -0.35],
        }),
        createSculptedSpherePart({
          name: "Parathyroid_Inferior_Right",
          displayName: "Right Inferior Parathyroid Gland",
          radius: 0.065,
          position: [0.36, -0.16, -0.18],
          color: "#f59e0b",
          explodeVec: [0.75, -0.45, -0.35],
        }),
      ];
    }

    case "adrenals": {
      return [
        createSculptedSpherePart({
          name: "Adrenal_Right_Pyramidal_Cortex",
          displayName: "Right Suprarenal Gland (Pyramidal)",
          radius: 0.38,
          position: [-0.52, 0.25, 0],
          scale: [1.15, 0.85, 0.72],
          rotation: [0, 0, -0.25],
          color: "#eab308",
          explodeVec: [-0.6, 0.3, 0],
        }),
        createSculptedSpherePart({
          name: "Adrenal_Left_Semilunar_Cortex",
          displayName: "Left Suprarenal Gland (Semilunar)",
          radius: 0.38,
          position: [0.52, 0.25, 0],
          scale: [1.05, 1.05, 0.7],
          rotation: [0, 0, 0.28],
          color: "#f59e0b",
          explodeVec: [0.6, 0.3, 0],
        }),
        createSculptedSpherePart({
          name: "Adrenal_Right_Medulla_Core",
          displayName: "Right Chromaffin Medulla",
          radius: 0.18,
          position: [-0.52, 0.2, 0.12],
          color: "#b45309",
          explodeVec: [-0.6, -0.4, 0.3],
        }),
        createSculptedSpherePart({
          name: "Adrenal_Left_Medulla_Core",
          displayName: "Left Chromaffin Medulla",
          radius: 0.18,
          position: [0.52, 0.2, 0.12],
          color: "#b45309",
          explodeVec: [0.6, -0.4, 0.3],
        }),
      ];
    }

    case "pituitary": {
      return [
        createCurvedTubePart({
          name: "Pituitary_Infundibular_Stalk",
          displayName: "Hypothalamic Infundibular Stalk",
          points: [
            [0, 0.85, 0],
            [0, 0.48, 0.04],
            [0, 0.18, 0.06],
          ],
          radiusFn: (t) => 0.12 - 0.03 * t,
          color: "#f3c5c0",
          explodeVec: [0, 0.65, 0],
        }),
        createSculptedSpherePart({
          name: "Pituitary_Anterior_Adenohypophysis",
          displayName: "Anterior Lobe (Adenohypophysis)",
          radius: 0.42,
          position: [0, -0.18, 0.22],
          scale: [1.15, 0.85, 0.85],
          color: "#d97b84",
          explodeVec: [0, -0.3, 0.65],
        }),
        createSculptedSpherePart({
          name: "Pituitary_Posterior_Neurohypophysis",
          displayName: "Posterior Lobe (Neurohypophysis)",
          radius: 0.3,
          position: [0, -0.15, -0.22],
          scale: [0.95, 0.82, 0.82],
          color: "#e2b2a4",
          explodeVec: [0, -0.3, -0.65],
        }),
      ];
    }

    case "ears": {
      return [
        createCurvedTubePart({
          name: "Ear_External_Acoustic_Canal",
          displayName: "External Acoustic Meatus",
          points: [
            [-0.85, 0, 0],
            [-0.55, 0.02, 0.04],
            [-0.25, 0, 0],
          ],
          radiusFn: () => 0.14,
          color: "#dfad9c",
          explodeVec: [-0.65, 0, 0],
        }),
        createSculptedSpherePart({
          name: "Ear_Tympanic_Membrane",
          displayName: "Tympanic Membrane (Eardrum)",
          radius: 0.19,
          position: [-0.22, 0, 0],
          scale: [0.22, 1.0, 1.0],
          color: "#e7e5e4",
          roughness: 0.25,
          explodeVec: [-0.25, -0.35, 0.25],
        }),
        createSculptedSpherePart({
          name: "Ear_Ossicles_Chain",
          displayName: "Auditory Ossicles (Malleus, Incus, Stapes)",
          radius: 0.12,
          position: [-0.04, 0.08, 0.03],
          scale: [1.4, 0.9, 0.7],
          color: "#f5f5f4",
          explodeVec: [0, 0.45, 0.25],
        }),
        createCurvedTubePart({
          name: "Ear_Cochlea_Spiral",
          displayName: "Cochlear Acoustic Spiral",
          points: [
            [0.2, -0.05, 0.0],
            [0.42, 0.1, 0.14],
            [0.58, -0.05, -0.12],
            [0.4, -0.2, -0.02],
            [0.34, 0.0, 0.05],
          ],
          radiusFn: (t) => 0.13 * (1 - 0.55 * t),
          tubularSegments: 48,
          color: "#e5b869",
          explodeVec: [0.65, -0.3, 0.2],
        }),
        createCurvedTubePart({
          name: "Ear_Semicircular_Vestibular_Canals",
          displayName: "Vestibular Semicircular Canals",
          points: [
            [0.18, 0.12, -0.05],
            [0.36, 0.46, -0.1],
            [0.58, 0.34, 0.08],
            [0.34, 0.1, 0.05],
          ],
          radiusFn: () => 0.055,
          color: "#fbbf24",
          explodeVec: [0.55, 0.55, -0.2],
        }),
      ];
    }

    case "small_intestine": {
      const mucosalWave = (r0, r1, freq = 40) => (t) => {
        const base = r0 + (r1 - r0) * t;
        const plicae = 0.055 * Math.sin(t * Math.PI * freq) + 0.025 * Math.sin(t * Math.PI * 11);
        return base * (1 + plicae);
      };
      // Smooth rounded taper only on open free sphincter ends so joints blend seamlessly
      const taperedStartWave = (r0, r1, freq = 34) => (t) => {
        const base = mucosalWave(r0, r1, freq)(t);
        const startCap = t < 0.06 ? 0.25 + 0.75 * Math.sin((t / 0.06) * Math.PI * 0.5) : 1;
        return base * startCap;
      };
      const taperedEndWave = (r0, r1, freq = 26) => (t) => {
        const base = mucosalWave(r0, r1, freq)(t);
        const endCap = t > 0.92 ? 0.22 + 0.78 * Math.cos(((t - 0.92) / 0.08) * Math.PI * 0.5) : 1;
        return base * endCap;
      };

      return [
        createCurvedTubePart({
          name: "SmallIntestine_Duodenum_CLoop",
          displayName: "Duodenum (C-Loop Flexure)",
          points: [
            [0.08, 1.14, -0.04],
            [-0.22, 1.14, -0.02],
            [-0.44, 0.96, -0.1],
            [-0.46, 0.66, -0.16],
            [-0.22, 0.48, -0.18],
            [0.12, 0.46, -0.14],
            [0.32, 0.66, -0.06],
            [0.42, 0.84, 0.04],
            [0.5, 0.94, 0.1],
          ],
          radiusFn: taperedStartWave(0.114, 0.116, 32),
          tubularSegments: 108,
          radialSegments: 22,
          color: "#d48d83",
          roughness: 0.48,
          clearcoat: 0.22,
          capEnds: true,
          explodeVec: [0.55, 0.9, -0.35],
        }),
        createCurvedTubePart({
          name: "SmallIntestine_Proximal_Jejunum",
          displayName: "Proximal Jejunum (LUQ Oblique Coils)",
          points: [
            [0.42, 0.84, 0.04],
            [0.5, 0.94, 0.1],
            [0.64, 0.76, 0.22],
            [0.58, 0.44, 0.26],
            [0.3, 0.52, 0.1],
            [0.18, 0.78, 0.18],
            [-0.04, 0.62, 0.28],
            [0.12, 0.3, 0.24],
            [0.48, 0.26, 0.16],
            [0.66, 0.04, 0.08],
            [0.36, 0.08, 0.26],
          ],
          radiusFn: mucosalWave(0.116, 0.112, 46),
          tubularSegments: 176,
          radialSegments: 22,
          color: "#cf837b",
          roughness: 0.47,
          clearcoat: 0.22,
          capEnds: false,
          explodeVec: [0.9, 0.35, 0.45],
        }),
        createCurvedTubePart({
          name: "SmallIntestine_Middle_Jejunum",
          displayName: "Mid Jejunum (Central Folded Arcades)",
          points: [
            [0.66, 0.04, 0.08],
            [0.36, 0.08, 0.26],
            [0.02, 0.26, 0.22],
            [-0.36, 0.4, 0.16],
            [-0.6, 0.18, 0.04],
            [-0.44, -0.06, 0.24],
            [-0.1, 0.08, 0.28],
            [0.14, -0.18, 0.24],
            [-0.22, -0.28, 0.14],
            [-0.58, -0.12, 0.06],
            [-0.66, -0.44, 0.18],
            [-0.36, -0.48, 0.26],
          ],
          radiusFn: mucosalWave(0.112, 0.106, 48),
          tubularSegments: 184,
          radialSegments: 22,
          color: "#cc7e77",
          roughness: 0.48,
          clearcoat: 0.2,
          capEnds: false,
          explodeVec: [-0.75, 0.12, 0.55],
        }),
        createCurvedTubePart({
          name: "SmallIntestine_Ileum_Loops",
          displayName: "Ileum (Vertical-Oblique Pelvic Loops)",
          points: [
            [-0.66, -0.44, 0.18],
            [-0.36, -0.48, 0.26],
            [-0.16, -0.22, 0.22],
            [0.12, -0.34, 0.12],
            [0.08, -0.78, 0.24],
            [0.38, -0.84, 0.18],
            [0.58, -0.42, 0.2],
            [0.64, -0.18, 0.04],
            [0.44, -0.46, 0.08],
            [0.26, -0.96, 0.12],
            [-0.06, -0.98, 0.2],
            [-0.12, -0.66, 0.18],
          ],
          radiusFn: mucosalWave(0.106, 0.096, 48),
          tubularSegments: 180,
          radialSegments: 20,
          color: "#c77873",
          roughness: 0.49,
          clearcoat: 0.2,
          capEnds: false,
          explodeVec: [0.65, -0.55, 0.45],
        }),
        createCurvedTubePart({
          name: "SmallIntestine_Terminal_Ileum",
          displayName: "Terminal Ileum & Ileocecal Junction",
          points: [
            [-0.06, -0.98, 0.2],
            [-0.12, -0.66, 0.18],
            [-0.34, -0.86, 0.08],
            [-0.54, -0.94, 0.0],
            [-0.66, -0.72, -0.02],
            [-0.76, -0.52, 0.0],
          ],
          radiusFn: taperedEndWave(0.096, 0.084, 22),
          tubularSegments: 88,
          radialSegments: 20,
          color: "#c3726e",
          roughness: 0.5,
          clearcoat: 0.2,
          capEnds: true,
          explodeVec: [-0.9, -0.65, 0.25],
        }),
        createCurvedTubePart({
          name: "SmallIntestine_Mesentery_Root",
          displayName: "Mesenteric Vascular Root & Arcades (SMA)",
          points: [
            [0.18, 0.92, -0.18],
            [0.12, 0.54, -0.12],
            [0.02, 0.1, -0.1],
            [-0.14, -0.32, -0.1],
            [-0.42, -0.64, -0.08],
          ],
          radiusFn: (t) => 0.095 * (1 - 0.35 * t) * (1 + 0.08 * Math.sin(t * Math.PI * 10)),
          tubularSegments: 56,
          radialSegments: 18,
          color: "#9a4042",
          roughness: 0.55,
          clearcoat: 0.18,
          capEnds: true,
          explodeVec: [0, 0, -0.85],
        }),
      ];
    }

    case "tongue":
    default: {
      return [
        createCurvedTubePart({
          name: "Tongue_Body_Dorsum",
          displayName: "Tongue Dorsum & Apex",
          points: [
            [0, -0.22, -0.55],
            [0, -0.06, -0.15],
            [0, -0.04, 0.32],
            [0, -0.12, 0.72],
          ],
          radiusFn: (t) => 0.38 * Math.sin((1 - t * 0.65) * Math.PI * 0.55),
          color: "#d16c78",
          explodeVec: [0, 0.25, 0.45],
        }),
        createSculptedSpherePart({
          name: "Tongue_Root_Hyoglossus",
          displayName: "Muscular Root & Papillae",
          radius: 0.32,
          position: [0, -0.28, -0.42],
          scale: [1.1, 0.9, 1.0],
          color: "#b95662",
          explodeVec: [0, -0.45, -0.35],
        }),
      ];
    }
  }
}

export default function ProceduralOrganModel({
  type = "stomach",
  explosionProgress = 0,
  dismantleMode = "grid",
  selectedPart = null,
  onSelectMesh,
  onModelLoaded,
  spotlightMode = "studio",
  clippingPlanes = [],
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  layerOpacity = 1.0,
  isHighlightedInBody = false,
}) {
  const groupRef = useRef();

  const parts = useMemo(() => {
    return buildProceduralParts(type);
  }, [type]);

  const partCenters = useMemo(() => {
    return parts.map((p) => {
      if (!p.geometry.boundingBox) p.geometry.computeBoundingBox();
      const c = new THREE.Vector3();
      p.geometry.boundingBox.getCenter(c);
      const sx = p.scale?.[0] ?? 1;
      const sy = p.scale?.[1] ?? 1;
      const sz = p.scale?.[2] ?? 1;
      c.set(c.x * sx, c.y * sy, c.z * sz);
      c.add(new THREE.Vector3(...(p.position || [0, 0, 0])));
      return c;
    });
  }, [parts]);

  // Dispose geometries cleanly on type switch or unmount
  useEffect(() => {
    return () => {
      parts.forEach((p) => {
        if (p.geometry) p.geometry.dispose();
      });
    };
  }, [parts]);

  // Notify parent Viewer for camera fit calculations when standalone isolated
  useEffect(() => {
    if (!groupRef.current || !onModelLoaded) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    if (!box.isEmpty()) {
      const size = new THREE.Vector3();
      box.getSize(size);
      onModelLoaded({
        normalizedBoundingBox: box,
        dimensions: size,
        meshCount: parts.length,
        isProcedural: true,
      });
    }
  }, [parts, onModelLoaded]);

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {parts.map((part, idx) => {
        const isSelected = selectedPart && part.name === selectedPart;

        // Calculate explosion offset
        let offset = [0, 0, 0];
        if (explosionProgress > 0.001) {
          if (dismantleMode === "grid") {
            const count = parts.length;
            const cols = count <= 2 ? count : count <= 4 ? 2 : 3;
            const totalRows = Math.ceil(count / cols);
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            const itemsInThisRow = row === totalRows - 1 ? count - row * cols : cols;
            const targetX = (col - (itemsInThisRow - 1) / 2) * 1.45;
            const targetY = ((totalRows - 1) / 2 - row) * 1.25 + 0.15;
            const rc = partCenters[idx];
            offset = [
              (targetX - rc.x) * explosionProgress,
              (targetY - rc.y) * explosionProgress,
              -rc.z * explosionProgress,
            ];
          } else {
            offset = [
              part.explodeVec[0] * explosionProgress,
              part.explodeVec[1] * explosionProgress,
              part.explodeVec[2] * explosionProgress,
            ];
          }
        }

        const finalPos = [
          part.position[0] + offset[0],
          part.position[1] + offset[1],
          part.position[2] + offset[2],
        ];

        const emissiveColor = isSelected || isHighlightedInBody ? "#f3c978" : spotlightMode === "cyber" ? "#e5b869" : spotlightMode === "xray" ? "#d6d3d1" : "#000000";
        const emissiveIntensity = isSelected || isHighlightedInBody ? 0.55 : spotlightMode === "cyber" ? 0.25 : spotlightMode === "xray" ? 0.45 : 0;
        const opacity = spotlightMode === "xray" ? 0.48 * layerOpacity : layerOpacity;

        return (
          <mesh
            key={part.name}
            name={part.name}
            geometry={part.geometry}
            position={finalPos}
            scale={part.scale}
            rotation={part.rotation}
            castShadow
            receiveShadow
            onPointerDown={(e) => {
              e.stopPropagation();
              if (onSelectMesh) onSelectMesh(part.displayName || part.name);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <meshPhysicalMaterial
              color={part.color}
              roughness={spotlightMode === "xray" ? 0.15 : part.roughness}
              metalness={spotlightMode === "xray" ? 0.4 : part.metalness}
              clearcoat={part.clearcoat ?? 0.45}
              clearcoatRoughness={0.28}
              emissive={emissiveColor}
              emissiveIntensity={emissiveIntensity}
              transparent={opacity < 0.99}
              opacity={opacity}
              clippingPlanes={clippingPlanes.length ? clippingPlanes : null}
              clipShadows
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

