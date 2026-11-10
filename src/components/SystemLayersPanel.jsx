import { ANATOMICAL_SYSTEMS } from "../data/anatomyData";

export default function SystemLayersPanel({
  layers = {},
  onToggleLayer,
  onChangeLayerOpacity,
  onSoloLayer,
  soloSystemId = null,
  onApplyPresetMode,
  currentPreset = "full",
  isOpen = true,
  onTogglePanel,
}) {
  return (
    <aside className={`system-layers-panel ${isOpen ? "open" : "collapsed"}`}>
      {/* Panel Header */}
      <div className="layers-header">
        <div className="layers-title-row">
          <div>
            <h3 className="layers-title">ANATOMICAL LAYERS</h3>
            <span className="layers-subtitle">DISMANTLE SYSTEM BY SYSTEM</span>
          </div>
        </div>
        {onTogglePanel && (
          <button className="layers-toggle-btn" onClick={onTogglePanel} title="Collapse sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Layer Mode Presets */}
      <div className="layer-presets-container">
        <span className="presets-label">QUICK LAYER MODES</span>
        <div className="presets-grid">
          <button
            className={`preset-btn ${currentPreset === "full" ? "active" : ""}`}
            onClick={() => onApplyPresetMode && onApplyPresetMode("full")}
            title="Musculature, Skeleton, and all internal organs visible"
          >
            Full Body
          </button>
          <button
            className={`preset-btn ${currentPreset === "transparent" ? "active" : ""}`}
            onClick={() => onApplyPresetMode && onApplyPresetMode("transparent")}
            title="Translucent X-Ray skeleton & muscles revealing vital internal organs"
          >
            X-Ray Glass
          </button>
          <button
            className={`preset-btn ${currentPreset === "muscle" ? "active" : ""}`}
            onClick={() => onApplyPresetMode && onApplyPresetMode("muscle")}
            title="Superficial & deep Z-Anatomy skeletal musculature highlighted"
          >
            Musculature
          </button>
          <button
            className={`preset-btn ${currentPreset === "skeleton" ? "active" : ""}`}
            onClick={() => onApplyPresetMode && onApplyPresetMode("skeleton")}
            title="Articulated skeletal frame & vital visceral organs"
          >
            Skeleton
          </button>
          <button
            className={`preset-btn ${currentPreset === "organs" ? "active" : ""}`}
            onClick={() => onApplyPresetMode && onApplyPresetMode("organs")}
            title="Skeleton & muscles hidden; isolate pure internal visceral organs"
          >
            Organs Only
          </button>
        </div>
      </div>

      {/* Interactive System Layers List */}
      <div className="layers-scroll-list">
        {ANATOMICAL_SYSTEMS.map((sys) => {
          const layerState = layers[sys.id] || { visible: true, opacity: 1.0 };
          const isVisible = layerState.visible;
          const opacityPercent = Math.round((layerState.opacity ?? 1.0) * 100);

          return (
            <div
              key={sys.id}
              className={`layer-card ${isVisible ? "visible" : "hidden"} ${layerState.opacity < 0.98 ? "translucent" : ""}`}
            >
              <div className="layer-card-top">
                {/* Visibility Toggle Eye */}
                <button
                  className={`layer-eye-btn ${isVisible ? "active" : ""}`}
                  onClick={() => onToggleLayer && onToggleLayer(sys.id)}
                  title={isVisible ? `Hide ${sys.name}` : `Show ${sys.name}`}
                  style={{ color: isVisible ? sys.color : "var(--text-dim)" }}
                >
                  {isVisible ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>

                {/* Layer Identity */}
                <div className="layer-meta">
                  <div className="layer-name-row">
                    <span className="layer-name">{sys.name}</span>
                  </div>
                  <span className="layer-latin">{sys.latinName}</span>
                </div>

                {/* Solo Layer Action */}
                <button
                  className={`layer-solo-btn ${soloSystemId === sys.id ? "active" : ""}`}
                  onClick={() => onSoloLayer && onSoloLayer(sys.id)}
                  title={soloSystemId === sys.id ? `Restore all systems` : `Isolate ${sys.name} exclusively`}
                >
                  {soloSystemId === sys.id ? "SOLOED" : "SOLO"}
                </button>
              </div>

              {/* Opacity Slider */}
              {isVisible && (
                <div className="layer-opacity-row">
                  <span className="opacity-label">Opacity: {opacityPercent}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacityPercent}
                    onChange={(e) =>
                      onChangeLayerOpacity &&
                      onChangeLayerOpacity(sys.id, parseFloat(e.target.value) / 100)
                    }
                    className="layer-opacity-slider"
                    style={{
                      background: `linear-gradient(to right, ${sys.color} 0%, ${sys.color} ${opacityPercent}%, rgba(255,255,255,0.1) ${opacityPercent}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Global Controls */}
      <div className="layers-footer">
        <button
          className="layer-global-btn"
          onClick={() => onApplyPresetMode && onApplyPresetMode("full")}
        >
          Restore All Layers
        </button>
      </div>
    </aside>
  );
}

