import * as THREE from "three";

/**
 * Maps anatomical prefix/name to recognized biological system.
 */
export function inferSystemFromName(name = "") {
  const lower = name.toLowerCase();
  if (lower.startsWith("skin_") || lower.includes("integument")) return "integumentary";
  if (
    lower.startsWith("muscle_") ||
    lower.includes("pectoral") ||
    lower.includes("deltoid") ||
    lower.includes("abdominis") ||
    lower.includes("biceps") ||
    lower.includes("quadriceps") ||
    lower.includes("gastrocnemius") ||
    lower.includes("muscul")
  )
    return "muscular";
  if (
    lower.startsWith("skeleton_") ||
    lower.includes("bone") ||
    lower.includes("skull") ||
    lower.includes("spine") ||
    lower.includes("rib") ||
    lower.includes("sternum") ||
    lower.includes("pelvis") ||
    lower.includes("femur") ||
    lower.includes("clavicle") ||
    lower.includes("humerus") ||
    lower.includes("tibia") ||
    lower.includes("mandible") ||
    lower.includes("vertebra") ||
    lower.includes("cartilage") ||
    lower.includes("disc") ||
    lower.includes("sacrum") ||
    lower.includes("atlas") ||
    lower.includes("axis") ||
    lower.includes("scapula") ||
    lower.includes("radius") ||
    lower.includes("ulna") ||
    lower.includes("fibula") ||
    lower.includes("patella") ||
    lower.includes("phalanx") ||
    lower.includes("carpal") ||
    lower.includes("tarsal") ||
    lower.includes("vomer") ||
    lower.includes("maxilla") ||
    lower.includes("concha")
  )
    return "skeletal";
  if (lower.includes("brain") || lower.includes("cerebr") || lower.includes("nerve") || lower.includes("cord") || lower.includes("eye"))
    return "nervous";
  if (lower.includes("heart") || lower.includes("aorta") || lower.includes("vena_cava") || lower.includes("artery") || lower.includes("vein"))
    return "circulatory";
  if (lower.includes("lung") || lower.includes("trachea") || lower.includes("bronch"))
    return "respiratory";
  if (
    lower.includes("liver") ||
    lower.includes("stomach") ||
    lower.includes("gallbladder") ||
    lower.includes("pancreas") ||
    lower.includes("spleen") ||
    lower.includes("intestine") ||
    lower.includes("colon")
  )
    return "digestive";
  if (lower.includes("kidney") || lower.includes("bladder") || lower.includes("adrenal") || lower.includes("ureter"))
    return "urinary";
  return "organ";
}

/**
 * Cleans an anatomical part name into a human-readable medical title.
 */
export function formatPartName(rawName = "", index = 0, userData = {}) {
  if (userData?.displayName) return userData.displayName;
  if (!rawName || rawName.trim() === "" || rawName.startsWith("Object_") || rawName.startsWith("mesh_")) {
    return `Biological Structure ${String(index + 1).padStart(2, "0")}`;
  }
  return rawName
    .replace(/^(organ|muscle|skeleton|skin|muscular)_/i, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Converts a desired world-space displacement delta into `mesh.parent`'s local coordinate frame
 * so scaled or rotated GLTF hierarchies always expand accurately in normalized world units.
 */
function worldDeltaToParentLocal(mesh, worldCenter, worldDelta) {
  if (!mesh?.parent) return worldDelta.clone();
  const p0 = mesh.parent.worldToLocal(worldCenter.clone());
  const p1 = mesh.parent.worldToLocal(worldCenter.clone().add(worldDelta));
  return p1.sub(p0);
}

/**
 * Analyzes model hierarchy and builds an exploded-view component registry.
 * Creates an anatomical lateral and depth spread matching the Astra AI / Human Body Atlas video,
 * and supports adaptive isolated-organ dismantling in both Layer Spread and Rows & Columns modes.
 */
export function buildExplodedComponents(rootObject, options = {}) {
  const { isIsolated = false, submeshKeywords = [] } = options;

  if (!rootObject) {
    return {
      components: [],
      canExplode: false,
      capabilityStatus: "No anatomical model loaded",
      totalEligible: 0,
    };
  }

  rootObject.updateMatrixWorld(true);

  const meshes = [];
  rootObject.traverse((child) => {
    if (child.isMesh) {
      meshes.push(child);
    }
  });

  if (meshes.length <= 1) {
    return {
      components: [],
      canExplode: false,
      capabilityStatus:
        meshes.length === 1
          ? "Single unified organ mesh (Layer disassembly unavailable)"
          : "No geometric structures detected",
      totalEligible: 0,
    };
  }

  const modelBox = new THREE.Box3().setFromObject(rootObject);
  const modelCenter = modelBox.getCenter(new THREE.Vector3());
  const modelSize = modelBox.getSize(new THREE.Vector3());
  const modelMaxDim = Math.max(0.01, modelSize.x, modelSize.y, modelSize.z);
  const normalizedKeywords = Array.isArray(submeshKeywords)
    ? submeshKeywords.map((k) => k.toLowerCase())
    : [];

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  const components = meshes.map((mesh, index) => {
    const originalPosition = mesh.position.clone();
    const originalQuaternion = mesh.quaternion.clone();
    const originalScale = mesh.scale.clone();

    const compBox = new THREE.Box3().setFromObject(mesh);
    const compCenter = compBox.getCenter(new THREE.Vector3());
    const compSize = compBox.getSize(new THREE.Vector3());

    const nameLower = (mesh.name || "").toLowerCase();
    const system = mesh.userData?.system || inferSystemFromName(mesh.name);
    const displacement = new THREE.Vector3();

    if (isIsolated) {
      // Isolated single-organ / sub-structure dismantle: expand every anatomical sub-part radially & clearly inside spotlight
      const radial = new THREE.Vector3().subVectors(compCenter, modelCenter);
      const dist = radial.length();
      const tIdx = (index + 0.5) / meshes.length;
      const ySpiral = 1 - 2 * tIdx;
      const rSpiral = Math.sqrt(Math.max(0, 1 - ySpiral * ySpiral));
      const theta = goldenAngle * index;
      const spiralDir = new THREE.Vector3(
        Math.cos(theta) * rSpiral,
        ySpiral * 0.72,
        Math.sin(theta) * rSpiral
      ).normalize();

      const isSubmeshMatch =
        normalizedKeywords.length > 0 &&
        normalizedKeywords.some((kw) => nameLower.includes(kw));

      if (normalizedKeywords.length > 0) {
        // Submesh focus isolation: pull highlighted target forward; expand outer shell outward & back
        if (isSubmeshMatch) {
          displacement.set(
            (compCenter.x - modelCenter.x) * 0.45,
            (compCenter.y - modelCenter.y) * 0.35 + 0.15,
            1.15
          );
        } else {
          const outDir = dist > 0.08 ? radial.clone().normalize() : spiralDir;
          displacement.copy(outDir).multiplyScalar(1.25);
          displacement.z -= 0.75;
        }
      } else {
        const outDir =
          dist > modelMaxDim * 0.06
            ? radial.clone().normalize().lerp(spiralDir, 0.22).normalize()
            : spiralDir;
        const spreadScale = Math.min(2.1, 1.05 + (dist / modelMaxDim) * 1.15);
        displacement.copy(outDir).multiplyScalar(spreadScale);
      }
    } else if (system === "integumentary" || nameLower.startsWith("skin_")) {
      if (nameLower.includes("anterior") || nameLower.includes("torso_anterior")) {
        displacement.set(0, 0, 3.8);
      } else if (nameLower.includes("posterior") || nameLower.includes("torso_posterior")) {
        displacement.set(0, 0, -3.8);
      } else if (nameLower.includes("left")) {
        displacement.set(-3.4, 0, 0.6);
      } else if (nameLower.includes("right")) {
        displacement.set(3.4, 0, 0.6);
      } else if (nameLower.includes("head")) {
        displacement.set(0, 2.6, 1.2);
      } else if (nameLower.includes("neck")) {
        displacement.set(0, 2.1, 1.4);
      } else {
        displacement.set(0, 0, 3.2);
      }
    }

    // 2. VISCERAL ORGANS (Full individual separation with clear sightlines)
    else if (system === "circulatory" || nameLower.includes("heart") || nameLower.includes("aorta") || nameLower.includes("vena_cava")) {
      if (nameLower.includes("heart")) {
        // Steps directly forward into central spotlight with zero occlusion
        displacement.set(0, 0.15, 2.5);
      } else if (nameLower.includes("aorta")) {
        displacement.set(-0.15, 0.55, 2.3);
      } else if (nameLower.includes("vena_cava") || nameLower.includes("vein")) {
        displacement.set(0.22, 0.50, 2.3);
      } else {
        displacement.set(0, 0.3, 2.2);
      }
    }
    else if (system === "respiratory" || nameLower.includes("lung") || nameLower.includes("trachea")) {
      if (nameLower.includes("left_lung") || (nameLower.includes("left") && nameLower.includes("lung"))) {
        // Displaces far to the left anterior field with generous clearance
        displacement.set(-1.65, 0.05, 1.6);
      } else if (nameLower.includes("right_lung") || (nameLower.includes("right") && nameLower.includes("lung"))) {
        // Displaces far to the right anterior field with generous clearance
        displacement.set(1.65, 0.05, 1.6);
      } else if (nameLower.includes("trachea")) {
        displacement.set(0, 0.75, 2.0);
      } else {
        displacement.set(0, 0.2, 1.5);
      }
    }
    else if (system === "digestive" || nameLower.includes("liver") || nameLower.includes("stomach") || nameLower.includes("intestine") || nameLower.includes("gall") || nameLower.includes("pancreas") || nameLower.includes("spleen")) {
      if (nameLower.includes("liver")) {
        // Displaced anterolaterally right below right lung
        displacement.set(1.45, -0.30, 1.7);
      } else if (nameLower.includes("gall")) {
        // Directly below liver with clear space
        displacement.set(1.75, -0.55, 2.0);
      } else if (nameLower.includes("stomach")) {
        // Displaced anterolaterally left below left lung
        displacement.set(-1.40, -0.25, 1.7);
      } else if (nameLower.includes("spleen")) {
        // Lateral-posterior left with clear margin
        displacement.set(-2.05, -0.15, 1.2);
      } else if (nameLower.includes("pancreas")) {
        displacement.set(-0.35, -0.25, 2.1);
      } else if (nameLower.includes("small_intestine")) {
        displacement.set(-0.45, -0.80, 2.0);
      } else if (nameLower.includes("large_intestine") || nameLower.includes("colon")) {
        displacement.set(0.45, -0.75, 2.2);
      } else {
        displacement.set(0, -0.4, 1.8);
      }
    }
    else if (system === "urinary" || nameLower.includes("kidney") || nameLower.includes("adrenal") || nameLower.includes("bladder")) {
      if (nameLower.includes("left_kidney") || (nameLower.includes("left") && nameLower.includes("kidney"))) {
        displacement.set(-1.25, -0.35, -1.3);
      } else if (nameLower.includes("right_kidney") || (nameLower.includes("right") && nameLower.includes("kidney"))) {
        displacement.set(1.25, -0.35, -1.3);
      } else if (nameLower.includes("left_adrenal") || (nameLower.includes("left") && nameLower.includes("adrenal"))) {
        displacement.set(-1.25, -0.05, -1.3);
      } else if (nameLower.includes("right_adrenal") || (nameLower.includes("right") && nameLower.includes("adrenal"))) {
        displacement.set(1.25, -0.05, -1.3);
      } else if (nameLower.includes("bladder")) {
        displacement.set(0, -1.25, 1.6);
      } else {
        displacement.set(0, -0.6, -1.0);
      }
    }
    else if (system === "nervous" || nameLower.includes("brain") || nameLower.includes("cord") || nameLower.includes("eye")) {
      if (nameLower.includes("brainstem")) {
        displacement.set(0, 1.30, 0.2);
      } else if (nameLower.includes("cerebellum")) {
        displacement.set(0, 1.65, -0.1);
      } else if (nameLower.includes("brain")) {
        // Elevated high above cranial vault with 360° clearance
        displacement.set(0, 2.10, 0.7);
      } else if (nameLower.includes("spinal_cord") || nameLower.includes("cord")) {
        displacement.set(0, 0.1, -1.5);
      } else if (nameLower.includes("eye")) {
        const sx = nameLower.includes("left") ? -0.65 : 0.65;
        displacement.set(sx, 1.85, 1.6);
      } else {
        displacement.set(-1.8, 0, 0.3);
      }
    }

    // 3. MUSCULAR SYSTEM (Symmetric lateral columns and anterior/posterior tiers)
    else if (system === "muscular" || nameLower.startsWith("muscle_")) {
      const isLeft = nameLower.includes("left");
      const sx = isLeft ? -1 : 1;

      if (nameLower.includes("pectoral")) {
        displacement.set(sx * 1.15, 0.05, 1.8);
      } else if (nameLower.includes("rectus_abdominis")) {
        displacement.set(0, -0.35, 1.9);
      } else if (nameLower.includes("oblique")) {
        displacement.set(sx * 1.55, -0.35, 1.4);
      } else if (nameLower.includes("trapezius")) {
        displacement.set(0, 0.45, -2.2);
      } else if (nameLower.includes("latissimus")) {
        displacement.set(sx * 1.45, -0.10, -2.0);
      } else if (nameLower.includes("deltoid")) {
        displacement.set(sx * 2.25, 0.15, 0.6);
      } else if (nameLower.includes("biceps")) {
        displacement.set(sx * 2.65, -0.10, 0.7);
      } else if (nameLower.includes("triceps")) {
        displacement.set(sx * 2.65, -0.10, -0.7);
      } else if (nameLower.includes("forearm")) {
        displacement.set(sx * 2.95, -0.45, 0.4);
      } else if (nameLower.includes("gluteus")) {
        displacement.set(sx * 1.55, -0.75, -1.8);
      } else if (nameLower.includes("quadriceps")) {
        displacement.set(sx * 1.35, -1.25, 0.9);
      } else if (nameLower.includes("hamstring")) {
        displacement.set(sx * 1.35, -1.25, -0.9);
      } else if (nameLower.includes("gastrocnemius")) {
        displacement.set(sx * 1.25, -1.85, -0.7);
      } else if (nameLower.includes("tibialis")) {
        displacement.set(sx * 1.25, -1.85, 0.7);
      } else {
        displacement.set(sx * 1.85, 0, 0.4);
      }
    }

    // 4. SKELETAL SYSTEM (Clean anatomical disarticulation with individual spatial clearance)
    else if (system === "skeletal" || nameLower.startsWith("skeleton_") || nameLower.includes("bone") || nameLower.includes("vertebra")) {
      const isLeft = nameLower.includes("left") || compCenter.x < -0.05;
      const sx = isLeft ? -1 : 1;
      const dx = compCenter.x - modelCenter.x;
      const dy = compCenter.y - modelCenter.y;
      const dz = compCenter.z - modelCenter.z;

      // Cranium & Facial Bones (Displace upward and radially into superior ring)
      if (
        nameLower.includes("frontal") ||
        nameLower.includes("parietal") ||
        nameLower.includes("temporal") ||
        nameLower.includes("occipital") ||
        nameLower.includes("sphenoid") ||
        nameLower.includes("ethmoid") ||
        nameLower.includes("nasal") ||
        nameLower.includes("lacrimal") ||
        nameLower.includes("zygomatic") ||
        nameLower.includes("maxilla") ||
        nameLower.includes("palatine") ||
        nameLower.includes("concha") ||
        nameLower.includes("vomer") ||
        nameLower.includes("mandible") ||
        nameLower.includes("hyoid") ||
        nameLower.includes("skull")
      ) {
        if (nameLower.includes("mandible")) {
          displacement.set(0, 0.90, 0.8);
        } else if (nameLower.includes("frontal")) {
          displacement.set(0, 1.85, 0.7);
        } else if (nameLower.includes("occipital")) {
          displacement.set(0, 1.70, -0.9);
        } else if (nameLower.includes("parietal")) {
          displacement.set(sx * 0.95, 1.95, 0.1);
        } else if (nameLower.includes("temporal")) {
          displacement.set(sx * 1.25, 1.65, -0.2);
        } else {
          displacement.set(sx * 0.75, 1.45, 0.5);
        }
      }
      // Thorax, Sternum & Ribs (Sternum pushes forward, ribs fan laterally)
      else if (nameLower.includes("sternum")) {
        displacement.set(0, 0.25, 1.6);
      } else if (nameLower.includes("costal") || nameLower.includes("cartilage")) {
        displacement.set(sx * 0.85, 0.15, 1.2);
      } else if (nameLower.includes("rib")) {
        displacement.set(sx * 1.75, 0.05, 0.55);
      }
      // Vertebral Column & Discs (Spine serves as stable dorsal column reference)
      else if (
        nameLower.includes("vertebra") ||
        nameLower.includes("atlas") ||
        nameLower.includes("axis") ||
        nameLower.includes("disc") ||
        nameLower.includes("sacrum") ||
        nameLower.includes("coccyx") ||
        nameLower.includes("spine")
      ) {
        displacement.set(0, dy * 0.25, -1.1);
      }
      // Shoulder Girdle & Upper Limbs (Clavicle, scapula, arms spread laterally)
      else if (nameLower.includes("clavicle")) {
        displacement.set(sx * 1.75, 0.35, 0.15);
      } else if (nameLower.includes("scapula")) {
        displacement.set(sx * 1.85, 0.25, -0.6);
      } else if (nameLower.includes("humerus")) {
        displacement.set(sx * 2.55, 0.05, 0.0);
      } else if (
        nameLower.includes("radius") ||
        nameLower.includes("ulna") ||
        nameLower.includes("forearm") ||
        nameLower.includes("carpal") ||
        nameLower.includes("metacarpal") ||
        nameLower.includes("hand")
      ) {
        displacement.set(sx * 3.10, -0.35, 0.1);
      }
      // Pelvic Girdle & Lower Limbs (Pelvis and legs spread laterally and downward)
      else if (nameLower.includes("pelvis") || nameLower.includes("ilium") || nameLower.includes("ischium") || nameLower.includes("pubis")) {
        displacement.set(sx * 0.85, -0.45, 0.1);
      } else if (nameLower.includes("femur")) {
        displacement.set(sx * 1.35, -0.85, 0.0);
      } else if (nameLower.includes("patella")) {
        displacement.set(sx * 1.35, -1.25, 0.7);
      } else if (nameLower.includes("tibia") || nameLower.includes("fibula")) {
        displacement.set(sx * 1.55, -1.65, 0.0);
      } else if (
        nameLower.includes("tarsal") ||
        nameLower.includes("metatarsal") ||
        nameLower.includes("calcaneus") ||
        nameLower.includes("talus") ||
        nameLower.includes("foot") ||
        nameLower.includes("phalanx")
      ) {
        displacement.set(sx * 1.75, -2.05, 0.3);
      }
      // General bone anatomical radial fallback
      else {
        const lateralSpread = Math.sign(dx || (isLeft ? -1 : 1)) * Math.max(0.7, Math.abs(dx) * 2.2);
        displacement.set(lateralSpread, dy * 0.4, Math.max(0.2, dz * 1.5));
      }
    } else {
      // Default radial dispersion if unclassified
      const dir = new THREE.Vector3().subVectors(compCenter, modelCenter);
      if (dir.length() < 0.1) {
        const angle = (index / meshes.length) * Math.PI * 2;
        displacement.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
      } else {
        displacement.copy(dir.normalize().multiplyScalar(1.6));
      }
    }

    let triangleCount = 0;
    if (mesh.geometry) {
      if (mesh.geometry.index) {
        triangleCount = mesh.geometry.index.count / 3;
      } else if (mesh.geometry.attributes.position) {
        triangleCount = mesh.geometry.attributes.position.count / 3;
      }
    }

    return {
      id: mesh.uuid,
      name: mesh.name || `structure_${index + 1}`,
      label: formatPartName(mesh.name, index, mesh.userData),
      system,
      cavity: mesh.userData?.cavity || "Somatic",
      mesh,
      originalPosition,
      originalQuaternion,
      originalScale,
      displacementVector: worldDeltaToParentLocal(mesh, compCenter, displacement),
      compCenter,
      compSize: {
        x: +compSize.x.toFixed(2),
        y: +compSize.y.toFixed(2),
        z: +compSize.z.toFixed(2),
      },
      triangleCount: Math.round(triangleCount),
    };
  });

  // Anatomical Sorting for the Rows & Columns Grid (matching Astra AI frame 0231)
  // System hierarchy: nervous -> skeletal -> muscular -> circulatory -> respiratory -> digestive -> urinary -> skin
  const systemPriority = {
    nervous: 1,
    skeletal: 2,
    muscular: 3,
    circulatory: 4,
    respiratory: 5,
    digestive: 6,
    urinary: 7,
    organ: 8,
    integumentary: 9,
  };

  const sortedForGrid = [...components].sort((a, b) => {
    const prioA = systemPriority[a.system] || 10;
    const prioB = systemPriority[b.system] || 10;
    if (prioA !== prioB) return prioA - prioB;
    return (b.compCenter.y || 0) - (a.compCenter.y || 0);
  });

  const count = sortedForGrid.length;
  const cols =
    count <= 4
      ? count
      : count <= 9
      ? 3
      : count <= 16
      ? 4
      : count <= 36
      ? 6
      : Math.min(18, Math.ceil(Math.sqrt(count * 1.35)));
  const totalRows = Math.ceil(count / cols);
  const maxGridWidth = 7.0;
  const maxGridHeight = 4.6;
  const spacingX = cols > 1 ? Math.min(1.65, maxGridWidth / (cols - 1)) : 0;
  const spacingY = totalRows > 1 ? Math.min(1.45, maxGridHeight / (totalRows - 1)) : 0;
  const yCenterOffset = 0.25;

  sortedForGrid.forEach((comp, gridIdx) => {
    const col = gridIdx % cols;
    const row = Math.floor(gridIdx / cols);
    const itemsInThisRow = row === totalRows - 1 ? count - row * cols : cols;

    const targetGridX = (col - (itemsInThisRow - 1) / 2) * spacingX;
    const targetGridY = ((totalRows - 1) / 2 - row) * spacingY + yCenterOffset;
    const targetGridZ = 0.25;

    const worldGridDelta = new THREE.Vector3(
      targetGridX - comp.compCenter.x,
      targetGridY - comp.compCenter.y,
      targetGridZ - comp.compCenter.z
    );
    comp.gridDisplacement = worldDeltaToParentLocal(comp.mesh, comp.compCenter, worldGridDelta);
  });

  return {
    components,
    canExplode: true,
    capabilityStatus: `Interactive Multilayer System (${components.length} Structures)`,
    totalEligible: components.length,
  };
}

/**
 * Updates component positions according to explosion progress (0.0 to 1.0).
 * 0.0 = completely restored to original assembled anatomy.
 * 1.0 = fully exploded/expanded outward.
 * @param {Array} components
 * @param {number} progress (0.0 - 1.0)
 * @param {string} dismantleMode - "layered" (lateral 3D spread) or "grid" (rows & columns matrix)
 */
export function applyExplosionProgress(components, progress, dismantleMode = "layered") {
  if (!components || !components.length) return;
  const t = Math.max(0, Math.min(1, progress));

  for (let i = 0; i < components.length; i++) {
    const comp = components[i];
    if (!comp.mesh || !comp.originalPosition) continue;

    if (t === 0) {
      comp.mesh.position.copy(comp.originalPosition);
    } else {
      const vector =
        dismantleMode === "grid" && comp.gridDisplacement
          ? comp.gridDisplacement
          : comp.displacementVector;

      comp.mesh.position
        .copy(comp.originalPosition)
        .addScaledVector(vector, t);
    }
  }
}
