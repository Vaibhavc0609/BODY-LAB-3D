import { useMemo, useRef, useState, useEffect, Suspense, Component } from "react";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { ORGANS } from "../data/anatomyData";
import ProceduralOrganModel from "./ProceduralOrgans";

class OrganLoadBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn(`Resilient organ loader skipped (${this.props.label || "mesh"}):`, error);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function SafeOrganSlot({ label, resetKey, children }) {
  return (
    <OrganLoadBoundary label={label} resetKey={resetKey}>
      <Suspense fallback={null}>{children}</Suspense>
    </OrganLoadBoundary>
  );
}

const GLOBAL_HRA_SCALE = 2.32;

function sanitizeMaterialCoolTint(mesh, material) {
  if (!material) return material;
  const cloned = material.clone();
  const meshName = (mesh?.name || "").toLowerCase();
  const matName = (cloned.name || "").toLowerCase();
  if (cloned.color) {
    const { r, g, b } = cloned.color;
    // Neutralize artificial blue tones in costal cartilage and vivid cobalt venous tubes
    if (b > r + 0.05 && b >= g * 0.85) {
      if (meshName.includes("cartilage") || (r > 0.32 && g > 0.32)) {
        cloned.color.set("#dcd3c1");
      } else {
        cloned.color.set("#722334");
      }
    }
  }
  // Tone down overly glossy plastic highlights on visceral mucosa (e.g. colon/intestines)
  if (
    meshName.includes("colon") ||
    meshName.includes("cecum") ||
    meshName.includes("rectum") ||
    meshName.includes("intestin") ||
    matName.includes("intestin") ||
    matName.includes("colon")
  ) {
    cloned.roughness = Math.max(cloned.roughness ?? 0.46, 0.46);
  }
  return cloned;
}

function cloneSceneWarmTinted(scene) {
  const root = scene.clone(true);
  root.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material = Array.isArray(child.material)
        ? child.material.map((m) => sanitizeMaterialCoolTint(child, m))
        : sanitizeMaterialCoolTint(child, child.material);
    }
  });
  return root;
}

function getShortOrganLabel(organId, organData) {
  if (organData?.shortName) return organData.shortName;
  const fallback = {
    heart: "Heart",
    lungs: "Lungs",
    brain: "Brain",
    eyes: "Eyes",
    vasculature: "Vasculature",
    liver: "Liver",
    stomach: "Stomach",
    small_intestine: "Small Intestine",
    large_intestine: "Colon",
    kidneys: "Kidneys",
    bladder: "Bladder",
    uterus: "Uterus",
    prostate: "Prostate",
    testes: "Testes",
  };
  return fallback[organId] || (organData?.name || organId).split("(")[0].trim();
}

/**
 * Organ sub-component representing an individual GLB organ in the assembled human body
 */
function VisceralOrganMesh({
  organId,
  url,
  nativeCenter,
  gridTarget,
  layeredOffset = [0.6, 0, 0.8],
  scale = GLOBAL_HRA_SCALE,
  localOffset = [0, 0, 0],
  explosionProgress = 0,
  dismantleMode = "grid",
  selectedOrganId = null,
  selectedPart = null,
  onSelectOrgan,
  layers = {},
  systemId = "organ",
  slicePlanes = [],
  hideBadge = false,
}) {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const isSelected = selectedOrganId === organId || selectedPart === organId;

  const clonedScene = useMemo(() => {
    return cloneSceneWarmTinted(scene);
  }, [scene]);

  const currentPos = useMemo(() => {
    if (explosionProgress <= 0.001) {
      return localOffset;
    }
    if (dismantleMode === "grid") {
      const dx = (gridTarget[0] - nativeCenter[0]) * explosionProgress;
      const dy = (gridTarget[1] - nativeCenter[1]) * explosionProgress;
      const dz = (gridTarget[2] - nativeCenter[2]) * explosionProgress;
      return [localOffset[0] + dx, localOffset[1] + dy, localOffset[2] + dz];
    }
    return [
      localOffset[0] + layeredOffset[0] * explosionProgress,
      localOffset[1] + layeredOffset[1] * explosionProgress,
      localOffset[2] + layeredOffset[2] * explosionProgress,
    ];
  }, [nativeCenter, gridTarget, layeredOffset, localOffset, explosionProgress, dismantleMode]);

  const layerState = useMemo(() => {
    return layers[systemId] || { visible: true, opacity: 1.0 };
  }, [layers, systemId]);

  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (!m) return;
          m.clippingPlanes = slicePlanes.length ? slicePlanes : null;
          m.clipShadows = true;
          m.side = THREE.DoubleSide;

          if (isSelected) {
            m.emissive = new THREE.Color("#f3c978");
            m.emissiveIntensity = 0.55;
            m.opacity = 1.0;
            m.transparent = false;
          } else if (hovered) {
            m.emissive = new THREE.Color("#fbbf24");
            m.emissiveIntensity = 0.4;
            m.opacity = 1.0;
            m.transparent = false;
          } else {
            m.emissive = new THREE.Color("#000000");
            m.emissiveIntensity = 0;
            m.opacity = layerState.opacity ?? 1.0;
            m.transparent = (layerState.opacity ?? 1.0) < 0.99;
          }
          m.needsUpdate = true;
        });
      }
    });
  }, [clonedScene, isSelected, hovered, layerState, slicePlanes]);

  if (!layerState.visible) return null;

  const organData = ORGANS[organId] || { name: organId };
  const labelText = getShortOrganLabel(organId, organData);

  const sx = Array.isArray(scale) ? scale[0] : scale;
  const sy = Array.isArray(scale) ? scale[1] : scale;
  const sz = Array.isArray(scale) ? scale[2] : scale;

  return (
    <group
      ref={meshRef}
      position={currentPos}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectOrgan) onSelectOrgan(organId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <primitive object={clonedScene} />

      {!hideBadge && explosionProgress > 0.35 && dismantleMode === "grid" && (
        <Html
          center
          position={[
            nativeCenter[0] / (sx || 1),
            nativeCenter[1] / (Math.abs(sy) || 1) + 0.16,
            nativeCenter[2] / (Math.abs(sz) || 1),
          ]}
          zIndexRange={[40, 0]}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div className={`matrix-organ-badge ${isSelected ? "selected" : ""} ${hovered ? "hovered" : ""}`}>
            <span className="matrix-organ-text">{labelText}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * Procedural Organ sub-component placed seamlessly inside the standing assembled human body
 */
function ProceduralInBodyOrgan({
  organId,
  proceduralType,
  nativeCenter,
  gridTarget,
  layeredOffset = [0.6, 0, 0.8],
  scale = 0.22,
  explosionProgress = 0,
  dismantleMode = "grid",
  selectedOrganId = null,
  selectedPart = null,
  onSelectOrgan,
  layers = {},
  systemId = "digestive",
  slicePlanes = [],
}) {
  const isSelected = selectedOrganId === organId || selectedPart === organId;
  const layerState = useMemo(() => {
    return layers[systemId] || { visible: true, opacity: 1.0 };
  }, [layers, systemId]);

  const currentPos = useMemo(() => {
    if (explosionProgress <= 0.001) return nativeCenter;
    if (dismantleMode === "grid") {
      return [
        nativeCenter[0] + (gridTarget[0] - nativeCenter[0]) * explosionProgress,
        nativeCenter[1] + (gridTarget[1] - nativeCenter[1]) * explosionProgress,
        nativeCenter[2] + (gridTarget[2] - nativeCenter[2]) * explosionProgress,
      ];
    }
    return [
      nativeCenter[0] + layeredOffset[0] * explosionProgress,
      nativeCenter[1] + layeredOffset[1] * explosionProgress,
      nativeCenter[2] + layeredOffset[2] * explosionProgress,
    ];
  }, [nativeCenter, gridTarget, layeredOffset, explosionProgress, dismantleMode]);

  if (!layerState.visible) return null;

  const organData = ORGANS[organId] || { name: organId };
  const labelText = getShortOrganLabel(organId, organData);

  return (
    <group
      position={currentPos}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectOrgan) onSelectOrgan(organId);
      }}
    >
      <ProceduralOrganModel
        type={proceduralType}
        scale={scale}
        layerOpacity={layerState.opacity ?? 1.0}
        clippingPlanes={slicePlanes}
        isHighlightedInBody={isSelected}
        onSelectMesh={() => onSelectOrgan && onSelectOrgan(organId)}
      />

      {explosionProgress > 0.35 && dismantleMode === "grid" && (
        <Html
          center
          position={[0, 0.34, 0]}
          zIndexRange={[40, 0]}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div className={`matrix-organ-badge ${isSelected ? "selected" : ""}`}>
            <span className="matrix-organ-text">{labelText}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * Z-Anatomy Skeletal Musculature Layer (mounted when Muscular layer is toggled ON)
 */
function MusculatureLayerMesh({
  explosionProgress = 0,
  dismantleMode = "grid",
  selectedGender = "male",
  layers = {},
  slicePlanes = [],
  onSelectOrgan,
  onSelectMesh,
}) {
  const { scene } = useGLTF("/z-anatomy-body.glb");

  const muscleScene = useMemo(() => {
    const clone = scene.clone(true);
    // Filter out bone/cartilage/tooth geometry in z-anatomy so it layers cleanly over bodyparts3d-skeleton without duplicate bone z-fighting
    clone.traverse((child) => {
      if (!child.isMesh) return;
      const n = (child.name || "").toLowerCase();
      const isMuscle =
        n.includes("muscle") ||
        n.includes("bicep") ||
        n.includes("tricep") ||
        n.includes("deltoid") ||
        n.includes("pector") ||
        n.includes("rectus") ||
        n.includes("oblique") ||
        n.includes("glute") ||
        n.includes("femoris") ||
        n.includes("tibialis") ||
        n.includes("gastrocnemius") ||
        n.includes("latissimus") ||
        n.includes("trapez") ||
        n.includes("serratus") ||
        n.includes("diaphragm") ||
        n.includes("sternocleido") ||
        n.includes("masseter") ||
        n.includes("temporalis") ||
        n.includes("vastus") ||
        n.includes("adductor") ||
        n.includes("sartorius") ||
        n.includes("soleus") ||
        n.includes("aponeurosis") ||
        n.includes("fascia") ||
        n.includes("tendon");
      const isNonMuscleSkeleton =
        !isMuscle &&
        (n.includes("bone") ||
          n.includes("vertebra") ||
          n.includes("rib") ||
          n.includes("femur") ||
          n.includes("tibia") ||
          n.includes("humerus") ||
          n.includes("radius") ||
          n.includes("ulna") ||
          n.includes("fibula") ||
          n.includes("clavicle") ||
          n.includes("scapula") ||
          n.includes("sternum") ||
          n.includes("mandible") ||
          n.includes("maxilla") ||
          n.includes("cranium") ||
          n.includes("tooth") ||
          n.includes("incisor") ||
          n.includes("canine") ||
          n.includes("molar") ||
          n.includes("premolar") ||
          n.includes("phalan") ||
          n.includes("carpal") ||
          n.includes("metacarpal") ||
          n.includes("tarsal") ||
          n.includes("metatarsal") ||
          n.includes("patella") ||
          n.includes("sacrum") ||
          n.includes("pelv") ||
          n.includes("hyoid") ||
          n.includes("ligament") ||
          n.includes("disc"));
      child.visible = !isNonMuscleSkeleton;
    });
    return clone;
  }, [scene]);

  const layerState = useMemo(() => {
    return layers.muscular || { visible: false, opacity: 0 };
  }, [layers]);

  useEffect(() => {
    if (!muscleScene) return;
    muscleScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (!m) return;
          m.clippingPlanes = slicePlanes.length ? slicePlanes : null;
          m.clipShadows = true;
          m.opacity = layerState.opacity ?? 0.85;
          m.transparent = (layerState.opacity ?? 0.85) < 0.99;
          m.needsUpdate = true;
        });
      }
    });
  }, [muscleScene, layerState, slicePlanes]);

  const pos = useMemo(() => {
    if (dismantleMode === "grid") {
      return [-1.8 * explosionProgress, -2.06, -1.2 * explosionProgress];
    }
    return [2.9 * explosionProgress, -2.06, -0.25 * explosionProgress];
  }, [dismantleMode, explosionProgress]);

  if (!layerState.visible || (layerState.opacity ?? 0) <= 0.02) return null;

  const isFemale = selectedGender === "female";

  return (
    <group
      position={pos}
      scale={isFemale ? [2.22, 2.38, 2.25] : [2.47, 2.42, 2.46]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.object?.name && onSelectMesh) onSelectMesh(e.object.name);
        if (onSelectOrgan) onSelectOrgan("muscles");
      }}
    >
      <primitive object={muscleScene} />
    </group>
  );
}

/**
 * Scales a mesh around a specified 3D pivot coordinate relative to its baked rest position.
 */
function applyBoneDimorphicTransform(mesh, scaleArr, pivot, translateArr = [0, 0, 0]) {
  if (!mesh.userData.__restPos) {
    mesh.userData.__restPos = mesh.position.clone();
  }
  const restPos = mesh.userData.__restPos;
  const [sx, sy, sz] = scaleArr;
  const [px, py, pz] = pivot;
  const [tx, ty, tz] = translateArr;
  mesh.scale.set(sx, sy, sz);
  mesh.position.set(
    restPos.x + px * (1 - sx) + tx,
    restPos.y + py * (1 - sy) + ty,
    restPos.z + pz * (1 - sz) + tz
  );
}

/**
 * Articulated Skeleton Framework Component (supports Android Male vs Gynecoid Female skeletal dimorphism)
 */
function SkeletonFrameworkMesh({
  url = "/bodyparts3d-skeleton.glb",
  explosionProgress = 0,
  dismantleMode = "grid",
  selectedGender = "male",
  selectedOrganId = null,
  selectedPart = null,
  onSelectOrgan,
  onSelectMesh,
  layers = {},
  slicePlanes = [],
}) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => {
    const clone = cloneSceneWarmTinted(scene);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.userData.__restPos = child.position.clone();
      }
    });
    return clone;
  }, [scene]);

  // Apply sex-specific Android (Male) vs Gynecoid (Female) skeletal proportions
  useEffect(() => {
    if (!clonedScene) return;
    const isFemale = selectedGender === "female";

    clonedScene.traverse((child) => {
      if (!child.isMesh) return;
      const n = (child.name || "").toLowerCase();
      const isRight = n.startsWith("right-");
      const isLeft = n.startsWith("left-");

      // 1. Pelvic Girdle: Narrow tall Android (Male) vs Wide Flared Gynecoid (Female)
      if (n.includes("hip-bone")) {
        const sgn = isRight ? -1 : 1;
        if (isFemale) {
          applyBoneDimorphicTransform(child, [1.22, 0.92, 1.06], [sgn * 0.01, 0.12, 0], [sgn * 0.014, -0.01, 0]);
        } else {
          applyBoneDimorphicTransform(child, [0.92, 1.04, 1.0], [0, 0.1, 0], [0, 0, 0]);
        }
        return;
      }
      if (n === "sacrum") {
        if (isFemale) {
          applyBoneDimorphicTransform(child, [1.14, 0.92, 0.98], [0, 0.12, -0.15]);
        } else {
          applyBoneDimorphicTransform(child, [0.93, 1.02, 1.0], [0, 0.12, -0.15]);
        }
        return;
      }

      // 2. Thorax / Ribcage: Broad barrel chest (Male) vs Slender hourglass ribs (Female)
      if (
        n.includes("-rib") ||
        n.includes("costal-cartilage") ||
        n.includes("sternum") ||
        n === "xiphoid-process"
      ) {
        if (isFemale) {
          applyBoneDimorphicTransform(child, [0.83, 0.96, 0.88], [0, 1.08, 0]);
        } else {
          applyBoneDimorphicTransform(child, [1.07, 1.02, 1.06], [0, 1.05, 0]);
        }
        return;
      }

      // 3. Shoulder Girdle: Broad Masculine Span vs Narrow Sloped Female Shoulders
      if (n.includes("clavicle") || n.includes("scapula")) {
        if (isFemale) {
          applyBoneDimorphicTransform(child, [0.83, 0.96, 0.93], [0, 1.32, 0], [0, -0.02, 0]);
        } else {
          applyBoneDimorphicTransform(child, [1.09, 1.02, 1.03], [0, 1.32, 0]);
        }
        return;
      }

      // 4. Upper Limbs: Keep humeral head articulated smoothly inside adjusted glenoid socket
      if (
        n.includes("humerus") ||
        n.includes("radius") ||
        n.includes("ulna") ||
        n.includes("scaphoid") ||
        n.includes("lunate") ||
        n.includes("triquetral") ||
        n.includes("pisiform") ||
        n.includes("trapezium") ||
        n.includes("trapezoid") ||
        n.includes("capitate") ||
        n.includes("hamate") ||
        n.includes("metacarpal") ||
        n.includes("thumb-") ||
        n.includes("-finger-")
      ) {
        const sgn = isRight ? -1 : isLeft ? 1 : 0;
        if (isFemale) {
          applyBoneDimorphicTransform(
            child,
            [0.94, 0.96, 0.94],
            [sgn * 0.38, 1.28, 0],
            [-sgn * 0.065, -0.018, 0]
          );
        } else {
          applyBoneDimorphicTransform(child, [1.02, 1.01, 1.02], [sgn * 0.38, 1.28, 0], [sgn * 0.034, 0, 0]);
        }
        return;
      }

      // 5. Lower Limbs: Follow adjusted hip acetabular socket cleanly
      if (
        n.includes("femur") ||
        n.includes("patella") ||
        n.includes("tibia") ||
        n.includes("fibula") ||
        n.includes("talus") ||
        n.includes("calcaneus") ||
        n.includes("navicular") ||
        n.includes("cuboid") ||
        n.includes("cuneiform") ||
        n.includes("metatarsal") ||
        n.includes("toe-") ||
        n.includes("sesamoid-bones-of-the-foot")
      ) {
        const sgn = isRight ? -1 : isLeft ? 1 : 0;
        if (isFemale) {
          applyBoneDimorphicTransform(child, [0.97, 0.99, 0.97], [sgn * 0.16, 0.02, 0], [sgn * 0.046, 0, 0]);
        } else {
          applyBoneDimorphicTransform(child, [1.01, 1.0, 1.01], [sgn * 0.16, 0.02, 0], [-sgn * 0.013, 0, 0]);
        }
        return;
      }

      // 6. Jawline: Square Prominent Male Mandible vs Delicate Tapered Female Jaw
      if (n === "mandible") {
        if (isFemale) {
          applyBoneDimorphicTransform(child, [0.90, 0.95, 0.96], [0, 1.65, 0.06]);
        } else {
          applyBoneDimorphicTransform(child, [1.06, 1.03, 1.02], [0, 1.65, 0.06]);
        }
      }
    });
  }, [clonedScene, selectedGender]);

  const skeletonPos = useMemo(() => {
    if (dismantleMode === "grid") {
      return [0, 0, -2.2 * explosionProgress];
    }
    return [-2.15 * explosionProgress, 0, -0.35 * explosionProgress];
  }, [dismantleMode, explosionProgress]);

  const layerState = useMemo(() => {
    return layers.skeletal || { visible: true, opacity: 1.0 };
  }, [layers]);

  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        const isPartSelected =
          selectedPart && (child.name === selectedPart || child.uuid === selectedPart);
        const isSkeletonSelected = selectedOrganId === "skeleton";

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (!m) return;
          m.clippingPlanes = slicePlanes.length ? slicePlanes : null;
          m.clipShadows = true;

          if (isPartSelected || isSkeletonSelected) {
            m.emissive = new THREE.Color("#f3c978");
            m.emissiveIntensity = 0.55;
            m.opacity = 1.0;
            m.transparent = false;
          } else {
            m.emissive = new THREE.Color("#000000");
            m.emissiveIntensity = 0;
            m.opacity = layerState.opacity ?? 1.0;
            m.transparent = (layerState.opacity ?? 1.0) < 0.99;
          }
          m.needsUpdate = true;
        });
      }
    });
  }, [clonedScene, selectedPart, selectedOrganId, layerState, slicePlanes]);

  if (!layerState.visible) return null;

  return (
    <group
      position={skeletonPos}
      onClick={(e) => {
        e.stopPropagation();
        if (e.object?.name) {
          if (onSelectMesh) onSelectMesh(e.object.name);
          if (onSelectOrgan) onSelectOrgan("skeleton");
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

/**
 * Assembled Human Body Component
 * Integrates skeleton, muscular layer (toggleable), and all visceral organs
 * with gender dimorphism and non-overlapping spread matrix / layered disassembly.
 */
export default function AssembledHumanBody({
  explosionProgress = 0,
  dismantleMode = "grid",
  selectedGender = "male",
  selectedOrganId = null,
  selectedPart = null,
  onSelectOrgan,
  onSelectMesh,
  layers = {},
  sliceMode = "off",
  slicePosition = 0,
  sliceInvert = false,
}) {
  const slicePlanes = useMemo(() => {
    if (!sliceMode || sliceMode === "off") return [];
    let normal = new THREE.Vector3(0, -1, 0);
    if (sliceMode === "axial") {
      normal = new THREE.Vector3(0, sliceInvert ? 1 : -1, 0);
    } else if (sliceMode === "sagittal") {
      normal = new THREE.Vector3(sliceInvert ? 1 : -1, 0, 0);
    } else if (sliceMode === "coronal") {
      normal = new THREE.Vector3(0, 0, sliceInvert ? 1 : -1);
    }
    const constant = sliceInvert ? -slicePosition : slicePosition;
    return [new THREE.Plane(normal, constant)];
  }, [sliceMode, slicePosition, sliceInvert]);

  const isFemale = selectedGender === "female";

  // Staged progressive loading prevents tunnel/remote bandwidth saturation from blocking core anatomy
  const [loadStage, setLoadStage] = useState(1);
  useEffect(() => {
    const t2 = setTimeout(() => setLoadStage((s) => Math.max(s, 2)), 320);
    const t3 = setTimeout(() => setLoadStage((s) => Math.max(s, 3)), 850);
    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <group>
      {/* 1. Complete Articulated Skeletal Framework (Android Male vs Gynecoid Female) */}
      <SafeOrganSlot label="skeleton" resetKey={selectedGender}>
        <SkeletonFrameworkMesh
          url="/bodyparts3d-skeleton.glb"
          explosionProgress={explosionProgress}
          dismantleMode={dismantleMode}
          selectedGender={selectedGender}
          selectedOrganId={selectedOrganId}
          selectedPart={selectedPart}
          onSelectOrgan={onSelectOrgan}
          onSelectMesh={onSelectMesh}
          layers={layers}
          slicePlanes={slicePlanes}
        />
      </SafeOrganSlot>

      {/* Optional Superficial & Deep Musculature Layer (mounts dynamically when visible) */}
      {loadStage >= 2 && layers.muscular?.visible && (
        <SafeOrganSlot label="muscular" resetKey={selectedGender}>
          <MusculatureLayerMesh
            explosionProgress={explosionProgress}
            dismantleMode={dismantleMode}
            selectedGender={selectedGender}
            layers={layers}
            slicePlanes={slicePlanes}
            onSelectOrgan={onSelectOrgan}
            onSelectMesh={onSelectMesh}
          />
        </SafeOrganSlot>
      )}

      {/* 2. Brain cleanly tucked inside the cranial vault (Tier 3 heavy 11.4 MB mesh) */}
      {loadStage >= 3 && (
        <SafeOrganSlot label="brain" resetKey={selectedGender}>
          <VisceralOrganMesh
            organId="brain"
            url="/hra-brain.glb"
            nativeCenter={[0, 1.85, -0.02]}
            localOffset={[0, 0.345, -0.028]}
            scale={[1.84, 1.82, 1.84]}
            gridTarget={[0, 1.55, 0]}
            layeredOffset={[-0.8, -0.32, 0.25]}
            explosionProgress={explosionProgress}
            dismantleMode={dismantleMode}
            selectedOrganId={selectedOrganId}
            selectedPart={selectedPart}
            onSelectOrgan={onSelectOrgan}
            layers={layers}
            systemId="nervous"
            slicePlanes={slicePlanes}
          />
        </SafeOrganSlot>
      )}

      {/* 2b. Male Larynx (Adam's Apple prominence) vs Female Endocrine Thyroid Gland */}
      {!isFemale ? (
        <SafeOrganSlot label="larynx" resetKey={selectedGender}>
          <VisceralOrganMesh
            organId="larynx"
            url="/hra-larynx.glb"
            nativeCenter={[0, 1.54, 0.10]}
            localOffset={[0, 0.01, 0.025]}
            scale={[2.42, 2.42, 2.55]}
            gridTarget={[-1.15, 1.55, 0.2]}
            layeredOffset={[-0.8, -0.42, 0.35]}
            explosionProgress={explosionProgress}
            dismantleMode={dismantleMode}
            selectedOrganId={selectedOrganId}
            selectedPart={selectedPart}
            onSelectOrgan={onSelectOrgan}
            layers={layers}
            systemId="respiratory"
            slicePlanes={slicePlanes}
          />
        </SafeOrganSlot>
      ) : (
        <ProceduralInBodyOrgan
          organId="thyroid"
          proceduralType="thyroid"
          nativeCenter={[0, 1.48, 0.085]}
          gridTarget={[-1.15, 1.55, 0.2]}
          layeredOffset={[-0.8, -0.42, 0.35]}
          scale={0.078}
          explosionProgress={explosionProgress}
          dismantleMode={dismantleMode}
          selectedOrganId={selectedOrganId}
          selectedPart={selectedPart}
          onSelectOrgan={onSelectOrgan}
          layers={layers}
          systemId="endocrine"
          slicePlanes={slicePlanes}
        />
      )}

      {/* 3. Eyes seated inside Left & Right Orbital Sockets */}
      <SafeOrganSlot label="eyes" resetKey={selectedGender}>
        <VisceralOrganMesh
          organId="eyes"
          url="/hra-eye.glb"
          nativeCenter={[0.052, 1.805, 0.128]}
          localOffset={[-0.01, 0.428, -0.015]}
          gridTarget={[2.25, 1.55, 0]}
          layeredOffset={[-0.8, -0.32, 0.45]}
          scale={[1.7, 1.7, 1.7]}
          explosionProgress={explosionProgress}
          dismantleMode={dismantleMode}
          selectedOrganId={selectedOrganId}
          selectedPart={selectedPart}
          onSelectOrgan={onSelectOrgan}
          layers={layers}
          systemId="sensory"
          slicePlanes={slicePlanes}
        />
        <VisceralOrganMesh
          organId="eyes"
          url="/hra-eye.glb"
          nativeCenter={[-0.052, 1.805, 0.128]}
          localOffset={[0.01, 0.428, -0.015]}
          gridTarget={[2.07, 1.55, 0]}
          layeredOffset={[-0.8, -0.32, 0.45]}
          scale={[-1.7, 1.7, 1.7]}
          explosionProgress={explosionProgress}
          dismantleMode={dismantleMode}
          selectedOrganId={selectedOrganId}
          selectedPart={selectedPart}
          onSelectOrgan={onSelectOrgan}
          layers={layers}
          systemId="sensory"
          slicePlanes={slicePlanes}
          hideBadge
        />
      </SafeOrganSlot>

      {/* 4. Lungs in thoracic ribcage (Tier 2 10.4 MB mesh) */}
      {loadStage >= 2 && (
        <SafeOrganSlot label="lungs" resetKey={selectedGender}>
          <VisceralOrganMesh
            organId="lungs"
            url="/hra-lungs.glb"
            nativeCenter={[0.005, 1.155, -0.018]}
            localOffset={isFemale ? [-0.005, 0.145, -0.023] : [-0.005, 0.095, -0.023]}
            scale={[isFemale ? 1.88 : 2.16, isFemale ? 2.02 : 2.12, isFemale ? 1.86 : 2.08]}
            gridTarget={[-2.25, 0.95, 0]}
            layeredOffset={[0.55, -0.08, 0.25]}
            explosionProgress={explosionProgress}
            dismantleMode={dismantleMode}
            selectedOrganId={selectedOrganId}
            selectedPart={selectedPart}
            onSelectOrgan={onSelectOrgan}
            layers={layers}
            systemId="respiratory"
            slicePlanes={slicePlanes}
          />
        </SafeOrganSlot>
      )}

      {/* 5. Heart in middle mediastinum */}
      <SafeOrganSlot label="heart" resetKey={selectedGender}>
        <VisceralOrganMesh
          organId="heart"
          url="/hra-heart.glb"
          nativeCenter={[0.042, 1.10, 0.062]}
          localOffset={isFemale ? [0.005, 0.138, -0.012] : [0.001, 0.081, -0.018]}
          scale={[isFemale ? 1.96 : 2.18, isFemale ? 2.02 : 2.14, isFemale ? 1.96 : 2.14]}
          gridTarget={[0, 0.95, 0.65]}
          layeredOffset={[0.5, -0.38, 0.62]}
          explosionProgress={explosionProgress}
          dismantleMode={dismantleMode}
          selectedOrganId={selectedOrganId}
          selectedPart={selectedPart}
          onSelectOrgan={onSelectOrgan}
          layers={layers}
          systemId="circulatory"
          slicePlanes={slicePlanes}
        />
      </SafeOrganSlot>

      {/* 6. Systemic Vasculature Tree (Tier 3 heavy 17.2 MB mesh) */}
      {loadStage >= 3 && (
        <SafeOrganSlot label="vasculature" resetKey={selectedGender}>
          <VisceralOrganMesh
            organId="vasculature"
            url="/hra-vasculature.glb"
            nativeCenter={[0.014, 0.911, 0.007]}
            gridTarget={[2.25, 0.85, 0]}
            layeredOffset={[-0.8, -0.2, 0.05]}
            explosionProgress={explosionProgress}
            dismantleMode={dismantleMode}
            selectedOrganId={selectedOrganId}
            selectedPart={selectedPart}
            onSelectOrgan={onSelectOrgan}
            layers={layers}
            systemId="circulatory"
            slicePlanes={slicePlanes}
          />
        </SafeOrganSlot>
      )}

      {/* 7. Liver in right hypochondrium (tucks inside female vs male costal margin) */}
      <SafeOrganSlot label="liver" resetKey={selectedGender}>
        <VisceralOrganMesh
          organId="liver"
          url="/hra-liver.glb"
          nativeCenter={[-0.082, 0.855, -0.012]}
          localOffset={isFemale ? [-0.012, 0.142, -0.032] : [-0.005, 0.098, -0.034]}
          scale={[isFemale ? 1.84 : 2.04, isFemale ? 1.94 : 2.06, isFemale ? 1.78 : 1.94]}
          gridTarget={[-2.25, 0.15, 0]}
          layeredOffset={[1.85, 0.18, 0.2]}
          explosionProgress={explosionProgress}
          dismantleMode={dismantleMode}
          selectedOrganId={selectedOrganId}
          selectedPart={selectedPart}
          onSelectOrgan={onSelectOrgan}
          layers={layers}
          systemId="digestive"
          slicePlanes={slicePlanes}
        />
      </SafeOrganSlot>

      {/* 7b. Sculpted Stomach in left epigastrium */}
      <ProceduralInBodyOrgan
        organId="stomach"
        proceduralType="stomach"
        nativeCenter={[0.085, 0.785, 0.055]}
        gridTarget={[-1.32, 0.28, 0.25]}
        layeredOffset={[1.8, -0.3, 0.45]}
        scale={isFemale ? 0.12 : 0.128}
        explosionProgress={explosionProgress}
        dismantleMode={dismantleMode}
        selectedOrganId={selectedOrganId}
        selectedPart={selectedPart}
        onSelectOrgan={onSelectOrgan}
        layers={layers}
        systemId="digestive"
        slicePlanes={slicePlanes}
      />

      {/* 8. Cohesive Coiled Small Intestine nestled inside colonic frame */}
      <ProceduralInBodyOrgan
        organId="small_intestine"
        proceduralType="small_intestine"
        nativeCenter={[0.0, 0.5, 0.035]}
        scale={isFemale ? 0.142 : 0.155}
        gridTarget={[0, 0.15, 0.65]}
        layeredOffset={[1.75, -0.78, 0.35]}
        explosionProgress={explosionProgress}
        dismantleMode={dismantleMode}
        selectedOrganId={selectedOrganId}
        selectedPart={selectedPart}
        onSelectOrgan={onSelectOrgan}
        layers={layers}
        systemId="digestive"
        slicePlanes={slicePlanes}
      />

      {/* 9. Large Intestine / Colon framing abdomen within iliac crests */}
      {loadStage >= 2 && (
        <SafeOrganSlot label="large_intestine" resetKey={selectedGender}>
          <VisceralOrganMesh
            organId="large_intestine"
            url="/hra-large-intestine.glb"
            nativeCenter={[0.0, 0.45, 0.015]}
            localOffset={isFemale ? [-0.022, 0.155, -0.042] : [-0.022, 0.145, -0.045]}
            scale={[isFemale ? 1.56 : 1.66, isFemale ? 1.58 : 1.62, isFemale ? 1.38 : 1.44]}
            gridTarget={[2.25, 0.15, 0]}
            layeredOffset={[1.8, -1.28, 0.15]}
            explosionProgress={explosionProgress}
            dismantleMode={dismantleMode}
            selectedOrganId={selectedOrganId}
            selectedPart={selectedPart}
            onSelectOrgan={onSelectOrgan}
            layers={layers}
            systemId="digestive"
            slicePlanes={slicePlanes}
          />
        </SafeOrganSlot>
      )}

      {/* 10. Bilateral Kidneys in posterior retroperitoneum */}
      {loadStage >= 2 && (
        <SafeOrganSlot label="kidneys" resetKey={selectedGender}>
          <VisceralOrganMesh
            organId="kidneys"
            url="/hra-kidney.glb"
            nativeCenter={[0.166, 0.703, -0.064]}
            gridTarget={[-2.25, -0.58, 0]}
            layeredOffset={[0.38, -0.68, 0.2]}
            explosionProgress={explosionProgress}
            dismantleMode={dismantleMode}
            selectedOrganId={selectedOrganId}
            selectedPart={selectedPart}
            onSelectOrgan={onSelectOrgan}
            layers={layers}
            systemId="urinary"
            slicePlanes={slicePlanes}
          />
        </SafeOrganSlot>
      )}

      {/* 11. Urinary Bladder in true pelvic basin */}
      <SafeOrganSlot label="bladder" resetKey={selectedGender}>
        <VisceralOrganMesh
          organId="bladder"
          url="/hra-bladder.glb"
          nativeCenter={[-0.012, 0.07, 0.02]}
          localOffset={[0, 0, -0.025]}
          gridTarget={[0, -0.58, 0.55]}
          layeredOffset={[0.55, -0.58, 0.42]}
          explosionProgress={explosionProgress}
          dismantleMode={dismantleMode}
          selectedOrganId={selectedOrganId}
          selectedPart={selectedPart}
          onSelectOrgan={onSelectOrgan}
          layers={layers}
          systemId="urinary"
          slicePlanes={slicePlanes}
        />
      </SafeOrganSlot>

      {/* 12. Female Reproductive: Uterus & Bilateral Ovaries/Tubes (Female Body) */}
      {isFemale && (
        <>
          {loadStage >= 2 && (
            <SafeOrganSlot label="uterus" resetKey={selectedGender}>
              <VisceralOrganMesh
                organId="uterus"
                url="/hra-uterus.glb"
                nativeCenter={[0, 0.11, -0.02]}
                localOffset={[0.031, 0.06, 0.095]}
                scale={[2.45, 2.45, 2.45]}
                gridTarget={[2.25, -0.58, 0]}
                layeredOffset={[0.55, -0.95, 0.35]}
                explosionProgress={explosionProgress}
                dismantleMode={dismantleMode}
                selectedOrganId={selectedOrganId}
                selectedPart={selectedPart}
                onSelectOrgan={onSelectOrgan}
                layers={layers}
                systemId="reproductive"
                slicePlanes={slicePlanes}
              />
            </SafeOrganSlot>
          )}
          <ProceduralInBodyOrgan
            organId="ovaries"
            proceduralType="ovaries"
            nativeCenter={[0, 0.185, 0.05]}
            gridTarget={[1.25, -0.58, 0.35]}
            layeredOffset={[0.55, -1.25, 0.42]}
            scale={0.16}
            explosionProgress={explosionProgress}
            dismantleMode={dismantleMode}
            selectedOrganId={selectedOrganId}
            selectedPart={selectedPart}
            onSelectOrgan={onSelectOrgan}
            layers={layers}
            systemId="reproductive"
            slicePlanes={slicePlanes}
          />
        </>
      )}

      {/* 13. Male Reproductive: Sculpted Prostate & Bilateral Testes (Male Body) */}
      {!isFemale && (
        <>
          <ProceduralInBodyOrgan
            organId="prostate"
            proceduralType="prostate"
            nativeCenter={[0, 0.02, 0.025]}
            gridTarget={[2.25, -0.58, 0]}
            layeredOffset={[0.55, -0.95, 0.35]}
            scale={0.125}
            explosionProgress={explosionProgress}
            dismantleMode={dismantleMode}
            selectedOrganId={selectedOrganId}
            selectedPart={selectedPart}
            onSelectOrgan={onSelectOrgan}
            layers={layers}
            systemId="reproductive"
            slicePlanes={slicePlanes}
          />
          <ProceduralInBodyOrgan
            organId="testes"
            proceduralType="testes"
            nativeCenter={[0, -0.17, 0.06]}
            gridTarget={[1.25, -0.58, 0.35]}
            layeredOffset={[0.55, -1.25, 0.42]}
            scale={0.115}
            explosionProgress={explosionProgress}
            dismantleMode={dismantleMode}
            selectedOrganId={selectedOrganId}
            selectedPart={selectedPart}
            onSelectOrgan={onSelectOrgan}
            layers={layers}
            systemId="reproductive"
            slicePlanes={slicePlanes}
          />
        </>
      )}
    </group>
  );
}
