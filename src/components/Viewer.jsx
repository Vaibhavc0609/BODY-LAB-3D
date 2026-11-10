/* eslint-disable react-hooks/immutability, react-hooks/set-state-in-effect */
import { useRef, useEffect, useState, useMemo, useCallback, Suspense, Component } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  useGLTF,
  useProgress,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import {
  normalizeGLTF,
  TARGET_MODEL_SIZE,
} from "../utils/modelNormalization";
import {
  calculateCameraFit,
  applyCameraFit,
  DEFAULT_SAFETY_MARGIN,
  DEFAULT_VIEW_DIR,
} from "../utils/cameraFit";
import {
  buildExplodedComponents,
  applyExplosionProgress,
  inferSystemFromName,
} from "../utils/explodedView";
import { ORGANS, getAnatomicalDataForPart } from "../data/anatomyData";
import AssembledHumanBody from "./AssembledHumanBody";
import ProceduralOrganModel from "./ProceduralOrgans";
import { evaluateStoryKeyframe } from "../utils/storyKeyframes";

const WHOLE_BODY_BOX = new THREE.Box3(
  new THREE.Vector3(-0.95, -2.05, -0.35),
  new THREE.Vector3(0.95, 2.08, 0.35)
);

function CanvasLoadingOverlay({ modelUrl }) {
  const { progress, active, loaded } = useProgress();
  if (!modelUrl || !active || progress >= 100) return null;
  const isCompact = loaded > 0;
  return (
    <div className={`viewer-loader-overlay ${isCompact ? "compact" : ""}`}>
      <div className="loader-pulse-ring" />
      <div className="loader-bar">
        <div className="loader-fill" style={{ width: `${Math.round(progress)}%` }} />
      </div>
      <p className="loader-text">
        {isCompact
          ? `${Math.round(progress)}% STREAMING ANATOMY`
          : `${Math.round(progress)}% LOADING 3D MODEL`}
      </p>
    </div>
  );
}

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.warn("3D Model load fallback triggered:", error, info);
    if (this.props.onFallback) {
      setTimeout(() => this.props.onFallback(), 50);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modelUrl !== this.props.modelUrl) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.01, 0.01, 0.01]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        </group>
      );
    }
    return this.props.children;
  }
}

/**
 * Camera controller managing authoritative fitting, 360 rotation transitions,
 * organ focusing, and preset angles.
 */
function CameraRig({
  fitRequest,
  onFitDone,
  focusTarget,
  onFocusDone,
  onCameraTelemetry,
  viewPreset,
  viewPresetSeq = 0,
  onViewPresetDone,
  explosionProgress = 0,
  dismantleMode = "layered",
  isStoryMode = false,
  isIsolated = false,
  storyProgressRef = null,
  zoomTrigger = null,
}) {
  const { camera, size } = useThree();
  const controls = useThree((s) => s.controls);
  const baseDistanceRef = useRef(null);
  const prevExplodeRef = useRef({ progress: explosionProgress, mode: dismantleMode });
  const prevViewPresetSeqRef = useRef(viewPresetSeq);
  const prevZoomSeqRef = useRef(zoomTrigger?.seq || 0);
  const prevStoryModeRef = useRef(isStoryMode);
  const lastPresetTimeRef = useRef(0);
  const initControlsRef = useRef(false);
  const storyTmpPos = useMemo(() => new THREE.Vector3(), []);
  const storyTmpTarget = useMemo(() => new THREE.Vector3(), []);

  const onFitDoneRef = useRef(onFitDone);
  const onFocusDoneRef = useRef(onFocusDone);
  const onViewPresetDoneRef = useRef(onViewPresetDone);
  const onTelemetryRef = useRef(onCameraTelemetry);
  const explodeStateRef = useRef({ explosionProgress, dismantleMode });

  useEffect(() => {
    onFitDoneRef.current = onFitDone;
    onFocusDoneRef.current = onFocusDone;
    onViewPresetDoneRef.current = onViewPresetDone;
    onTelemetryRef.current = onCameraTelemetry;
    explodeStateRef.current = { explosionProgress, dismantleMode };
  }, [onFitDone, onFocusDone, onViewPresetDone, onCameraTelemetry, explosionProgress, dismantleMode]);

  useEffect(() => {
    if (controls && !initControlsRef.current) {
      initControlsRef.current = true;
      if (!focusTarget) {
        controls.target.set(0, 0, 0);
        controls.update();
      }
    }
  }, [controls, focusTarget]);

  // Dynamic automatic camera framing adaptation strictly when explosion slider/mode changes outside story mode
  useEffect(() => {
    if (
      prevExplodeRef.current.progress === explosionProgress &&
      prevExplodeRef.current.mode === dismantleMode
    ) {
      return;
    }
    prevExplodeRef.current = { progress: explosionProgress, mode: dismantleMode };
    if (isStoryMode || !controls) return;
    if (baseDistanceRef.current === null) {
      baseDistanceRef.current = camera.position.distanceTo(controls.target) || 5.8;
    }
    const extraDist = dismantleMode === "grid" ? explosionProgress * 3.6 : explosionProgress * 3.0;
    const targetDist = baseDistanceRef.current + extraDist;
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    if (dir.lengthSq() > 0.001) {
      camera.position.copy(controls.target).addScaledVector(dir, targetDist);
    }
  }, [explosionProgress, dismantleMode, isStoryMode, controls, camera]);

  const transitionRef = useRef({
    active: false,
    startTime: 0,
    duration: 650,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
  });

  useEffect(() => {
    if (!fitRequest || !fitRequest.box) return;

    const fit = calculateCameraFit(camera, fitRequest.box, {
      aspect: size.width / size.height,
      safetyMargin: fitRequest.safetyMargin || DEFAULT_SAFETY_MARGIN,
      direction: fitRequest.direction || DEFAULT_VIEW_DIR,
      target: fitRequest.target || undefined,
    });

    baseDistanceRef.current = fit.distance;

    const { progress: curProg, mode: curMode } = {
      progress: explodeStateRef.current.explosionProgress,
      mode: explodeStateRef.current.dismantleMode,
    };
    if (curProg > 0.001) {
      const extraDist = curMode === "grid" ? curProg * 3.6 : curProg * 3.0;
      const dir = new THREE.Vector3().subVectors(fit.position, fit.target).normalize();
      fit.position.copy(fit.target).addScaledVector(dir, fit.distance + extraDist);
    }

    if (fitRequest.immediate) {
      applyCameraFit(camera, controls, fit);
      transitionRef.current.active = false;
    } else {
      const curPos = camera.position.clone();
      const curTarget = controls ? controls.target.clone() : new THREE.Vector3();

      transitionRef.current = {
        active: true,
        startTime: performance.now(),
        duration: 300,
        startPos: curPos,
        endPos: fit.position.clone(),
        startTarget: curTarget,
        endTarget: fit.target.clone(),
      };

      camera.near = fit.near;
      camera.far = fit.far;
      camera.updateProjectionMatrix();

      if (controls) {
        controls.minDistance = Math.max(0.1, fit.distance * 0.15);
        controls.maxDistance = Math.max(15, fit.distance * 4.0);
      }
    }

    if (onTelemetryRef.current) {
      onTelemetryRef.current({
        cameraType: "PerspectiveCamera",
        vFovDeg: fit.vFovDeg,
        hFovDeg: fit.hFovDeg,
        limitingFovDeg: fit.limitingFovDeg,
        aspect: +(size.width / size.height).toFixed(3),
        fitDistance: fit.fitDistance,
        actualDistance: fit.distance,
        position: fit.position,
        target: fit.target,
        near: fit.near,
        far: fit.far,
      });
    }

    if (onFitDoneRef.current) onFitDoneRef.current();
  }, [fitRequest, camera, controls, size]);

  // Handle smooth zoom-to-organ focusing
  useEffect(() => {
    if (!focusTarget || !controls) return;

    let targetBox = null;

    if (focusTarget.mesh) {
      targetBox = new THREE.Box3().setFromObject(focusTarget.mesh);
    } else if (focusTarget.coordinates) {
      const targetCenter = new THREE.Vector3(
        focusTarget.coordinates.x,
        focusTarget.coordinates.y,
        focusTarget.coordinates.z
      );
      targetBox = new THREE.Box3().setFromCenterAndSize(
        targetCenter,
        new THREE.Vector3(0.55, 0.55, 0.55)
      );
    }

    if (!targetBox || targetBox.isEmpty()) return;

    const fit = calculateCameraFit(camera, targetBox, {
      aspect: size.width / size.height,
      safetyMargin: 1.35,
      direction: DEFAULT_VIEW_DIR,
    });

    baseDistanceRef.current = fit.distance;

    camera.near = Math.min(0.05, fit.near);
    camera.far = Math.max(200, fit.far);
    camera.updateProjectionMatrix();

    transitionRef.current = {
      active: true,
      startTime: performance.now(),
      duration: 420,
      startPos: camera.position.clone(),
      endPos: fit.position.clone(),
      startTarget: controls ? controls.target.clone() : new THREE.Vector3(),
      endTarget: fit.target.clone(),
    };

    if (controls) {
      controls.minDistance = Math.max(0.1, fit.distance * 0.15);
      controls.maxDistance = Math.max(15, fit.distance * 4.0);
    }

    if (onFocusDoneRef.current) onFocusDoneRef.current();
  }, [focusTarget, camera, controls, size]);

  // Handle explicit preset viewpoint button clicks (only fires when seq increments after mount)
  useEffect(() => {
    if (!viewPreset || viewPresetSeq === prevViewPresetSeqRef.current) return;
    prevViewPresetSeqRef.current = viewPresetSeq;
    lastPresetTimeRef.current = performance.now();

    const target = controls ? controls.target.clone() : new THREE.Vector3(0, 0, 0);
    if (!isIsolated && target.distanceTo(new THREE.Vector3(0, 0, 0)) > 0.15) {
      target.set(0, 0, 0);
    }
    const currentDist = !isIsolated
      ? baseDistanceRef.current || 5.8
      : camera.position.distanceTo(controls ? controls.target : new THREE.Vector3(0, 0, 0)) || 5.8;
    const endPos = target.clone();

    switch (viewPreset) {
      case "front":
        endPos.add(new THREE.Vector3(0, 0.05, currentDist));
        break;
      case "back":
        endPos.add(new THREE.Vector3(0, 0.05, -currentDist));
        break;
      case "side":
      case "left":
        endPos.add(new THREE.Vector3(-currentDist, 0.05, 0));
        break;
      case "right":
        endPos.add(new THREE.Vector3(currentDist, 0.05, 0));
        break;
      case "top":
        endPos.add(new THREE.Vector3(0, currentDist, 0.05));
        break;
      case "perspective":
      case "iso":
        endPos.add(new THREE.Vector3(currentDist * 0.72, currentDist * 0.45, currentDist * 0.72));
        break;
      default:
        endPos.add(new THREE.Vector3(0, 0.05, currentDist));
    }

    transitionRef.current = {
      active: true,
      startTime: performance.now(),
      duration: 280,
      startPos: camera.position.clone(),
      endPos,
      startTarget: target.clone(),
      endTarget: target.clone(),
    };

    if (onViewPresetDoneRef.current) onViewPresetDoneRef.current();
  }, [viewPreset, viewPresetSeq, isIsolated, camera, controls]);

  // Smoothly return camera to centered whole-body framing when scrolling/switching from Story Mode -> Workbench
  useEffect(() => {
    const wasStory = prevStoryModeRef.current;
    prevStoryModeRef.current = isStoryMode;

    if (wasStory && !isStoryMode && !isIsolated && !focusTarget) {
      const recentlyPresetted = performance.now() - lastPresetTimeRef.current < 650;
      if (!recentlyPresetted) {
        const fit = calculateCameraFit(camera, WHOLE_BODY_BOX, {
          aspect: size.width / size.height,
          safetyMargin: DEFAULT_SAFETY_MARGIN,
          direction: DEFAULT_VIEW_DIR,
        });
        baseDistanceRef.current = fit.distance;
        transitionRef.current = {
          active: true,
          startTime: performance.now(),
          duration: 450,
          startPos: camera.position.clone(),
          endPos: fit.position.clone(),
          startTarget: controls ? controls.target.clone() : new THREE.Vector3(),
          endTarget: fit.target.clone(),
        };
      }
    }
  }, [isStoryMode, isIsolated, focusTarget, camera, controls, size]);

  // Smooth zoom step buttons inside Workbench
  useEffect(() => {
    if (!zoomTrigger || zoomTrigger.seq === prevZoomSeqRef.current) return;
    prevZoomSeqRef.current = zoomTrigger.seq;
    const target = controls ? controls.target.clone() : new THREE.Vector3(0, 0, 0);
    const vec = new THREE.Vector3().subVectors(camera.position, target);
    const curDist = vec.length() || 5.8;
    const nextDist = Math.max(0.9, Math.min(18.0, curDist * zoomTrigger.factor));
    vec.normalize().multiplyScalar(nextDist);
    const endPos = target.clone().add(vec);
    transitionRef.current = {
      active: true,
      startTime: performance.now(),
      duration: 240,
      startPos: camera.position.clone(),
      endPos,
      startTarget: target,
      endTarget: target.clone(),
    };
  }, [zoomTrigger, camera, controls]);

  useFrame((state, delta) => {
    if (isStoryMode && !focusTarget && !transitionRef.current.active) {
      const p = storyProgressRef ? storyProgressRef.current : 0;
      const kf = evaluateStoryKeyframe(p);
      const swayX = Math.sin(state.clock.elapsedTime * 0.48) * kf.swayAmp;
      storyTmpPos.set(kf.pos[0] + swayX, kf.pos[1], kf.pos[2]);
      storyTmpTarget.set(kf.target[0], kf.target[1], kf.target[2]);

      const alpha = Math.min(1, 1 - Math.exp(-Math.min(delta, 0.08) * 6.5));
      camera.position.lerp(storyTmpPos, alpha);
      if (controls) {
        controls.target.lerp(storyTmpTarget, alpha);
        controls.update();
      } else {
        camera.lookAt(storyTmpTarget);
      }
      return;
    }

    if (!transitionRef.current.active) return;

    const { startTime, duration, startPos, endPos, startTarget, endTarget } =
      transitionRef.current;
    const elapsed = performance.now() - startTime;
    const t = Math.min(1, Math.max(0, elapsed / duration));
    const ease = 1 - Math.pow(1 - t, 4);

    camera.position.lerpVectors(startPos, endPos, ease);
    const curTarget = new THREE.Vector3().lerpVectors(startTarget, endTarget, ease);
    if (controls) {
      controls.target.copy(curTarget);
      controls.update();
    } else {
      camera.lookAt(curTarget);
    }

    if (t >= 1) {
      transitionRef.current.active = false;
    }
  });

  return null;
}

/**
 * 3D to 2D Screen Tracker for Organ Callout Line & Badge (Throttled to prevent 60fps React re-renders)
 */
function CalloutTracker({ targetPos, onScreenPos }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  const prevRef = useRef({ x: -9999, y: -9999, nullSent: false });

  useFrame(() => {
    if (!targetPos) {
      if (!prevRef.current.nullSent) {
        prevRef.current.nullSent = true;
        prevRef.current.x = -9999;
        onScreenPos(null);
      }
      return;
    }
    v.set(targetPos.x, targetPos.y, targetPos.z);
    v.project(camera);
    if (v.z > 1) {
      if (!prevRef.current.nullSent) {
        prevRef.current.nullSent = true;
        prevRef.current.x = -9999;
        onScreenPos(null);
      }
      return;
    }
    const x = (v.x * 0.5 + 0.5) * size.width;
    const y = (-v.y * 0.5 + 0.5) * size.height;
    if (
      prevRef.current.nullSent ||
      Math.abs(x - prevRef.current.x) > 0.75 ||
      Math.abs(y - prevRef.current.y) > 0.75
    ) {
      prevRef.current = { x, y, nullSent: false };
      onScreenPos({ x, y });
    }
  });

  return null;
}

function HotspotPinNode({ hotspot, onSelectHotspot }) {
  const ringRef = useRef();

  useFrame(() => {
    if (ringRef.current) {
      const t = performance.now() * 0.005;
      const s = 1.0 + 0.2 * Math.sin(t);
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group
      position={hotspot.pos}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectHotspot) onSelectHotspot(hotspot);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#e5b869" emissive="#e5b869" emissiveIntensity={0.85} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.055, 0.08, 24]} />
        <meshBasicMaterial color="#e5b869" side={THREE.DoubleSide} transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

/**
 * 3D Interactive Hotspot Pins for Isolated Organ Mode
 */
function OrganHotspots3D({ hotspots = [], onSelectHotspot }) {
  if (!hotspots.length) return null;

  return (
    <group>
      {hotspots.map((h) => (
        <HotspotPinNode key={h.id} hotspot={h} onSelectHotspot={onSelectHotspot} />
      ))}
    </group>
  );
}

/**
 * 3D Holographic CT / MRI Cross-Section Laser Slicing Plane
 */
function SlicePlaneVisualizer({ sliceMode = "off", slicePosition = 0 }) {
  if (!sliceMode || sliceMode === "off") return null;

  const rotation =
    sliceMode === "axial"
      ? [-Math.PI / 2, 0, 0]
      : sliceMode === "sagittal"
      ? [0, Math.PI / 2, 0]
      : [0, 0, 0];

  const position =
    sliceMode === "axial"
      ? [0, slicePosition, 0]
      : sliceMode === "sagittal"
      ? [slicePosition, 0, 0]
      : [0, 0, slicePosition];

  return (
    <group position={position} rotation={rotation}>
      {/* Translucent Laser Cross-Section Plane */}
      <mesh>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Laser Cutting Perimeter Frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.5, 2.5)]} />
        <lineBasicMaterial color="#f59e0b" transparent opacity={0.8} />
      </lineSegments>
      {/* Central Crosshair Guide */}
      <mesh>
        <ringGeometry args={[0.08, 0.085, 32]} />
        <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/**
 * 3D Holographic Anatomical Pin Label with Interactive Leader Line
 */
function FloatingHolographicPin({ organ, isSelected = false, onSelectOrgan }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[organ.coordinates.x, organ.coordinates.y, organ.coordinates.z]}>
      {/* 3D Anchor Node in WebGL space */}
      <mesh>
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshBasicMaterial
          color={isSelected ? "#f3c978" : hovered ? "#fbbf24" : "#ffffff"}
        />
      </mesh>

      {/* HTML Projected Interactive Pin */}
      <Html
        center
        distanceFactor={6.8}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: "auto", userSelect: "none" }}
      >
        <div
          className={`hologram-pin-anchor ${isSelected ? "selected" : ""} ${hovered ? "hovered" : ""}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectOrgan) onSelectOrgan(organ.id);
          }}
        >
          <div className="pin-pulse-dot" />
          <svg className="pin-leader-svg" width="46" height="30" viewBox="0 0 46 30">
            <polyline
              points="0,30 18,10 46,10"
              fill="none"
              stroke="#e5b869"
              strokeWidth="1.6"
              strokeDasharray="2,2"
            />
          </svg>
          <button className="pin-badge-btn" type="button" title={`Inspect ${organ.name}`}>
            <span className="pin-badge-title">{organ.name.split(" ")[0]}</span>
          </button>
        </div>
      </Html>
    </group>
  );
}

/**
 * Normalized 3D Master Model with Multi-Layer Visibility & Clickable Raycasting
 */
function NormalizedGLTFModel({
  url,
  wireframe,
  explosionProgress,
  dismantleMode = "layered",
  layers = {},
  selectedPart,
  selectedOrganId,
  isIsolated,
  onSelectMesh,
  onSelectOrgan,
  onModelLoaded,
  onComponentsAnalyzed,
  spotlightMode = "studio",
  sliceMode = "off",
  slicePosition = 0,
  sliceInvert = false,
}) {
  const { scene } = useGLTF(url);
  const containerRef = useRef();
  const originalMaterialsRef = useRef(new Map());

  // Compute 3D clipping planes for CT / MRI cross-section slicing
  const clippingPlanes = useMemo(() => {
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

  const normalizedData = useMemo(() => {
    if (!scene) return null;
    const freshScene = scene.clone(true);
    return normalizeGLTF(freshScene, { targetSize: TARGET_MODEL_SIZE });
  }, [scene]);

  const modelScene = normalizedData?.modelTransform;

  const organConfigForExplode = useMemo(() => {
    return selectedOrganId ? getAnatomicalDataForPart(selectedOrganId) : null;
  }, [selectedOrganId]);

  const explodedData = useMemo(() => {
    if (!normalizedData?.modelTransform) return null;
    const submeshKeywords =
      isIsolated && organConfigForExplode?.isolateMode === "submesh_focus"
        ? organConfigForExplode.submeshKeywords || []
        : [];
    return buildExplodedComponents(normalizedData.modelTransform, {
      isIsolated: Boolean(isIsolated),
      submeshKeywords,
    });
  }, [normalizedData, isIsolated, organConfigForExplode]);

  const onModelLoadedRef = useRef(onModelLoaded);
  const onComponentsAnalyzedRef = useRef(onComponentsAnalyzed);

  useEffect(() => {
    onModelLoadedRef.current = onModelLoaded;
  }, [onModelLoaded]);

  useEffect(() => {
    onComponentsAnalyzedRef.current = onComponentsAnalyzed;
  }, [onComponentsAnalyzed]);

  useEffect(() => {
    if (normalizedData && onModelLoadedRef.current) {
      onModelLoadedRef.current(normalizedData);
    }
  }, [normalizedData]);

  useEffect(() => {
    if (explodedData && onComponentsAnalyzedRef.current) {
      onComponentsAnalyzedRef.current(explodedData);
    }
  }, [explodedData]);

  // Cache materials
  useEffect(() => {
    if (!modelScene) return;
    const originalMaterials = originalMaterialsRef.current;
    originalMaterials.clear();

    modelScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material = child.material.map((m) => m.clone());
          } else {
            child.material = child.material.clone();
          }

          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            if (m && !originalMaterials.has(m.uuid)) {
              originalMaterials.set(m.uuid, {
                opacity: m.opacity ?? 1,
                transparent: !!m.transparent,
                wireframe: !!m.wireframe,
                color: m.color ? m.color.clone() : new THREE.Color(0xffffff),
                emissive: m.emissive ? m.emissive.clone() : null,
                emissiveIntensity: m.emissiveIntensity ?? 0,
              });
            }
          });
        }
      }
    });

    return () => originalMaterials.clear();
  }, [modelScene]);

  // Wireframe toggle
  useEffect(() => {
    if (!modelScene) return;
    modelScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m) m.wireframe = wireframe;
        });
      }
    });
  }, [modelScene, wireframe]);

  // Apply CT/MRI Cross-Section Clipping Planes to All Meshes
  useEffect(() => {
    if (!modelScene) return;
    modelScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m) {
            m.clippingPlanes = clippingPlanes.length ? clippingPlanes : null;
            m.clipShadows = true;
            m.needsUpdate = true;
          }
        });
      }
    });
  }, [modelScene, clippingPlanes]);

  // Explosion progress with support for layered and grid modes
  useEffect(() => {
    if (!explodedData?.components) return;
    applyExplosionProgress(explodedData.components, explosionProgress, dismantleMode);
  }, [explodedData, explosionProgress, dismantleMode]);

  // Dynamic Layer Visibility, Spotlight Aura & Submesh Focus Isolation
  useEffect(() => {
    if (!modelScene) return;

    const organConfig = selectedOrganId ? getAnatomicalDataForPart(selectedOrganId) : null;
    const hasSubmeshFocus =
      isIsolated &&
      organConfig?.isolateMode === "submesh_focus" &&
      Array.isArray(organConfig.submeshKeywords) &&
      organConfig.submeshKeywords.length > 0;

    // Pre-verify at least 1 mesh matches submeshKeywords before ghosting parent geometry
    let submeshAnyMatch = false;
    if (hasSubmeshFocus) {
      modelScene.traverse((child) => {
        if (!child.isMesh) return;
        const lower = (child.name || "").toLowerCase();
        if (organConfig.submeshKeywords.some((kw) => lower.includes(kw.toLowerCase()))) {
          submeshAnyMatch = true;
        }
      });
    }

    modelScene.traverse((child) => {
      if (!child.isMesh) return;

      const sys = child.userData?.system || inferSystemFromName(child.name);
      const layerState = layers[sys] || { visible: true, opacity: 1.0 };

      const isPartSelected =
        selectedPart && (child.name === selectedPart || child.uuid === selectedPart);
      const isOrganSelected =
        organConfig &&
        (child.name === organConfig.id ||
          (organConfig.meshNames &&
            organConfig.meshNames.some(
              (m) => child.name.toLowerCase().includes(m.toLowerCase())
            )));
      const isSubmeshFocused =
        hasSubmeshFocus &&
        submeshAnyMatch &&
        organConfig.submeshKeywords.some((kw) => (child.name || "").toLowerCase().includes(kw.toLowerCase()));
      const isSelected = isPartSelected || isOrganSelected;

      const mats = Array.isArray(child.material) ? child.material : [child.material];

      mats.forEach((m) => {
        if (!m) return;
        const orig = originalMaterialsRef.current.get(m.uuid);
        if (!orig) return;

        // 1. ISOLATED ORGAN INSPECTION MODE
        if (isIsolated) {
          child.visible = true;

          const isSpecificSubpart =
            selectedPart &&
            selectedPart !== selectedOrganId &&
            (child.name === selectedPart || child.uuid === selectedPart);

          if (hasSubmeshFocus && submeshAnyMatch) {
            if (isSpecificSubpart) {
              m.opacity = 1.0;
              m.transparent = false;
              if (m.emissive) {
                m.emissive.set(0xf3c978);
                m.emissiveIntensity = 0.7;
              }
            } else if (isSubmeshFocused) {
              // Highlight targeted anatomical sub-structure in sharp contrast & natural color
              m.opacity = 1.0;
              m.transparent = false;
              if (orig.color && m.color) m.color.copy(orig.color);
              if (m.emissive) {
                m.emissive.set(0xf3c978);
                m.emissiveIntensity = 0.35;
              }
            } else {
              // Soft glass ghost silhouette for surrounding parent container
              m.opacity = 0.08;
              m.transparent = true;
              if (m.emissive) m.emissive.set(0x000000);
              m.emissiveIntensity = 0;
            }
          } else if (isSpecificSubpart) {
            m.opacity = 1.0;
            m.transparent = false;
            if (m.emissive) {
              m.emissive.set(0xf3c978);
              m.emissiveIntensity = 0.75;
            }
          } else {
            // Natural photorealistic anatomical textures across whole isolated organ
            m.opacity = orig.opacity ?? 1.0;
            m.transparent = !!orig.transparent;
            if (orig.color && m.color) m.color.copy(orig.color);
            if (orig.emissive && m.emissive) {
              m.emissive.copy(orig.emissive);
            } else if (m.emissive) {
              m.emissive.set(0x000000);
            }
            m.emissiveIntensity = orig.emissiveIntensity ?? 0;
            if (orig.wireframe !== undefined) m.wireframe = orig.wireframe;
          }
          m.needsUpdate = true;
          return;
        }

        // 2. NON-ISOLATED / CUSTOM MODEL CONTEXT MODE
        if (!layerState.visible && !isSelected) {
          child.visible = false;
          return;
        }

        if (isSelected) {
          child.visible = true;
          m.opacity = 1.0;
          m.transparent = false;
          if (m.emissive) {
            m.emissive.set(0xf3c978);
            m.emissiveIntensity = 0.75;
          }
        } else if (selectedOrganId || selectedPart) {
          child.visible = true;
          m.opacity = Math.min(layerState.opacity * orig.opacity, 0.16);
          m.transparent = true;
          if (m.emissive) m.emissive.set(0x000000);
          m.emissiveIntensity = 0;
        } else {
          child.visible = true;

          if (spotlightMode === "cyber") {
            m.opacity = layerState.opacity * orig.opacity;
            m.transparent = m.opacity < 0.96;
            if (m.emissive) m.emissive.set(0xe5b869);
            m.emissiveIntensity = 0.28;
          } else if (spotlightMode === "xray") {
            m.opacity = 0.42 * layerState.opacity;
            m.transparent = true;
            if (m.emissive) m.emissive.set(0xd6d3d1);
            m.emissiveIntensity = 0.52;
            m.roughness = 0.12;
            m.metalness = 0.45;
          } else {
            m.opacity = layerState.opacity * orig.opacity;
            m.transparent = m.opacity < 0.96;
            if (orig.emissive && m.emissive) m.emissive.copy(orig.emissive);
            m.emissiveIntensity = orig.emissiveIntensity;
          }
        }
        m.needsUpdate = true;
      });
    });
  }, [modelScene, layers, selectedPart, selectedOrganId, isIsolated, spotlightMode]);

  // Click Raycasting: Identifies ANY sub-part mesh without corrupting active organ GLB
  const handlePointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      let targetMesh = e.object;
      while (targetMesh && !targetMesh.isMesh && targetMesh.parent) {
        targetMesh = targetMesh.parent;
      }
      if (targetMesh && targetMesh.isMesh) {
        const meshName = targetMesh.name || targetMesh.uuid;
        if (onSelectMesh) onSelectMesh(meshName);

        if (!isIsolated) {
          const partData = getAnatomicalDataForPart(meshName, targetMesh);
          if (partData && ORGANS[partData.id] && onSelectOrgan) {
            onSelectOrgan(partData.id);
          }
        }
      }
    },
    [isIsolated, onSelectMesh, onSelectOrgan]
  );

  if (!normalizedData?.normalizedRoot) return null;

  return (
    <primitive
      ref={containerRef}
      object={normalizedData.normalizedRoot}
      onPointerDown={handlePointerDown}
    />
  );
}

/**
 * Cinematic 3D Studio Spotlight System
 * Projects key spotlight from overhead, rear contour rim-light,
 * 3D volumetric light beam shaft, and grounded floor spotlight pool.
 */
function ModelStudioSpotlight({ spotlightMode = "studio", groundY = -1.6 }) {
  const targetRef = useRef();
  const spotLightRef = useRef();
  const rimLightRef = useRef();

  const config = useMemo(() => {
    switch (spotlightMode) {
      case "surgical":
        return {
          key: "#ffffff",
          rim: "#e7e5e4",
          floor: "#fafaf9",
          keyIntensity: 5.2,
          rimIntensity: 3.6,
          ambient: 0.38,
          coneColor: "#ffffff",
          coneOpacity: 0.075,
        };
      case "cyber":
        return {
          key: "#fde68a",
          rim: "#e5b869",
          floor: "#b45309",
          keyIntensity: 5.4,
          rimIntensity: 3.8,
          ambient: 0.35,
          coneColor: "#e5b869",
          coneOpacity: 0.08,
        };
      case "xray":
        return {
          key: "#f5f5f4",
          rim: "#d6d3d1",
          floor: "#78716c",
          keyIntensity: 5.6,
          rimIntensity: 4.0,
          ambient: 0.38,
          coneColor: "#e7e5e4",
          coneOpacity: 0.08,
        };
      case "off":
        return {
          key: "#ffffff",
          rim: "#78716c",
          floor: "#1c1917",
          keyIntensity: 2.0,
          rimIntensity: 1.0,
          ambient: 0.8,
          coneColor: "#ffffff",
          coneOpacity: 0.0,
        };
      case "studio":
      default:
        return {
          key: "#ffffff",
          rim: "#e7e5e4",
          floor: "#ffffff",
          keyIntensity: 5.0,
          rimIntensity: 3.4,
          ambient: 0.36,
          coneColor: "#ffffff",
          coneOpacity: 0.075,
        };
    }
  }, [spotlightMode]);

  useEffect(() => {
    if (targetRef.current) {
      if (spotLightRef.current) spotLightRef.current.target = targetRef.current;
      if (rimLightRef.current) rimLightRef.current.target = targetRef.current;
    }
  }, []);

  const height = 7.0 - groundY;
  const coneY = groundY + height / 2;

  return (
    <group>
      {/* Target anchor directly at anatomical center */}
      <object3D ref={targetRef} position={[0, 0, 0]} />

      {/* Atmospheric Ambient and Fill (Pure warm obsidian & ivory studio spectrum, zero bluish tint) */}
      <ambientLight intensity={config.ambient} color="#1c1917" />
      <hemisphereLight intensity={0.45} groundColor="#070606" color="#fafaf9" />

      {/* Subtle Directional Fill from lower angle (Pure warm studio fill) */}
      <directionalLight position={[-4, 3, 4]} intensity={1.2} color="#e7e5e4" />

      {/* Primary Key Spotlight shining from above-front down at model */}
      <spotLight
        ref={spotLightRef}
        position={[0, 7.0, 3.2]}
        intensity={config.keyIntensity}
        angle={0.62}
        penumbra={0.72}
        distance={22}
        decay={1.2}
        color={config.key}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Dramatic Rear Rim/Silhouette Spotlight (defines 3D outline) */}
      <spotLight
        ref={rimLightRef}
        position={[0, 6.2, -4.5]}
        intensity={config.rimIntensity}
        angle={0.75}
        penumbra={0.8}
        distance={20}
        decay={1.3}
        color={config.rim}
      />

      {/* 3D Volumetric Spotlight Beam Cone descending around model */}
      {spotlightMode !== "off" && (
        <group position={[0, coneY, 0.4]}>
          {/* Outer feathered cone */}
          <mesh rotation={[Math.PI / 22, 0, 0]}>
            <cylinderGeometry args={[0.3, 2.3, height, 36, 1, true]} />
            <meshBasicMaterial
              color={config.coneColor}
              transparent
              opacity={config.coneOpacity}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Inner core beam shaft */}
          <mesh rotation={[Math.PI / 22, 0, 0]}>
            <cylinderGeometry args={[0.15, 1.35, height, 28, 1, true]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={config.coneOpacity * 0.75}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}

      {/* Floor Spotlight Projection Pool on ground */}
      {spotlightMode !== "off" && (
        <group position={[0, groundY + 0.003, 0]}>
          {/* Intense center spotlight puddle */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.25, 64]} />
            <meshBasicMaterial
              color={config.floor}
              transparent
              opacity={0.18}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Outer diffused halo puddle */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.24, 2.05, 64]} />
            <meshBasicMaterial
              color={config.rim}
              transparent
              opacity={0.07}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Floor circular beacon edge rings */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.24, 1.26, 64]} />
            <meshBasicMaterial color={config.floor} transparent opacity={0.4} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.04, 2.06, 64]} />
            <meshBasicMaterial color={config.rim} transparent opacity={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function Viewer({
  modelUrl,
  modelId,
  wireframe,
  autoRotate = false,
  explosionProgress = 0,
  dismantleMode = "layered",
  layers = {},
  selectedGender = "male",
  selectedPart = null,
  selectedOrganId = null,
  isIsolated = false,
  isCustomModel = false,
  showLabels = false,
  onSelectMesh,
  onSelectOrgan,
  focusTarget = null,
  onFocusDone,
  resetCameraTrigger = false,
  onResetCameraDone,
  viewPreset = null,
  viewPresetSeq = 0,
  onViewPresetDone,
  onModelMetadataReady,
  onExplodedDataReady,
  onCameraTelemetry,
  canvasRef,
  onResetModel,
  spotlightMode = "studio",
  sliceMode = "off",
  slicePosition = 0,
  sliceInvert = false,
  isStoryMode = false,
  storyProgressRef = null,
  workbenchZoomEnabled = false,
  zoomTrigger = null,
}) {
  const [activeModelData, setActiveModelData] = useState(null);
  const [fitRequest, setFitRequest] = useState(null);
  const [calloutScreenPos, setCalloutScreenPos] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const prevIsolatedRef = useRef(isIsolated);

  // Reset transient tooltips/bounds cleanly when switching between isolated organ and whole body
  useEffect(() => {
    setActiveHotspot(null);
    if (!selectedOrganId && !selectedPart) {
      setCalloutScreenPos(null);
    }
    if (prevIsolatedRef.current && !isIsolated && !isCustomModel && !focusTarget) {
      setActiveModelData(null);
      setFitRequest({
        box: WHOLE_BODY_BOX,
        safetyMargin: DEFAULT_SAFETY_MARGIN,
        immediate: false,
      });
    }
    prevIsolatedRef.current = isIsolated;
  }, [isIsolated, isCustomModel, selectedOrganId, selectedPart, focusTarget]);

  // Compute 3D clipping planes for procedural organ mode inside isolated view
  const viewerSlicePlanes = useMemo(() => {
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

  const handleModelLoaded = useCallback(
    (metadata) => {
      setActiveModelData(metadata);
      if (onModelMetadataReady) onModelMetadataReady(metadata);

      const box = metadata.normalizedBoundingBox;
      const center = new THREE.Vector3();
      const sizeVec = new THREE.Vector3();
      if (box && !box.isEmpty()) {
        box.getCenter(center);
        box.getSize(sizeVec);
      }
      // Shift target slightly down so the organ sits cleanly above the bottom control bar
      const liftTarget = new THREE.Vector3(
        center.x,
        center.y - Math.max(sizeVec.x, sizeVec.y, sizeVec.z) * 0.14,
        center.z
      );

      setFitRequest({
        box,
        target: liftTarget,
        safetyMargin: 1.72,
        immediate: true,
      });
    },
    [onModelMetadataReady]
  );

  const handleComponentsAnalyzed = useCallback(
    (explodedInfo) => {
      if (onExplodedDataReady) onExplodedDataReady(explodedInfo);
    },
    [onExplodedDataReady]
  );

  useEffect(() => {
    if (!resetCameraTrigger) return;
    const isIsolatedTarget = (isIsolated || isCustomModel) && activeModelData?.normalizedBoundingBox;
    const targetBox = isIsolatedTarget
      ? activeModelData.normalizedBoundingBox
      : WHOLE_BODY_BOX;
    let customTarget;
    if (isIsolatedTarget) {
      const c = new THREE.Vector3();
      const s = new THREE.Vector3();
      targetBox.getCenter(c);
      targetBox.getSize(s);
      customTarget = new THREE.Vector3(c.x, c.y - Math.max(s.x, s.y, s.z) * 0.14, c.z);
    }
    setFitRequest({
      box: targetBox,
      target: customTarget,
      safetyMargin: isIsolatedTarget ? 1.72 : DEFAULT_SAFETY_MARGIN,
      immediate: false,
    });
    if (onResetCameraDone) onResetCameraDone();
  }, [resetCameraTrigger, isIsolated, isCustomModel, activeModelData, onResetCameraDone]);

  const groundY = useMemo(() => {
    if ((isIsolated || isCustomModel) && activeModelData?.normalizedBoundingBox) {
      return activeModelData.normalizedBoundingBox.min.y - 0.02;
    }
    return -2.06;
  }, [isIsolated, isCustomModel, activeModelData]);

  // Resolves full medical data for ANY clicked organ, bone, or muscle
  const selectedOrganData = useMemo(() => {
    return getAnatomicalDataForPart(selectedOrganId || selectedPart);
  }, [selectedOrganId, selectedPart]);

  const organHotspots = useMemo(() => {
    return selectedOrganData?.hotspots || [];
  }, [selectedOrganData]);

  const proceduralType = isIsolated ? selectedOrganData?.proceduralType : null;

  return (
    <div className="viewer-canvas-wrap">
      {/* 2D Loading Overlay */}
      <CanvasLoadingOverlay modelUrl={proceduralType ? null : modelUrl} />

      {/* Theatrical Spotlight Backdrop Effect directly behind 3D Model */}
      <div className={`viewer-spotlight-backdrop spotlight-mode-${spotlightMode}`} aria-hidden="true">
        <div className="spotlight-overhead-emitter" />
        <div className="spotlight-conical-beam" />
        <div className="spotlight-radial-halo" />
        <div className="spotlight-torso-glow" />
        <div className="spotlight-floor-oval" />
        <div className="spotlight-particles-layer">
          <span className="spotlight-mote sm-1" />
          <span className="spotlight-mote sm-2" />
          <span className="spotlight-mote sm-3" />
          <span className="spotlight-mote sm-4" />
          <span className="spotlight-mote sm-5" />
          <span className="spotlight-mote sm-6" />
          <span className="spotlight-mote sm-7" />
          <span className="spotlight-mote sm-8" />
        </div>
      </div>

      {/* 2D DOM 3D-Projected Anatomical Callout Badge (only in Whole-Body context so isolated showcase stays unobstructed) */}
      {calloutScreenPos && selectedOrganData && !isIsolated && (
        <div
          className="callout-overlay-badge"
          style={{
            left: `${calloutScreenPos.x}px`,
            top: `${calloutScreenPos.y}px`,
          }}
        >
          <div className="callout-anchor-point" />
          <svg className="callout-leader-line-svg" width="80" height="36">
            <polyline points="0,0 35,-22 80,-22" fill="none" stroke="#ffffff" strokeWidth="1.8" />
          </svg>
          <div className="callout-card-tag">
            <span className="callout-name">{selectedOrganData.name}</span>
            <span className="callout-latin">{selectedOrganData.latinName}</span>
          </div>
        </div>
      )}

      {/* Active Hotspot Pin Tooltip Popup */}
      {activeHotspot && (
        <div className="hotspot-popup-card">
          <div className="hotspot-popup-header">
            <span className="hotspot-pin-title">{activeHotspot.name}</span>
            <button className="hotspot-popup-close" onClick={() => setActiveHotspot(null)}>
              &times;
            </button>
          </div>
          <p className="hotspot-pin-desc">{activeHotspot.description}</p>
        </div>
      )}

      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0.05, 5.8], fov: 40 }}
        shadows
        dpr={[1, 1.5]}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        onCreated={({ gl, scene, camera }) => {
          gl.localClippingEnabled = true;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          window.__THREE_SCENE__ = scene;
          window.__THREE_CAMERA__ = camera;
        }}
      >
        {/* Cinematic Theatrical 3D Spotlight Architecture */}
        <ModelStudioSpotlight spotlightMode={spotlightMode} groundY={groundY} />

        {/* 3D Holographic CT / MRI Cross-Section Laser Slicing Plane */}
        <SlicePlaneVisualizer sliceMode={sliceMode} slicePosition={slicePosition} />

        {/* Floor Contact Shadow */}
        <ContactShadows
          position={[0, groundY, 0]}
          opacity={spotlightMode === "off" ? 0.3 : 0.6}
          scale={12}
          blur={2.4}
          far={5}
          color="#000000"
        />

        {/* Studio Pedestal Locator Stage Rings */}
        <group position={[0, groundY + 0.002, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.78, 0.80, 64]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.58, 1.60, 64]} />
            <meshBasicMaterial color="#e5e5e5" transparent opacity={0.18} />
          </mesh>
        </group>

        {/* Master Model: Isolated Procedural Organ, Isolated GLB Organ, Custom Uploaded GLB, or Assembled Body */}
        <ModelErrorBoundary modelUrl={modelUrl} onFallback={onResetModel}>
          <Suspense fallback={null}>
            {isCustomModel && modelUrl ? (
              <NormalizedGLTFModel
                key={modelUrl}
                url={modelUrl}
                wireframe={wireframe}
                explosionProgress={explosionProgress}
                dismantleMode={dismantleMode}
                layers={layers}
                selectedPart={selectedPart}
                selectedOrganId={selectedOrganId}
                isIsolated={true}
                onSelectMesh={onSelectMesh}
                onSelectOrgan={onSelectOrgan}
                onModelLoaded={handleModelLoaded}
                onComponentsAnalyzed={handleComponentsAnalyzed}
                spotlightMode={spotlightMode}
                sliceMode={sliceMode}
                slicePosition={slicePosition}
                sliceInvert={sliceInvert}
              />
            ) : isIsolated && proceduralType ? (
              <ProceduralOrganModel
                key={selectedOrganId || proceduralType}
                type={proceduralType}
                explosionProgress={explosionProgress}
                dismantleMode={dismantleMode}
                selectedPart={selectedPart}
                onSelectMesh={onSelectMesh}
                onModelLoaded={handleModelLoaded}
                spotlightMode={spotlightMode}
                clippingPlanes={viewerSlicePlanes}
              />
            ) : isIsolated ? (
              modelUrl && (
                <NormalizedGLTFModel
                  key={modelId || modelUrl}
                  url={modelUrl}
                  wireframe={wireframe}
                  explosionProgress={explosionProgress}
                  dismantleMode={dismantleMode}
                  layers={layers}
                  selectedPart={selectedPart}
                  selectedOrganId={selectedOrganId}
                  isIsolated={isIsolated}
                  onSelectMesh={onSelectMesh}
                  onSelectOrgan={onSelectOrgan}
                  onModelLoaded={handleModelLoaded}
                  onComponentsAnalyzed={handleComponentsAnalyzed}
                  spotlightMode={spotlightMode}
                  sliceMode={sliceMode}
                  slicePosition={slicePosition}
                  sliceInvert={sliceInvert}
                />
              )
            ) : (
              <AssembledHumanBody
                explosionProgress={explosionProgress}
                dismantleMode={dismantleMode}
                selectedGender={selectedGender}
                selectedOrganId={selectedOrganId}
                selectedPart={selectedPart}
                onSelectOrgan={onSelectOrgan}
                onSelectMesh={onSelectMesh}
                layers={layers}
                sliceMode={sliceMode}
                slicePosition={slicePosition}
                sliceInvert={sliceInvert}
              />
            )}
          </Suspense>
        </ModelErrorBoundary>

        {/* Hotspot Pins strictly in Isolated Organ Mode where local normalized coordinates apply */}
        {isIsolated && organHotspots.length > 0 && (
          <OrganHotspots3D
            hotspots={organHotspots}
            onSelectHotspot={(h) => setActiveHotspot(h)}
          />
        )}

        {/* Screen Projector for 2D Callout */}
        {selectedOrganData && !isIsolated && (
          <CalloutTracker
            targetPos={selectedOrganData.coordinates || { x: 0, y: 0, z: 0 }}
            onScreenPos={setCalloutScreenPos}
          />
        )}

        {/* 3D Floating Major Organ Holographic Pin Labels */}
        {showLabels && !isIsolated && (
          <group>
            {Object.values(ORGANS).map((org) => (
              <FloatingHolographicPin
                key={org.id}
                organ={org}
                isSelected={selectedOrganId === org.id}
                onSelectOrgan={onSelectOrgan}
              />
            ))}
          </group>
        )}

        {/* Camera Rig */}
        <CameraRig
          fitRequest={fitRequest}
          onFitDone={() => setFitRequest(null)}
          focusTarget={focusTarget}
          onFocusDone={onFocusDone}
          onCameraTelemetry={onCameraTelemetry}
          viewPreset={viewPreset}
          viewPresetSeq={viewPresetSeq}
          onViewPresetDone={onViewPresetDone}
          explosionProgress={explosionProgress}
          dismantleMode={dismantleMode}
          isStoryMode={isStoryMode}
          isIsolated={isIsolated}
          storyProgressRef={storyProgressRef}
          zoomTrigger={zoomTrigger}
        />

        {/* 360-Degree Full Rotation Controls */}
        <OrbitControls
          makeDefault
          enabled={!isStoryMode}
          enableDamping
          dampingFactor={0.08}
          minDistance={0.5}
          maxDistance={35}
          enableRotate={!isStoryMode}
          autoRotate={autoRotate}
          autoRotateSpeed={1.8}
          enablePan={!isStoryMode}
          enableZoom={!isStoryMode && workbenchZoomEnabled}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />
      </Canvas>

      {/* Empty Stage State */}
      {!modelUrl && (
        <div className="viewer-empty-state">
          <div className="empty-state-card">
            <div className="empty-state-icon">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3>NO 3D MODEL LOADED</h3>
            <p>Select any organ from the Male or Female Organ Library or click "+ Load .GLB" above.</p>
          </div>
        </div>
      )}
    </div>
  );
}
