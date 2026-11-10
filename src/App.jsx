import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Header from "./components/Header";
import Viewer from "./components/Viewer";
import DismantleHeroBar from "./components/DismantleHeroBar";
import OrganDetailsPanel from "./components/OrganDetailsPanel";
import SystemLayersPanel from "./components/SystemLayersPanel";
import ModelLibrary from "./components/ModelLibrary";
import BioOpeningSequence from "./components/BioOpeningSequence";
import RevealBlock from "./components/ScrollReveal";
import { ORGANS, getAnatomicalDataForPart } from "./data/anatomyData";
import { STORY_CHAPTERS, evaluateStoryKeyframe } from "./utils/storyKeyframes";
import "./App.css";

const SYSTEM_STRUCTURE_WEIGHTS = {
  skeletal: 242,
  muscular: 387,
  nervous: 283,
  circulatory: 132,
  respiratory: 74,
  digestive: 65,
  urinary: 34,
  endocrine: 18,
  reproductive: 22,
  sensory: 14,
};

function createInitialLayers() {
  return {
    skeletal: { visible: true, opacity: 1.0 },
    muscular: { visible: false, opacity: 0.9 },
    nervous: { visible: true, opacity: 1.0 },
    circulatory: { visible: true, opacity: 1.0 },
    respiratory: { visible: true, opacity: 1.0 },
    digestive: { visible: true, opacity: 1.0 },
    urinary: { visible: true, opacity: 1.0 },
    endocrine: { visible: true, opacity: 1.0 },
    reproductive: { visible: true, opacity: 1.0 },
    sensory: { visible: true, opacity: 1.0 },
  };
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState("explorer"); // 'explorer' | 'library'
  const [selectedGender, setSelectedGender] = useState("male"); // 'male' | 'female'
  const [selectedOrganId, setSelectedOrganId] = useState(null); // null = whole body
  const [selectedPart, setSelectedPart] = useState(null);
  const [focusTarget, setFocusTarget] = useState(null);
  const [sidebarTab, setSidebarTab] = useState("organs"); // 'organs' | 'layers'

  // Camera & View Settings
  const [viewPreset, setViewPreset] = useState("front");
  const [viewPresetSeq, setViewPresetSeq] = useState(0);
  const [resetCamera, setResetCamera] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dismantle & Exploded View Settings
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [dismantleMode, setDismantleMode] = useState("grid"); // 'grid' | 'layered'
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Cinematic Lighting & CT Laser Slicing
  const [spotlightMode, setSpotlightMode] = useState("studio");
  const [sliceMode, setSliceMode] = useState("off");
  const [slicePosition, setSlicePosition] = useState(0.6);
  const [sliceInvert, setSliceInvert] = useState(false);

  // Custom Uploaded GLB File
  const [customModelUrl, setCustomModelUrl] = useState(null);
  const [customModelName, setCustomModelName] = useState(null);
  const [activeModelStats, setActiveModelStats] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Scrollytelling & Interactive Workbench choreography
  const [inWorkbench, setInWorkbench] = useState(false);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [storyExplode, setStoryExplode] = useState(0);
  const [workbenchZoomEnabled, setWorkbenchZoomEnabled] = useState(false);
  const [zoomTrigger, setZoomTrigger] = useState({ factor: 1, seq: 0 });

  const toastTimeoutRef = useRef(null);
  const explosionRafRef = useRef(null);
  const dismantleTimerRef = useRef(null);
  const storyProgressRef = useRef(0);
  const targetStoryProgressRef = useRef(0);
  const workbenchRef = useRef(null);
  const chapterRefs = useRef([]);
  const progressBarRef = useRef(null);

  const cancelExplosionAnim = useCallback(() => {
    if (dismantleTimerRef.current) {
      clearTimeout(dismantleTimerRef.current);
      dismantleTimerRef.current = null;
    }
    if (explosionRafRef.current) {
      cancelAnimationFrame(explosionRafRef.current);
      explosionRafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cancelExplosionAnim();
  }, [cancelExplosionAnim]);

  // Multi-Layer Anatomical System Visibility & Opacities (all 10 systems)
  const [currentPreset, setCurrentPreset] = useState("skeleton");
  const [soloSystemId, setSoloSystemId] = useState(null);
  const [layers, setLayers] = useState(createInitialLayers);

  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Dynamically filtered organs matching active gender
  const activeGenderOrgans = useMemo(() => {
    return Object.values(ORGANS).filter(
      (o) => !o.genderAvailability || o.genderAvailability.includes(selectedGender)
    );
  }, [selectedGender]);

  // Compute live structures count for Header HUD pill
  const visibleStructuresCount = useMemo(() => {
    if (selectedOrganId) {
      return activeModelStats?.meshCount || ORGANS[selectedOrganId]?.hotspotsCount || 12;
    }
    let count = 0;
    Object.entries(SYSTEM_STRUCTURE_WEIGHTS).forEach(([sysId, weight]) => {
      if (layers[sysId]?.visible) {
        count += weight;
      }
    });
    return selectedGender === "female" ? count + 5 : count;
  }, [selectedOrganId, activeModelStats, layers, selectedGender]);

  // Compute active 3D model URL
  const activeModelUrl = customModelUrl
    ? customModelUrl
    : selectedOrganId && ORGANS[selectedOrganId]?.standaloneModelUrl
    ? ORGANS[selectedOrganId].standaloneModelUrl
    : currentPreset === "muscle" || currentPreset === "full"
    ? "/z-anatomy-body.glb"
    : "/bodyparts3d-skeleton.glb";

  const scrollToWorkbench = useCallback(() => {
    setInWorkbench(true);
    setTimeout(() => {
      workbenchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 30);
  }, []);

  const scrollToStoryTop = useCallback(() => {
    cancelExplosionAnim();
    setIsAutoPlaying(false);
    setExplosionProgress(0);
    setInWorkbench(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cancelExplosionAnim]);

  const scrollToChapter = useCallback((idx) => {
    if (idx === STORY_CHAPTERS.length) {
      scrollToWorkbench();
      return;
    }
    const el = chapterRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [scrollToWorkbench]);

  // Select an organ for isolated 3D inspection & sync gender when sex-specific
  const handleSelectOrgan = useCallback(
    (organId) => {
      cancelExplosionAnim();
      setIsAutoPlaying(false);
      setCustomModelUrl(null);
      setCustomModelName(null);
      setSelectedOrganId(organId);
      setSelectedPart(organId);
      setExplosionProgress(0);
      setSliceMode("off");
      setFocusTarget(null);
      if (organId && ORGANS[organId]?.genderAvailability?.length === 1) {
        setSelectedGender(ORGANS[organId].genderAvailability[0]);
      }
      if (organId) {
        scrollToWorkbench();
      }
    },
    [cancelExplosionAnim, scrollToWorkbench]
  );

  // Return back to assembled human body
  const handleResetToWholeBody = useCallback(() => {
    cancelExplosionAnim();
    setIsAutoPlaying(false);
    setExplosionProgress(0);
    setSelectedOrganId(null);
    setSelectedPart(null);
    setFocusTarget(null);
    setCustomModelUrl(null);
    setCustomModelName(null);
    setActiveModelStats(null);
    setResetCamera(true);
  }, [cancelExplosionAnim]);

  // Switch to whole body & smoothly zoom camera onto target organ
  const handleViewInWholeBody = useCallback(
    (organId) => {
      cancelExplosionAnim();
      setIsAutoPlaying(false);
      const organData = getAnatomicalDataForPart(organId);
      if (organData?.genderAvailability?.length === 1) {
        setSelectedGender(organData.genderAvailability[0]);
      }
      setCustomModelUrl(null);
      setCustomModelName(null);
      setSelectedOrganId(null);
      setSelectedPart(organId);
      setExplosionProgress(0);
      setSliceMode("off");
      if (organData?.coordinates) {
        // Create fresh object reference so CameraRig triggers every time
        setFocusTarget({
          ...organData,
          coordinates: { ...organData.coordinates },
        });
      }
      setView("explorer");
      scrollToWorkbench();
    },
    [cancelExplosionAnim, scrollToWorkbench]
  );

  // Switch Gender cleanly (exit incompatible sex-specific organ if open)
  const handleSelectGender = useCallback(
    (newGender) => {
      setSelectedGender(newGender);
      if (selectedOrganId && ORGANS[selectedOrganId]) {
        const avail = ORGANS[selectedOrganId].genderAvailability || ["male", "female"];
        if (!avail.includes(newGender)) {
          setSelectedOrganId(null);
          setSelectedPart(null);
          setFocusTarget(null);
          showToast(`Switched to ${newGender === "male" ? "Male" : "Female"} Human Body Atlas`);
        }
      }
    },
    [selectedOrganId, showToast]
  );

  // Camera View Preset selection (increments seq so re-clicking active preset always re-aligns)
  const handleSelectViewPreset = useCallback((preset) => {
    setInWorkbench(true);
    setViewPreset(preset);
    setViewPresetSeq((s) => s + 1);
  }, []);

  // Upload custom .glb file (revoke previous blob URL cleanly without StrictMode re-effect revocation)
  const blobUrlsRef = useRef(new Set());
  useEffect(() => {
    const urls = blobUrlsRef.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  const handleUploadModel = useCallback(
    (file) => {
      const objectUrl = URL.createObjectURL(file);
      blobUrlsRef.current.add(objectUrl);
      setCustomModelUrl((prev) => {
        if (prev && prev.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
          blobUrlsRef.current.delete(prev);
        }
        return objectUrl;
      });
      setCustomModelName(file.name);
      setSelectedOrganId(null);
      setSelectedPart(null);
      setExplosionProgress(0);
      setView("explorer");
      scrollToWorkbench();
      showToast(`Loaded Custom GLB: ${file.name}`);
    },
    [showToast, scrollToWorkbench]
  );

  // Camera reset
  const handleResetCamera = useCallback(() => {
    setResetCamera(true);
    setFocusTarget(null);
  }, []);

  // Fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, []);

  // 4K High-Res Screenshot Capture
  const handleScreenshot = useCallback(() => {
    const canvas = document.querySelector(".viewer-canvas-wrap canvas");
    if (!canvas) {
      showToast("Cannot capture: 3D canvas not ready");
      return;
    }
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const title = selectedOrganId ? `organ_${selectedOrganId}` : `${selectedGender}_human_body_atlas`;
      a.download = `${title}_4k_capture.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("4K High-Res Screenshot Captured!");
    } catch (err) {
      console.warn("Screenshot capture error:", err);
      showToast("Screenshot capture failed");
    }
  }, [selectedOrganId, selectedGender, showToast]);

  // Smooth animation for spread and reassembly
  const handleAnimateExplosion = useCallback(
    (targetValue, durationMs = 850, fromValue = null) => {
      cancelExplosionAnim();
      const startVal = fromValue !== null ? fromValue : explosionProgress;
      const startTime = performance.now();
      function step() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(1, elapsed / durationMs);
        const ease = 1 - Math.pow(1 - t, 3);
        setExplosionProgress(startVal + (targetValue - startVal) * ease);
        if (t < 1) {
          explosionRafRef.current = requestAnimationFrame(step);
        } else {
          explosionRafRef.current = null;
        }
      }
      explosionRafRef.current = requestAnimationFrame(step);
    },
    [explosionProgress, cancelExplosionAnim]
  );

  // Open an organ from the Organ Library and smoothly dismantle/expand its structures in 3D
  const handleDismantleOrgan = useCallback(
    (organId) => {
      handleSelectOrgan(organId);
      setDismantleMode("layered");
      setView("explorer");
      dismantleTimerRef.current = setTimeout(() => {
        dismantleTimerRef.current = null;
        handleAnimateExplosion(0.75, 750, 0);
      }, 240);
    },
    [handleSelectOrgan, handleAnimateExplosion]
  );

  // Auto-play continuous cycle loop
  useEffect(() => {
    if (!isAutoPlaying) return;
    let forward = true;
    const interval = setInterval(() => {
      setExplosionProgress((prev) => {
        if (forward) {
          if (prev >= 1.0) {
            forward = false;
            return 1.0;
          }
          return Math.min(1.0, prev + 0.015);
        } else {
          if (prev <= 0.0) {
            forward = true;
            return 0.0;
          }
          return Math.max(0.0, prev - 0.015);
        }
      });
    }, 45);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Layer mode presets (Full, X-Ray Glass, Musculature, Skeleton, Organs Only)
  const handleApplyPresetMode = useCallback((preset) => {
    setCurrentPreset(preset);
    setSoloSystemId(null);
    setLayers((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = { ...next[key] };
      });

      if (preset === "full") {
        Object.keys(next).forEach((k) => {
          next[k].visible = true;
          next[k].opacity = k === "muscular" ? 0.88 : 1.0;
        });
      } else if (preset === "transparent") {
        Object.keys(next).forEach((k) => {
          next[k].visible = true;
          if (k === "skeletal") next[k].opacity = 0.25;
          else if (k === "muscular") {
            next[k].visible = false;
            next[k].opacity = 0.2;
          } else next[k].opacity = 1.0;
        });
      } else if (preset === "muscle") {
        Object.keys(next).forEach((k) => {
          next[k].visible = true;
          if (k === "muscular") next[k].opacity = 1.0;
          else if (k === "skeletal") next[k].opacity = 0.55;
          else next[k].opacity = 0.85;
        });
      } else if (preset === "skeleton") {
        Object.keys(next).forEach((k) => {
          next[k].visible = k !== "muscular";
          next[k].opacity = k === "muscular" ? 0.9 : 1.0;
        });
      } else if (preset === "organs" || preset === "visceral") {
        Object.keys(next).forEach((k) => {
          if (k === "skeletal" || k === "muscular") {
            next[k].visible = false;
          } else {
            next[k].visible = true;
            next[k].opacity = 1.0;
          }
        });
      }
      return next;
    });
  }, []);

  // Solo toggle on any individual anatomical system
  const handleSoloLayer = useCallback(
    (sysKey) => {
      if (soloSystemId === sysKey) {
        // Restore normal layers
        handleApplyPresetMode(currentPreset === "organs" ? "full" : currentPreset);
        return;
      }
      setSoloSystemId(sysKey);
      setLayers((prev) => {
        const next = {};
        Object.keys(prev).forEach((k) => {
          next[k] = {
            visible: k === sysKey,
            opacity: 1.0,
          };
        });
        return next;
      });
    },
    [soloSystemId, currentPreset, handleApplyPresetMode]
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "r") {
        e.preventDefault();
        handleResetCamera();
      } else if (key === "s") {
        e.preventDefault();
        handleScreenshot();
      } else if (key === "f") {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (key === "escape") {
        if (selectedPart || selectedOrganId || customModelUrl) {
          handleResetToWholeBody();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleResetCamera,
    handleScreenshot,
    handleToggleFullscreen,
    selectedPart,
    selectedOrganId,
    customModelUrl,
    handleResetToWholeBody,
  ]);

  const isStoryMode =
    view === "explorer" &&
    !inWorkbench &&
    !selectedOrganId &&
    !selectedPart &&
    !customModelUrl;

  const effectiveExplosionProgress =
    isStoryMode && explosionProgress === 0 ? storyExplode : explosionProgress;
  const effectiveDismantleMode =
    isStoryMode && explosionProgress === 0 ? "layered" : dismantleMode;

  // Smooth RAF scroll-to-Three.js progress choreography tracker
  useEffect(() => {
    if (view !== "explorer") return undefined;

    let rafId = null;
    let lastQuantizedExplode = -1;
    let lastChapterIdx = -1;

    const updateTargetsFromScroll = () => {
      const wbEl = workbenchRef.current;
      if (!wbEl) return;

      const wbRect = wbEl.getBoundingClientRect();
      const maxStoryY = Math.max(1, wbEl.offsetTop - window.innerHeight * 0.55);
      const rawP = Math.max(0, Math.min(1, window.scrollY / maxStoryY));
      targetStoryProgressRef.current = rawP;

      const nowInWorkbench = wbRect.top <= window.innerHeight * 0.45;
      setInWorkbench((prev) => (prev !== nowInWorkbench ? nowInWorkbench : prev));

      let nextChapter = 0;
      if (nowInWorkbench) {
        nextChapter = STORY_CHAPTERS.length;
      } else {
        for (let i = STORY_CHAPTERS.length - 1; i >= 0; i--) {
          if (rawP >= STORY_CHAPTERS[i].t - 0.1) {
            nextChapter = i;
            break;
          }
        }
      }
      if (nextChapter !== lastChapterIdx) {
        lastChapterIdx = nextChapter;
        setActiveChapterIdx(nextChapter);
      }
    };

    const tick = () => {
      const target = targetStoryProgressRef.current;
      const cur = storyProgressRef.current;
      const next = Math.abs(target - cur) < 0.0005 ? target : cur + (target - cur) * 0.14;
      storyProgressRef.current = next;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${Math.max(0.02, next)})`;
      }

      const targetExplode = evaluateStoryKeyframe(next).explode;
      const qExplode = Math.round(targetExplode * 25) / 25;
      if (qExplode !== lastQuantizedExplode) {
        lastQuantizedExplode = qExplode;
        setStoryExplode(qExplode);
      }

      rafId = requestAnimationFrame(tick);
    };

    updateTargetsFromScroll();
    window.addEventListener("scroll", updateTargetsFromScroll, { passive: true });
    window.addEventListener("resize", updateTargetsFromScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", updateTargetsFromScroll);
      window.removeEventListener("resize", updateTargetsFromScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [view]);

  const handleZoomStep = useCallback((factor) => {
    setZoomTrigger((prev) => ({ factor, seq: prev.seq + 1 }));
  }, []);

  const selectedOrganData = selectedOrganId ? getAnatomicalDataForPart(selectedOrganId) : null;

  return (
    <div className="app-root">
      {showIntro && <BioOpeningSequence onComplete={() => setShowIntro(false)} />}
      {/* Human Body Atlas Header */}
      <Header
        view={view}
        setView={(nextView) => {
          setView(nextView);
          if (nextView === "library") {
            window.scrollTo({ top: 0, behavior: "instant" });
          }
        }}
        selectedGender={selectedGender}
        onSelectGender={handleSelectGender}
        selectedOrganId={selectedOrganId}
        onSelectOrgan={handleSelectOrgan}
        onResetCamera={handleResetCamera}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onExport4K={handleScreenshot}
        onUploadModel={handleUploadModel}
        visibleStructuresCount={visibleStructuresCount}
      />

      {view === "explorer" && (
        <div className="story-scroll-progress-track" aria-hidden="true">
          <div ref={progressBarRef} className="story-scroll-progress-fill" />
        </div>
      )}

      {/* Main View Area */}
      {view === "library" ? (
        <div className="library-view-wrap">
          <ModelLibrary
            selectedGender={selectedGender}
            onSelectGender={handleSelectGender}
            onSelectOrgan={(organId) => {
              handleSelectOrgan(organId);
              setView("explorer");
            }}
            onDismantleOrgan={handleDismantleOrgan}
            onViewInWholeBody={handleViewInWholeBody}
          />
        </div>
      ) : (
        <div className={`atlas-scroll-experience ${isStoryMode ? "mode-story" : "mode-workbench"}`}>
          {/* Persistent Single Three.js WebGL Stage across all scroll chapters & studio workbench */}
          <div className={`three-scroll-backdrop ${isStoryMode ? "story-active" : "workbench-active"}`}>
            <Viewer
              modelUrl={activeModelUrl}
              modelId={selectedOrganId || "human-body-atlas"}
              wireframe={false}
              autoRotate={false}
              explosionProgress={effectiveExplosionProgress}
              dismantleMode={effectiveDismantleMode}
              layers={layers}
              selectedGender={selectedGender}
              selectedPart={selectedPart}
              selectedOrganId={selectedOrganId}
              isIsolated={Boolean(selectedOrganId)}
              isCustomModel={Boolean(customModelUrl)}
              showLabels={false}
              onSelectMesh={(meshName) => setSelectedPart(meshName)}
              onSelectOrgan={(organId) => handleSelectOrgan(organId)}
              onModelMetadataReady={setActiveModelStats}
              focusTarget={focusTarget}
              onFocusDone={() => setFocusTarget(null)}
              resetCameraTrigger={resetCamera}
              onResetCameraDone={() => setResetCamera(false)}
              viewPreset={viewPreset}
              viewPresetSeq={viewPresetSeq}
              onViewPresetDone={() => {}}
              spotlightMode={spotlightMode}
              sliceMode={sliceMode}
              slicePosition={slicePosition}
              sliceInvert={sliceInvert}
              isStoryMode={isStoryMode}
              storyProgressRef={storyProgressRef}
              workbenchZoomEnabled={workbenchZoomEnabled}
              zoomTrigger={zoomTrigger}
            />
          </div>

          {/* Right Vertical Chapter Scrubber during Scroll Story */}
          {isStoryMode && (
            <nav className="story-chapter-rail" aria-label="Anatomy Scroll Chapters">
              {STORY_CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.id}
                  type="button"
                  className={`chapter-rail-item ${activeChapterIdx === idx ? "active" : ""}`}
                  onClick={() => scrollToChapter(idx)}
                >
                  <span className="rail-index">{ch.num}</span>
                  <span className="rail-label">{ch.shortLabel}</span>
                </button>
              ))}
              <button
                type="button"
                className={`chapter-rail-item ${activeChapterIdx === STORY_CHAPTERS.length ? "active" : ""}`}
                onClick={scrollToWorkbench}
              >
                <span className="rail-index">06</span>
                <span className="rail-label">Studio</span>
              </button>
            </nav>
          )}

          {/* Smooth-Revealing Scroll Chapters (Blocks 01 - 05) */}
          <div className="story-chapters-track">
            {STORY_CHAPTERS.map((chapter, idx) => (
              <section
                key={chapter.id}
                id={chapter.id}
                ref={(el) => {
                  chapterRefs.current[idx] = el;
                }}
                className={`story-chapter-section chapter-${idx + 1}`}
              >
                <RevealBlock className="story-glass-card" delay={40}>
                  <span className="story-eyebrow reveal-stagger-1">{chapter.eyebrow}</span>
                  <h1 className="story-headline reveal-stagger-2">{chapter.title}</h1>
                  <p className="story-description reveal-stagger-3">{chapter.description}</p>

                  {/* Context-aware interactive controls per block (zero leading symbols) */}
                  <div className="story-card-actions reveal-stagger-4">
                    {idx === 0 && (
                      <>
                        <button
                          type="button"
                          className="story-primary-btn"
                          onClick={() => scrollToChapter(1)}
                        >
                          Scroll Through Anatomy
                        </button>
                        <button
                          type="button"
                          className="story-secondary-btn"
                          onClick={scrollToWorkbench}
                        >
                          Open 3D Workbench
                        </button>
                      </>
                    )}

                    {idx === 1 && (
                      <>
                        {["full", "muscle", "skeleton", "organs"].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            className={`story-chip-btn ${currentPreset === preset ? "active" : ""}`}
                            onClick={() => handleApplyPresetMode(preset)}
                          >
                            {preset === "full"
                              ? "Full Body"
                              : preset === "muscle"
                              ? "Musculature"
                              : preset === "skeleton"
                              ? "Skeleton"
                              : "Organs Only"}
                          </button>
                        ))}
                      </>
                    )}

                    {idx === 2 && (
                      <>
                        <button
                          type="button"
                          className="story-primary-btn"
                          onClick={() => handleSelectOrgan("heart")}
                        >
                          Inspect Heart
                        </button>
                        <button
                          type="button"
                          className="story-secondary-btn"
                          onClick={() => handleSelectOrgan("lungs")}
                        >
                          Inspect Lungs
                        </button>
                        <button
                          type="button"
                          className={`story-chip-btn ${spotlightMode === "cyber" ? "active" : ""}`}
                          onClick={() => setSpotlightMode(spotlightMode === "cyber" ? "studio" : "cyber")}
                        >
                          {spotlightMode === "cyber" ? "Studio Spotlight" : "Gold Rim Light"}
                        </button>
                      </>
                    )}

                    {idx === 3 && (
                      <>
                        <button
                          type="button"
                          className="story-primary-btn"
                          onClick={() => handleSelectOrgan("stomach")}
                        >
                          Inspect Stomach
                        </button>
                        <button
                          type="button"
                          className="story-secondary-btn"
                          onClick={() => handleSelectOrgan("liver")}
                        >
                          Inspect Liver
                        </button>
                        <button
                          type="button"
                          className={`story-chip-btn ${sliceMode === "axial" ? "active" : ""}`}
                          onClick={() => setSliceMode(sliceMode === "axial" ? "off" : "axial")}
                        >
                          {sliceMode === "axial" ? "Disable CT Cut" : "Axial CT Cut"}
                        </button>
                      </>
                    )}

                    {idx === 4 && (
                      <>
                        <button
                          type="button"
                          className={`story-chip-btn ${selectedGender === "male" ? "active" : ""}`}
                          onClick={() => handleSelectGender("male")}
                        >
                          Male Specimen
                        </button>
                        <button
                          type="button"
                          className={`story-chip-btn ${selectedGender === "female" ? "active" : ""}`}
                          onClick={() => handleSelectGender("female")}
                        >
                          Female Specimen
                        </button>
                        <button
                          type="button"
                          className="story-primary-btn"
                          onClick={() => setView("library")}
                        >
                          Open Organ Library
                        </button>
                      </>
                    )}
                  </div>
                </RevealBlock>
              </section>
            ))}
          </div>

          {/* Block 06: Interactive Full-Featured 3D Dissection Studio Workbench */}
          <section
            id="workbench-section"
            ref={workbenchRef}
            className="atlas-explorer-layout atlas-workbench-section"
          >
            {/* Center 3D Viewport Column overlay */}
            <div className="atlas-viewport-column">
              <div className="workbench-top-actions-row">
                {(selectedOrganData || customModelName) ? (
                  <div className="active-organ-banner">
                    <button
                      className="organ-back-pill-btn"
                      onClick={handleResetToWholeBody}
                      title="Return to whole human body"
                    >
                      <span>Back to the body</span>
                    </button>
                    <div className="organ-banner-title">
                      <span className="organ-banner-name">
                        {customModelName ? customModelName : selectedOrganData.name}
                      </span>
                      {selectedOrganData?.latinName && (
                        <span className="organ-banner-latin">{selectedOrganData.latinName}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="workbench-story-return-pill"
                    onClick={scrollToStoryTop}
                    title="Scroll back to Three.js Story Overview"
                  >
                    Back to Scroll Story
                  </button>
                )}
              </div>

              {/* Floating Bottom Control Card */}
              <DismantleHeroBar
                explosionProgress={explosionProgress}
                onExplosionChange={(val) => {
                  cancelExplosionAnim();
                  setExplosionProgress(val);
                }}
                onAnimateExplosion={handleAnimateExplosion}
                isAutoPlaying={isAutoPlaying}
                onToggleAutoPlay={() => setIsAutoPlaying((prev) => !prev)}
                viewPreset={viewPreset}
                onSelectViewPreset={handleSelectViewPreset}
                selectedGender={selectedGender}
                onSelectGender={handleSelectGender}
                selectedOrgan={selectedPart && !selectedOrganId && !customModelName ? selectedPart : null}
                onResetToWholeBody={handleResetToWholeBody}
                dismantleMode={dismantleMode}
                onToggleDismantleMode={setDismantleMode}
                spotlightMode={spotlightMode}
                onToggleSpotlightMode={setSpotlightMode}
                sliceMode={sliceMode}
                onSliceModeChange={setSliceMode}
                slicePosition={slicePosition}
                onSlicePositionChange={setSlicePosition}
                sliceInvert={sliceInvert}
                onToggleSliceInvert={() => setSliceInvert((prev) => !prev)}
                onZoomStep={handleZoomStep}
                workbenchZoomEnabled={workbenchZoomEnabled}
                onToggleWorkbenchZoom={() => setWorkbenchZoomEnabled((z) => !z)}
              />
            </div>

            {/* Right Sidebar: Organ Details or Segmented Explorer/Layers */}
            <aside className="atlas-right-sidebar">
              {selectedOrganId || selectedPart ? (
                <OrganDetailsPanel
                  selectedGender={selectedGender}
                  selectedOrganId={selectedOrganId}
                  selectedPart={selectedPart}
                  onClose={handleResetToWholeBody}
                  onFocusOrgan={handleViewInWholeBody}
                />
              ) : (
                <div className="atlas-sidebar-content">
                  <div className="sidebar-mode-tabs" role="tablist">
                    <button
                      className={`sidebar-mode-tab ${sidebarTab === "organs" ? "active" : ""}`}
                      onClick={() => setSidebarTab("organs")}
                      role="tab"
                      aria-selected={sidebarTab === "organs"}
                    >
                      <span>Organs ({activeGenderOrgans.length})</span>
                    </button>
                    <button
                      className={`sidebar-mode-tab ${sidebarTab === "layers" ? "active" : ""}`}
                      onClick={() => setSidebarTab("layers")}
                      role="tab"
                      aria-selected={sidebarTab === "layers"}
                    >
                      <span>Layers & Presets</span>
                    </button>
                  </div>

                  {sidebarTab === "organs" ? (
                    <div className="sidebar-section organs-quick-showcase">
                      <div className="sidebar-section-title">
                        {selectedGender === "male" ? "MALE ORGANS IN 3D" : "FEMALE ORGANS IN 3D"}
                      </div>
                      <div className="organs-quick-grid">
                        {activeGenderOrgans.map((org) => (
                          <button
                            key={org.id}
                            className={`organ-quick-card ${selectedOrganId === org.id ? "active" : ""}`}
                            onClick={() => handleSelectOrgan(org.id)}
                            title={`Inspect ${org.name} in high-resolution 3D`}
                          >
                            <div className="quick-organ-info">
                              <span className="quick-organ-name">{org.shortName || org.name}</span>
                              <span className="quick-organ-system">{org.systemId}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <SystemLayersPanel
                      layers={layers}
                      soloSystemId={soloSystemId}
                      onSoloLayer={handleSoloLayer}
                      onToggleLayer={(sysKey) => {
                        setSoloSystemId(null);
                        setLayers((prev) => ({
                          ...prev,
                          [sysKey]: { ...prev[sysKey], visible: !prev[sysKey]?.visible },
                        }));
                      }}
                      onChangeLayerOpacity={(sysKey, op) =>
                        setLayers((prev) => ({
                          ...prev,
                          [sysKey]: { ...prev[sysKey], opacity: op },
                        }))
                      }
                      onApplyPresetMode={handleApplyPresetMode}
                      currentPreset={currentPreset}
                    />
                  )}
                </div>
              )}
            </aside>
          </section>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="global-hud-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
