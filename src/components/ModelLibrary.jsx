import { useState, useMemo } from "react";
import { ALL_HUMAN_ORGANS } from "../data/anatomyData";
import AnatomicalSexDiagram from "./AnatomicalSexDiagram";
import RevealBlock from "./ScrollReveal";

export default function ModelLibrary({
  selectedGender = "male",
  onSelectGender,
  onSelectOrgan,
  onDismantleOrgan,
  onViewInWholeBody,
}) {
  const triggerDismantle = onDismantleOrgan || onSelectOrgan;
  const [activeSystemFilter, setActiveSystemFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isMale = selectedGender === "male";

  // Sex-specific primary reproductive and dimorphic organs
  const sexSpecificIds = useMemo(() => {
    return isMale
      ? ["testes", "prostate", "vas_deferens", "penis", "skeleton", "larynx"]
      : ["uterus", "ovaries", "fallopian_tubes", "cervix_vagina", "skeleton"];
  }, [isMale]);

  // Only two libraries: Male and Female
  const genderOrgans = useMemo(() => {
    const list = ALL_HUMAN_ORGANS.filter((organ) =>
      organ.genderAvailability.includes(selectedGender)
    );

    // Sort sex-specific organs to the very top so Male and Female libraries are immediately and distinctly different!
    return [...list].sort((a, b) => {
      const aSexSpecific = sexSpecificIds.includes(a.id);
      const bSexSpecific = sexSpecificIds.includes(b.id);
      if (aSexSpecific && !bSexSpecific) return -1;
      if (!aSexSpecific && bSexSpecific) return 1;
      return 0;
    });
  }, [selectedGender, sexSpecificIds]);

  // System counts for active library
  const systemCounts = useMemo(() => {
    const counts = {};
    genderOrgans.forEach((org) => {
      counts[org.systemId] = (counts[org.systemId] || 0) + 1;
    });
    return counts;
  }, [genderOrgans]);

  // Filter organs by system and search
  const filteredOrgans = useMemo(() => {
    return genderOrgans.filter((org) => {
      const matchesSystem =
        activeSystemFilter === "all" || org.systemId === activeSystemFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesSystem;
      const matchesSearch =
        org.name.toLowerCase().includes(q) ||
        org.latinName.toLowerCase().includes(q) ||
        (org.systemName && org.systemName.toLowerCase().includes(q)) ||
        (org.cavity && org.cavity.toLowerCase().includes(q)) ||
        (org.summary && org.summary.toLowerCase().includes(q));
      return matchesSystem && matchesSearch;
    });
  }, [genderOrgans, activeSystemFilter, searchQuery]);

  return (
    <div className={`organ-library-view ${isMale ? "male-library-theme" : "female-library-theme"}`} role="region" aria-label="Human Organ Library">
      {/* Primary Dual Library Switcher (Only Two Libraries: Male and Female) */}
      <div className="dual-library-hero-section">
        <div className="dual-library-title-row">
          <h2>Organ Library</h2>
          <p>Select either Male or Female Organ Library to inspect all human organs, biological systems, and sex-dimorphic anatomical diagrams</p>
        </div>

        <div className="two-libraries-selector" role="group" aria-label="Select Organ Library">
          <button
            className={`library-hero-card ${isMale ? "active" : ""}`}
            onClick={() => onSelectGender && onSelectGender("male")}
            type="button"
            title="Switch to Male Organ Library"
          >
            <div className="library-card-body">
              <div className="library-card-status">
                <span>{isMale ? "ACTIVE LIBRARY" : "SELECT LIBRARY"}</span>
              </div>
              <h3 className="library-card-title">Male Organ Library</h3>
              <p className="library-card-desc">
                Complete male anatomical database covering all 50 organs, neuroanatomy, viscera, android skeleton, testes, prostate gland, and androgenic endocrine pathways.
              </p>
              <div className="library-card-footer">
                <span className="organ-count-badge">
                  {ALL_HUMAN_ORGANS.filter((o) => o.genderAvailability.includes("male")).length} Organ Systems Included
                </span>
              </div>
            </div>
          </button>

          <button
            className={`library-hero-card ${!isMale ? "active" : ""}`}
            onClick={() => onSelectGender && onSelectGender("female")}
            type="button"
            title="Switch to Female Organ Library"
          >
            <div className="library-card-body">
              <div className="library-card-status">
                <span>{!isMale ? "ACTIVE LIBRARY" : "SELECT LIBRARY"}</span>
              </div>
              <h3 className="library-card-title">Female Organ Library</h3>
              <p className="library-card-desc">
                Complete female anatomical database covering all 50 organs, neuroanatomy, viscera, gynecoid skeleton, uterus, bilateral ovaries, and ovulatory-menstrual pathways.
              </p>
              <div className="library-card-footer">
                <span className="organ-count-badge">
                  {ALL_HUMAN_ORGANS.filter((o) => o.genderAvailability.includes("female")).length} Organ Systems Included
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Sex-Dimorphic Interactive Vector Anatomical Diagram */}
      <RevealBlock className="library-diagram-wrapper" delay={80}>
        <AnatomicalSexDiagram
          gender={selectedGender}
          onSelectOrgan={triggerDismantle}
        />
      </RevealBlock>

      {/* Toolbar for Selected Library: Filter Chips & Search */}
      <div className="active-library-toolbar">
        <div className="library-active-headline">
          <span className="headline-badge">
            {isMale ? "MALE ANATOMICAL DIRECTORY" : "FEMALE ANATOMICAL DIRECTORY"}
          </span>
          <span className="headline-count">
            Showing {filteredOrgans.length} of {genderOrgans.length} Organs
          </span>
        </div>

        <div className="toolbar-controls-row">
          <div className="system-filter-chips">
            <button
              className={`filter-chip ${activeSystemFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("all")}
            >
              All Organs ({genderOrgans.length})
            </button>
            <button
              className={`filter-chip ${activeSystemFilter === "reproductive" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("reproductive")}
            >
              {isMale ? "Male Reproductive" : "Female Reproductive"} ({systemCounts.reproductive || 0})
            </button>
            <button
              className={`filter-chip ${activeSystemFilter === "circulatory" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("circulatory")}
            >
              Circulatory ({systemCounts.circulatory || 0})
            </button>
            <button
              className={`filter-chip ${activeSystemFilter === "respiratory" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("respiratory")}
            >
              Respiratory ({systemCounts.respiratory || 0})
            </button>
            <button
              className={`filter-chip ${activeSystemFilter === "nervous" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("nervous")}
            >
              Nervous ({systemCounts.nervous || 0})
            </button>
            <button
              className={`filter-chip ${activeSystemFilter === "digestive" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("digestive")}
            >
              Digestive ({systemCounts.digestive || 0})
            </button>
            <button
              className={`filter-chip ${activeSystemFilter === "urinary" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("urinary")}
            >
              Renal ({systemCounts.urinary || 0})
            </button>
            <button
              className={`filter-chip ${activeSystemFilter === "endocrine" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("endocrine")}
            >
              Endocrine ({systemCounts.endocrine || 0})
            </button>
            <button
              className={`filter-chip ${activeSystemFilter === "skeletal" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("skeletal")}
            >
              Skeletal ({systemCounts.skeletal || 0})
            </button>
            <button
              className={`filter-chip ${activeSystemFilter === "muscular" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("muscular")}
            >
              Muscular ({systemCounts.muscular || 0})
            </button>
            <button
              className={`filter-chip ${activeSystemFilter === "sensory" ? "active" : ""}`}
              onClick={() => setActiveSystemFilter("sensory")}
            >
              Sensory ({systemCounts.sensory || 0})
            </button>
          </div>

          <div className="organ-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder={`Search ${selectedGender} organs (${isMale ? "Testes, Prostate, Heart, Brain" : "Uterus, Ovaries, Heart, Brain"})...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="organ-search-input"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery("")}>
                &times;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* All Organs Grid in Selected Library */}
      <div className="organ-cards-grid">
        {filteredOrgans.map((organ, idx) => {
          const isSexSpecific = sexSpecificIds.includes(organ.id);
          return (
            <RevealBlock
              key={organ.id}
              delay={(idx % 6) * 45}
              className={`organ-card ${isSexSpecific ? "sex-specific-card" : ""}`}
            >
              <div className="organ-card-header">
                <div className="organ-title-group">
                  <div className="badges-row">
                    <span className="organ-system-badge">{organ.systemName}</span>
                    {isSexSpecific && (
                      <span className="sex-dimorphic-badge">
                        {isMale ? "MALE SPECIFIC" : "FEMALE SPECIFIC"}
                      </span>
                    )}
                  </div>
                  <h3 className="organ-card-name">{organ.name}</h3>
                  <span className="organ-latin-name">{organ.latinName}</span>
                </div>
              </div>

              <p className="organ-card-summary">{organ.summary}</p>

              <div className="organ-meta-grid">
                <div className="organ-meta-item">
                  <span className="meta-k">Cavity:</span>
                  <span className="meta-v">{organ.cavity}</span>
                </div>
                <div className="organ-meta-item">
                  <span className="meta-k">Level:</span>
                  <span className="meta-v">{organ.vertebralLevel}</span>
                </div>
                <div className="organ-meta-item">
                  <span className="meta-k">Metrics:</span>
                  <span className="meta-v">{organ.dimensions}</span>
                </div>
                <div className="organ-meta-item">
                  <span className="meta-k">3D Pins:</span>
                  <span className="meta-v">{organ.hotspotsCount} Hotspots</span>
                </div>
              </div>

              <div className="organ-card-actions">
                <button
                  className="organ-inspect-btn"
                  onClick={() => triggerDismantle && triggerDismantle(organ.id)}
                  title={`Open ${organ.name} in 3D Explorer & Dismantle`}
                >
                  <span>Dismantle & Inspect in 3D</span>
                </button>
                <button
                  className="organ-body-btn"
                  onClick={() => onViewInWholeBody && onViewInWholeBody(organ.id)}
                  title={`Locate ${organ.name} in whole ${selectedGender} body atlas`}
                >
                  <span>View in Body Atlas</span>
                </button>
              </div>
            </RevealBlock>
          );
        })}
      </div>
    </div>
  );
}
