import { useState, useRef, useEffect, useMemo } from "react";
import { ORGANS } from "../data/anatomyData";

export default function Header({
  view,
  setView,
  selectedGender = "male",
  onSelectGender,
  selectedOrganId = null,
  onSelectOrgan,
  onResetCamera,
  isFullscreen = false,
  onToggleFullscreen,
  onExport4K,
  onUploadModel,
  visibleStructuresCount,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const organList = useMemo(() => {
    return Object.values(ORGANS).filter(
      (o) => !o.genderAvailability || o.genderAvailability.includes(selectedGender)
    );
  }, [selectedGender]);

  const filteredOrgans = searchQuery.trim()
    ? organList
        .filter(
          (o) =>
            o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.shortName && o.shortName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            o.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.systemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.cavity.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        e.preventDefault();
        const input = document.querySelector(".header-search-field");
        if (input) {
          input.focus();
          setIsSearchOpen(true);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectSearchResult = (organId) => {
    if (onSelectOrgan) onSelectOrgan(organId);
    setSearchQuery("");
    setIsSearchOpen(false);
    if (setView) setView("explorer");
  };

  const displayCount =
    typeof visibleStructuresCount === "number"
      ? visibleStructuresCount.toLocaleString()
      : selectedGender === "male"
      ? "2,229"
      : "2,234";

  return (
    <header className="header" role="banner">
      <div className="header-left">
        {/* Human Body Atlas Logo */}
        <div
          className="header-logo"
          onClick={() => {
            if (onSelectOrgan) onSelectOrgan(null);
            if (setView) setView("explorer");
          }}
          title="Human Body Atlas — 3D Biology Simulation"
        >
          <div className="logo-text-group">
            <span className="logo-title">Human Body Atlas</span>
            <span className="logo-subtitle">Biology · 3D Simulation</span>
          </div>
        </div>

        {/* Dynamic Visible Structures Counter */}
        <div className="visible-structures-hud-pill" title="Active anatomical structures visible in 3D simulation">
          <span className="structures-label">Structures:</span>
          <span className="structures-count">{displayCount}</span>
        </div>

        {/* View Switcher: 3D Atlas Simulator vs Organ Library */}
        <nav className="header-nav" aria-label="Main navigation">
          <button
            className={`nav-tab ${view === "explorer" ? "active" : ""}`}
            onClick={() => setView("explorer")}
            title="Interactive 3D Body Atlas Viewport"
          >
            3D Atlas
          </button>
          <button
            className={`nav-tab ${view === "library" ? "active" : ""}`}
            onClick={() => setView("library")}
            title="Male & Female Organ Library"
          >
            Organ Library
          </button>
        </nav>

        {/* Gender Toggle: Male vs Female */}
        <div className="gender-switch-group" role="group" aria-label="Anatomical Gender">
          <button
            className={`gender-tab-btn ${selectedGender === "male" ? "active" : ""}`}
            onClick={() => onSelectGender && onSelectGender("male")}
            title="Male Anatomical Organ Library & Body Framework"
          >
            <span>Male</span>
          </button>
          <button
            className={`gender-tab-btn ${selectedGender === "female" ? "active" : ""}`}
            onClick={() => onSelectGender && onSelectGender("female")}
            title="Female Anatomical Organ Library & Body Framework"
          >
            <span>Female</span>
          </button>
        </div>

        {/* Compact Quick Organ Selector Dropdown */}
        {view === "explorer" && (
          <div className="header-model-dropdown-wrap">
            <select
              className="header-organ-select"
              value={selectedOrganId || ""}
              onChange={(e) => onSelectOrgan && onSelectOrgan(e.target.value || null)}
              title="Quickly jump to an organ in 3D"
            >
              <option value="">Full Assembled Body</option>
              {organList.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.shortName || org.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Import Custom GLB file button */}
        <label className="import-glb-header-btn" title="Load your own .glb 3D anatomical model">
          <input
            type="file"
            accept=".glb,.gltf"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onUploadModel) {
                onUploadModel(file);
              }
              e.target.value = "";
            }}
          />
          <span>+ Load .GLB</span>
        </label>
      </div>

      {/* Center Search Bar */}
      <div className="header-center-search" ref={searchRef}>
        <div className="search-input-wrapper">
          <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search organs (Heart, Stomach, Brain, Kidney)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="header-search-field"
          />
          {searchQuery ? (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              &times;
            </button>
          ) : (
            <span className="search-shortcut-pill" title="Press / to search">/</span>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && filteredOrgans.length > 0 && (
          <div className="search-results-dropdown">
            {filteredOrgans.map((org) => (
              <div
                key={org.id}
                className="search-result-item"
                onClick={() => handleSelectSearchResult(org.id)}
              >
                <div className="result-name-row">
                  <span className="result-name">{org.name}</span>
                  <span className="result-cavity">{org.cavity}</span>
                </div>
                <span className="result-latin">{org.latinName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="header-right">
        <button
          className="header-capture-btn"
          onClick={onExport4K}
          title="Export 4K High-Resolution Screenshot (S)"
        >
          <span>4K Capture</span>
        </button>

        <button
          className="header-tool-btn"
          onClick={onResetCamera}
          title="Reset 3D camera framing (R)"
        >
          <span>Reset</span>
        </button>

        <button
          className="header-tool-btn"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
        >
          {isFullscreen ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          )}
        </button>

        <span className="header-status">ONLINE</span>
      </div>
    </header>
  );
}
