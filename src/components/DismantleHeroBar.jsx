import { memo, useState } from "react";

function DismantleHeroBar({
  explosionProgress = 0,
  onExplosionChange,
  onAnimateExplosion,
  isAutoPlaying = false,
  onToggleAutoPlay,
  viewPreset = "front",
  onSelectViewPreset,
  selectedGender = "male",
  onSelectGender,
  selectedOrgan = null,
  onResetToWholeBody,
  dismantleMode = "layered",
  onToggleDismantleMode,
  spotlightMode = "studio",
  onToggleSpotlightMode,
  sliceMode = "off",
  onSliceModeChange,
  slicePosition = 0,
  onSlicePositionChange,
  sliceInvert = false,
  onToggleSliceInvert,
  onZoomStep,
  workbenchZoomEnabled = false,
  onToggleWorkbenchZoom,
}) {
  const percent = Math.round(explosionProgress * 100);
  const isAssembled = percent === 0;
  const [showCtDrawer, setShowCtDrawer] = useState(false);

  const handleCycleSpotlight = () => {
    if (!onToggleSpotlightMode) return;
    const modes = ["studio", "surgical", "cyber", "xray", "off"];
    const nextIdx = (modes.indexOf(spotlightMode) + 1) % modes.length;
    onToggleSpotlightMode(modes[nextIdx]);
  };

  const handleSelectMode = (mode) => {
    if (onToggleDismantleMode) onToggleDismantleMode(mode);
    if (onSelectViewPreset) {
      onSelectViewPreset("front");
    }
    if (isAssembled && onAnimateExplosion) {
      onAnimateExplosion(0.85, 850);
    }
  };

  return (
    <div className="bottom-floating-control-card" role="region" aria-label="Anatomical View and Disassembly Controls">
      {/* Back to whole body pill */}
      {selectedOrgan && (
        <div className="back-to-body-wrapper">
          <button
            className="back-to-body-pill"
            onClick={onResetToWholeBody}
            title="Reset focus and return camera to whole assembled body"
          >
            <span>Back to whole body</span>
          </button>
        </div>
      )}

      {/* Row 1: Camera Preset Viewports & Gender Toggle */}
      <div className="floating-card-presets-row">
        <div className="cam-presets-group">
          <button
            className={`cam-card-btn ${viewPreset === "front" ? "active" : ""}`}
            onClick={() => onSelectViewPreset && onSelectViewPreset("front")}
            title="Anterior (Front) viewpoint"
          >
            Front
          </button>
          <button
            className={`cam-card-btn ${viewPreset === "back" ? "active" : ""}`}
            onClick={() => onSelectViewPreset && onSelectViewPreset("back")}
            title="Posterior (Back) viewpoint"
          >
            Back
          </button>
          <button
            className={`cam-card-btn ${viewPreset === "side" || viewPreset === "left" ? "active" : ""}`}
            onClick={() => onSelectViewPreset && onSelectViewPreset("side")}
            title="Lateral (Side) viewpoint"
          >
            Side
          </button>
          <button
            className={`cam-card-btn ${viewPreset === "perspective" || viewPreset === "iso" ? "active" : ""}`}
            onClick={() => onSelectViewPreset && onSelectViewPreset("perspective")}
            title="Isometric 3D Perspective"
          >
            Perspective
          </button>
        </div>

        <div className="card-divider" />

        <div className="gender-presets-group">
          <button
            className={`cam-card-btn ${selectedGender === "male" ? "active" : ""}`}
            onClick={() => onSelectGender && onSelectGender("male")}
            title="Male anatomical human body"
          >
            Male
          </button>
          <button
            className={`cam-card-btn ${selectedGender === "female" ? "active" : ""}`}
            onClick={() => onSelectGender && onSelectGender("female")}
            title="Female anatomical human body"
          >
            Female
          </button>
        </div>

        <div className="card-divider" />

        {/* Cinematic Spotlight Mode Switcher */}
        <div className="spotlight-presets-group">
          <button
            className={`cam-card-btn spotlight-toggle-btn ${spotlightMode !== "off" ? "active" : ""}`}
            onClick={handleCycleSpotlight}
            title={`Spotlight: ${spotlightMode.toUpperCase()} (Click to cycle Studio → Surgical → Cyber → X-Ray → Off)`}
          >
            <span>Spotlight: {spotlightMode.toUpperCase()}</span>
          </button>
        </div>

        <div className="card-divider" />

        {/* CT / MRI Multi-Planar Cross-Section Slicer */}
        <div className="ct-presets-group">
          <button
            className={`cam-card-btn ct-toggle-btn ${sliceMode !== "off" || showCtDrawer ? "active" : ""}`}
            onClick={() => {
              if (showCtDrawer) {
                setShowCtDrawer(false);
              } else {
                setShowCtDrawer(true);
                if (sliceMode === "off" && onSliceModeChange) {
                  onSliceModeChange("axial");
                  if (onSlicePositionChange && !selectedOrgan) {
                    onSlicePositionChange(0.85);
                  }
                }
              }
            }}
            title="CT / MRI Multi-Planar Cross-Section Slicing Tool"
          >
            <span>CT Slice: {sliceMode.toUpperCase()}</span>
          </button>
        </div>

        {onZoomStep && (
          <>
            <div className="card-divider" />
            <div className="zoom-presets-group">
              <button
                className="cam-card-btn zoom-step-btn"
                onClick={() => onZoomStep(0.84)}
                title="Zoom camera closer"
              >
                Zoom In
              </button>
              <button
                className="cam-card-btn zoom-step-btn"
                onClick={() => onZoomStep(1.18)}
                title="Zoom camera out"
              >
                Zoom Out
              </button>
              {onToggleWorkbenchZoom && (
                <button
                  className={`cam-card-btn zoom-wheel-btn ${workbenchZoomEnabled ? "active" : ""}`}
                  onClick={onToggleWorkbenchZoom}
                  title="Toggle mouse-wheel zoom inside 3D studio"
                >
                  {workbenchZoomEnabled ? "Wheel Zoom: ON" : "Wheel: Scroll"}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* CT / MRI Multi-Planar Cross-Section Slicing Tray */}
      {(showCtDrawer || sliceMode !== "off") && (
        <div className="ct-slice-drawer" role="group" aria-label="CT Slicing Plane Controls">
          <div className="ct-drawer-header">
            <span className="ct-drawer-title">CT / MRI CROSS-SECTION SLICE</span>
            <button
              className="ct-drawer-close-btn"
              onClick={() => {
                setShowCtDrawer(false);
                if (onSliceModeChange) onSliceModeChange("off");
              }}
              title="Close CT Slicer & Disable Clipping"
            >
              Close
            </button>
          </div>

          <div className="ct-drawer-controls">
            <div className="ct-plane-selector">
              <button
                className={`ct-plane-btn ${sliceMode === "axial" ? "active" : ""}`}
                onClick={() => onSliceModeChange && onSliceModeChange("axial")}
                title="Transverse Horizontal Cross-Section (Axial Y)"
              >
                Axial (Y)
              </button>
              <button
                className={`ct-plane-btn ${sliceMode === "coronal" ? "active" : ""}`}
                onClick={() => onSliceModeChange && onSliceModeChange("coronal")}
                title="Frontal Cross-Section (Coronal Z)"
              >
                Coronal (Z)
              </button>
              <button
                className={`ct-plane-btn ${sliceMode === "sagittal" ? "active" : ""}`}
                onClick={() => onSliceModeChange && onSliceModeChange("sagittal")}
                title="Lateral Cross-Section (Sagittal X)"
              >
                Sagittal (X)
              </button>
              <button
                className={`ct-plane-btn ${sliceMode === "off" ? "active" : ""}`}
                onClick={() => onSliceModeChange && onSliceModeChange("off")}
                title="Turn off cross-section slicing"
              >
                Off
              </button>
            </div>

            {sliceMode !== "off" && (
              <div className="ct-depth-slider-wrap">
                <span className="ct-slider-label">Depth:</span>
                <input
                  type="range"
                  min="-1.8"
                  max="1.8"
                  step="0.02"
                  value={slicePosition}
                  onChange={(e) => onSlicePositionChange && onSlicePositionChange(parseFloat(e.target.value))}
                  className="ct-depth-range"
                />
                <span className="ct-slider-value">{slicePosition > 0 ? `+${slicePosition.toFixed(2)}` : slicePosition.toFixed(2)}</span>
                <button
                  className={`ct-flip-btn ${sliceInvert ? "active" : ""}`}
                  onClick={onToggleSliceInvert}
                  title="Invert cut direction"
                >
                  Flip Cut
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Row 2: Spread structures apart slider & Dismantle Mode Switcher */}
      <div className="floating-card-spread-row">
        <div className="spread-label-row">
          <div className="spread-mode-group">
            <span className="spread-title">Dismantle Style:</span>
            <button
              className={`spread-mode-pill ${dismantleMode === "layered" ? "active" : ""}`}
              onClick={() => handleSelectMode("layered")}
              title="3D Lateral Layer Separation"
            >
              Layer Spread
            </button>
            <button
              className={`spread-mode-pill ${dismantleMode === "grid" ? "active" : ""}`}
              onClick={() => handleSelectMode("grid")}
              title="Rows & Columns Parts Showcase (Astra AI style)"
            >
              Rows & Columns
            </button>
          </div>

          <div className="spread-actions-inline">
            {!isAssembled && (
              <button
                className="card-reassemble-btn"
                onClick={() => onAnimateExplosion && onAnimateExplosion(0.0, 850)}
                title="Reassemble all structures back into unified body"
              >
                <span>Reassemble</span>
              </button>
            )}

            <button
              className={`card-autocycle-btn ${isAutoPlaying ? "active" : ""}`}
              onClick={onToggleAutoPlay}
              title={isAutoPlaying ? "Pause continuous animation" : "Auto-cycle continuous spread & reassemble loop"}
            >
              <span>{isAutoPlaying ? "Pause" : "Auto-Cycle"}</span>
            </button>
          </div>
        </div>

        {/* Custom Range Slider with ◀▶ icon in thumb */}
        <div className="card-slider-wrapper">
          <span className="slider-edge-label assembled-label">Assembled</span>
          <div className="slider-track-box">
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={explosionProgress}
              onChange={(e) => onExplosionChange && onExplosionChange(parseFloat(e.target.value))}
              className="card-range-input"
              aria-label="Spread structures apart"
            />
            <div
              className="slider-filled-track"
              style={{ width: `${Math.max(4, Math.min(100, percent))}%` }}
            />
          </div>
          <span className="slider-edge-label spread-label">
            {percent > 0 ? `${percent}%` : "Spread"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(DismantleHeroBar);
