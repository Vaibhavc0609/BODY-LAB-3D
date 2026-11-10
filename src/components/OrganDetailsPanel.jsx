import { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ORGANS, ANATOMICAL_SYSTEMS, getAnatomicalDataForPart } from "../data/anatomyData";
import ClinicalPathologyPredictor from "./ClinicalPathologyPredictor";
import ProceduralOrganModel from "./ProceduralOrgans";

function formatSubpartLabel(raw = "") {
  return String(raw)
    .replace(/^(VH_M_|VH_F_|Allen_)/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function MiniOrganModel({ url }) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => {
    const cl = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cl);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 2.0 / maxDim;
      cl.scale.setScalar(scale);
      cl.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    }
    return cl;
  }, [scene]);

  return <primitive object={clone} />;
}

export default function OrganDetailsPanel({
  selectedGender = "male",
  selectedOrganId = null,
  selectedPart = null,
  onClose,
  onFocusOrgan,
}) {
  const organ = selectedOrganId
    ? getAnatomicalDataForPart(selectedOrganId)
    : selectedPart
    ? getAnatomicalDataForPart(selectedPart)
    : null;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState("pathology"); // 'pathology' | 'anatomy'
  const synthRef = useRef(window.speechSynthesis);

  // Stop speech if organ changes or panel closes (no inner voices on default)
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [selectedOrganId, selectedPart]);

  if (!organ) {
    return (
      <aside className="organ-panel organ-panel-empty">
        <div className="empty-panel-content">
          <div className="empty-scanner-icon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="22" y1="12" x2="18" y2="12" />
              <line x1="6" y1="12" x2="2" y2="12" />
              <line x1="12" y1="6" x2="12" y2="2" />
              <line x1="12" y1="22" x2="12" y2="18" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h3>ANATOMICAL SCANNER</h3>
          <p>Click any organ, bone, or muscle in the 3D body to inspect clinical pathology, physiology, and anatomical coordinates.</p>
          <div className="quick-organ-chips">
            <span className="chips-label">Quick Inspect:</span>
            {['heart', 'brain', 'lungs', 'liver', 'kidneys', 'stomach'].map((id) => (
              <button
                key={id}
                className="chip-btn"
                onClick={() => onFocusOrgan && onFocusOrgan(id)}
              >
                {ORGANS[id]?.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const system = ANATOMICAL_SYSTEMS.find((s) => s.id === organ.systemId);

  const handleToggleSpeech = () => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${organ.name}. ${organ.latinName ? organ.latinName + '.' : ''} Located in the ${organ.cavity}. ${organ.function} ${organ.physiology}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };

  return (
    <aside className="organ-panel" aria-label="Organ Medical Details">
      {/* Top Header */}
      <div className="organ-panel-header">
        <div className="organ-header-badge-row">
          <span className="system-pill" style={{ borderColor: system?.color || 'rgba(255, 255, 255, 0.3)', color: system?.color || '#ffffff' }}>
            {system?.name || 'Visceral Organ'}
          </span>
          <span className="cavity-pill">{organ.cavity}</span>
        </div>
        <button className="panel-close-btn" onClick={onClose} title="Close inspector">
          &times;
        </button>
      </div>

      <div className="organ-title-area">
        <h2 className="organ-title">{organ.name}</h2>
        <span className="organ-latin">{organ.latinName}</span>
        {selectedPart && selectedPart !== organ.id && (
          <div className="subpart-focus-badge">
            <span>Target Part: <strong>{formatSubpartLabel(selectedPart)}</strong></span>
          </div>
        )}
      </div>

      {/* Action Bar: Voice Narration & Center Camera */}
      <div className="organ-quick-actions">
        <button
          className={`action-btn audio-btn ${isSpeaking ? 'active' : ''}`}
          onClick={handleToggleSpeech}
          title="Audio narration of clinical physiology"
        >
          {isSpeaking ? 'Pause Audio' : 'Listen Narration'}
        </button>
        <button
          className="action-btn zoom-btn"
          onClick={() => onFocusOrgan && onFocusOrgan(organ.id)}
          title="Zoom 3D camera to organ"
        >
          Focus 3D Body
        </button>
      </div>

      {/* Mode Switcher Tabs: AI Pathology Engine vs Anatomy Specs */}
      <div className="organ-panel-tabs-row" role="tablist">
        <button
          className={`panel-tab-btn ${activeTab === 'pathology' ? 'active' : ''}`}
          onClick={() => setActiveTab('pathology')}
          role="tab"
          aria-selected={activeTab === 'pathology'}
        >
          <span>AI Pathology Predictor</span>
        </button>
        <button
          className={`panel-tab-btn ${activeTab === 'anatomy' ? 'active' : ''}`}
          onClick={() => setActiveTab('anatomy')}
          role="tab"
          aria-selected={activeTab === 'anatomy'}
        >
          <span>Anatomy & Physiology</span>
        </button>
      </div>

      <div className="organ-panel-scroll">
        {/* Holographic Body Silhouette Locator Map & 3D Mini-Viewer Grid */}
        <div className="visual-locator-grid">
          {/* 1. Holographic Body Locator Map with Male/Female Dimorphism */}
          <div className="locator-card">
            <div className="card-header-label">
              {selectedGender === "male" ? "MALE ANATOMICAL LOCATOR" : "FEMALE ANATOMICAL LOCATOR"}
            </div>
            <div className="silhouette-wrapper">
              <svg viewBox="0 0 100 200" className={`body-silhouette-svg ${selectedGender === "male" ? "male-silhouette" : "female-silhouette"}`}>
                {selectedGender === "male" ? (
                  // Male Silhouette: Broad chest, straight android waist, pelvic contours
                  <g className="male-locator-group">
                    <ellipse cx="50" cy="20" rx="10" ry="13" className="body-contour" />
                    <rect x="46" y="33" width="8" height="9" className="body-contour" />
                    <path d="M28 42 L72 42 L66 102 L58 120 L42 120 L34 102 Z" className="body-contour" />
                    <path d="M28 44 L20 88 L18 116 L22 118 L25 90 L30 54 Z" className="body-contour" />
                    <path d="M72 44 L80 88 L82 116 L78 118 L75 90 L70 54 Z" className="body-contour" />
                    <path d="M42 120 L39 158 L38 188 L44 190 L46 158 L48 122 Z" className="body-contour" />
                    <path d="M58 120 L61 158 L62 188 L56 190 L54 158 L52 122 Z" className="body-contour" />
                    <line x1="30" y1="58" x2="70" y2="58" className="body-grid-line" stroke="#e5b869" opacity="0.3" />
                    <line x1="33" y1="84" x2="67" y2="84" className="body-grid-line" stroke="#e5b869" opacity="0.3" />
                    <line x1="38" y1="110" x2="62" y2="110" className="body-grid-line" stroke="#e5b869" opacity="0.3" />
                  </g>
                ) : (
                  // Female Silhouette: Narrower shoulders, hourglass waist, wide gynecoid hips
                  <g className="female-locator-group">
                    <ellipse cx="50" cy="20" rx="9" ry="12" className="body-contour" />
                    <rect x="47" y="32" width="6" height="8" className="body-contour" />
                    {/* Hourglass torso with wide gynecoid pelvis */}
                    <path d="M34 40 L66 40 L63 68 C61 80, 56 88, 56 94 C56 102, 64 108, 64 122 L36 122 C36 108, 44 102, 44 94 C44 88, 39 80, 37 68 Z" className="body-contour" />
                    <path d="M34 42 L24 84 L22 114 L26 116 L29 88 L34 52 Z" className="body-contour" />
                    <path d="M66 42 L76 84 L78 114 L74 116 L71 88 L66 52 Z" className="body-contour" />
                    <path d="M40 122 L37 158 L36 188 L42 190 L45 158 L47 124 Z" className="body-contour" />
                    <path d="M60 122 L63 158 L64 188 L58 190 L55 158 L53 124 Z" className="body-contour" />
                    <line x1="34" y1="56" x2="66" y2="56" className="body-grid-line" stroke="#ec4899" opacity="0.3" />
                    <line x1="38" y1="82" x2="62" y2="82" className="body-grid-line" stroke="#ec4899" opacity="0.3" />
                    <line x1="36" y1="110" x2="64" y2="110" className="body-grid-line" stroke="#ec4899" opacity="0.3" />
                  </g>
                )}

                {organ.mapPosition && (
                  <g className="locator-pin-group">
                    <circle
                      cx={organ.mapPosition.xPercent}
                      cy={organ.mapPosition.yPercent}
                      r="9"
                      className="locator-radar-wave"
                      style={{ stroke: selectedGender === "male" ? '#e5b869' : '#ec4899' }}
                    />
                    <circle
                      cx={organ.mapPosition.xPercent}
                      cy={organ.mapPosition.yPercent}
                      r="4"
                      className="locator-dot"
                      style={{ fill: selectedGender === "male" ? '#e5b869' : '#ec4899' }}
                    />
                  </g>
                )}
              </svg>
              <div className="locator-coords-info">
                <span>Vertebral Level: <strong>{organ.vertebralLevel || 'Thoracoabdominal'}</strong></span>
                <span>Coord: <strong>X: {organ.coordinates?.x}, Y: {organ.coordinates?.y}</strong></span>
              </div>
            </div>
          </div>

          {/* 2. Enlarged 3D Organ Mini-Viewer */}
          {(organ.standaloneModelUrl || organ.proceduralType) && (
            <div className="mini-3d-card">
              <div className="card-header-label">ISOLATED 3D PREVIEW</div>
              <div className="mini-canvas-wrap">
                <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }}>
                  <ambientLight intensity={0.9} />
                  <directionalLight position={[3, 5, 4]} intensity={2.0} />
                  <directionalLight position={[-3, -2, -3]} intensity={0.6} />
                  <Suspense fallback={null}>
                    {organ.proceduralType ? (
                      <ProceduralOrganModel type={organ.proceduralType} scale={1.15} />
                    ) : (
                      <MiniOrganModel url={organ.standaloneModelUrl} />
                    )}
                  </Suspense>
                  <OrbitControls autoRotate autoRotateSpeed={2.2} enableZoom={false} enablePan={false} />
                </Canvas>
              </div>
              <span className="mini-rotate-hint">360° AUTO-ROTATION</span>
            </div>
          )}
        </div>

        {/* Tab 1: AI Clinical Pathology & Diagnostic Risk Engine */}
        {activeTab === 'pathology' && (
          <ClinicalPathologyPredictor key={organ.id} organId={organ.id} />
        )}

        {/* Tab 2: Standard Anatomical & Physiological Specs */}
        {activeTab === 'anatomy' && (
          <>
            {/* Section 1: Biological Function */}
            <div className="organ-info-section">
              <div className="section-title">
                BIOLOGICAL FUNCTION & PURPOSE
              </div>
              <p className="section-text">{organ.function}</p>
            </div>

            {/* Section 2: Physiological Mechanism */}
            <div className="organ-info-section">
              <div className="section-title">
                PHYSIOLOGICAL MECHANISM
              </div>
              <p className="section-text">{organ.physiology}</p>
            </div>

            {/* Section 3: Anatomical Specs & Metrics */}
            <div className="organ-info-section">
              <div className="section-title">
                CLINICAL SPECIFICATIONS & METRICS
              </div>
              <div className="metric-row">
                <span className="metric-label">Dimensions & Weight:</span>
                <span className="metric-val">{organ.dimensions}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Vascular Inflow / Outflow:</span>
                <span className="metric-val">{organ.bloodSupply}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Autonomic Innervation:</span>
                <span className="metric-val">{organ.nerveSupply}</span>
              </div>
            </div>

            {/* Section 4: Clinical Pathology */}
            <div className="organ-info-section clinical-pathology">
              <div className="section-title pathology-title">
                CLINICAL PATHOLOGY & CONDITIONS
              </div>
              <p className="section-text pathology-text">{organ.clinicalNotes}</p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

