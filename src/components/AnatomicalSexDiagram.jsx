import { useState } from "react";

/**
 * High-precision Sex-Dimorphic Anatomical Schematic Diagrams
 * Provides interactive, medically accurate vector diagrams for Male and Female anatomy.
 */
export default function AnatomicalSexDiagram({
  gender = "male",
  onSelectOrgan,
}) {
  const [hoveredNode, setHoveredNode] = useState(null);

  const isMale = gender === "male";

  // Male-specific anatomical landmarks & reproductive nodes
  const maleLandmarks = [
    {
      id: "brain",
      organId: "brain",
      label: "Hypothalamus-Pituitary Axis",
      latin: "Axis hypothalamo-hypophysialis",
      desc: "Pulsatile GnRH secretion drives LH (Leydig cells / testosterone) and FSH (Sertoli cells / spermatogenesis).",
      x: 180,
      y: 42,
      accent: "#e5b869",
      system: "Endocrine & Nervous",
    },
    {
      id: "larynx",
      organId: "larynx",
      label: "Laryngeal Prominence (Adam's Apple)",
      latin: "Prominentia laryngea",
      desc: "Enlarged thyroid cartilage driven by androgenic growth; lowers acoustic resonance to ~100–120 Hz.",
      x: 180,
      y: 95,
      accent: "#f3c978",
      system: "Respiratory",
    },
    {
      id: "heart",
      organId: "heart",
      label: "Heart & Systemic Aorta",
      latin: "Cor humanum / Aorta ascendens",
      desc: "Four-chambered muscular double pump; average mass 300–350g in adult males; stroke volume ~70–80 mL.",
      x: 195,
      y: 165,
      accent: "#f43f5e",
      system: "Cardiovascular",
    },
    {
      id: "lungs",
      organId: "lungs",
      label: "Bilateral Lungs & Bronchial Tree",
      latin: "Pulmones (Sinister et Dexter)",
      desc: "Total lung capacity ~6.0 L in males; ~300 million alveoli delivering ~250 mL O2/min at rest.",
      x: 145,
      y: 175,
      accent: "#34d399",
      system: "Respiratory",
    },
    {
      id: "liver",
      organId: "liver",
      label: "Liver & Hepatic Portal System",
      latin: "Hepar",
      desc: "Largest metabolic viscera (~1.5 kg); synthesizes sex hormone-binding globulin (SHBG) and clotting factors.",
      x: 155,
      y: 235,
      accent: "#eab308",
      system: "Digestive",
    },
    {
      id: "kidneys",
      organId: "kidneys",
      label: "Retroperitoneal Kidneys",
      latin: "Renes (Sinister et Dexter)",
      desc: "Bilateral nephron filtration (180 L/day GFR); secretes erythropoietin stimulated by androgens.",
      x: 205,
      y: 255,
      accent: "#f97316",
      system: "Renal",
    },
    {
      id: "prostate",
      organId: "prostate",
      label: "Prostate Gland & Seminal Vesicles",
      latin: "Prostata et Glandulae vesiculosae",
      desc: "Walnut-sized fibromuscular gland surrounding prostatic urethra; produces 30% of seminal volume rich in PSA and citrate.",
      x: 180,
      y: 335,
      accent: "#e5b869",
      system: "Male Reproductive",
    },
    {
      id: "testes",
      organId: "testes",
      label: "Testes & Seminiferous Tubules",
      latin: "Testes et Epididymides",
      desc: "Primary male gonads in scrotal thermoregulatory sac (34°C); Leydig cells produce 4–8 mg testosterone daily; generates ~100M sperm/day.",
      x: 180,
      y: 385,
      accent: "#e5b869",
      system: "Male Reproductive",
    },
    {
      id: "skeleton",
      organId: "skeleton",
      label: "Android Skeletal Pelvis",
      latin: "Pelvis androidea",
      desc: "Narrow, heart-shaped pelvic inlet; heavy cortical bone structure; acute subpubic angle (< 70°).",
      x: 225,
      y: 315,
      accent: "#a8a29e",
      system: "Skeletal",
    },
  ];

  // Female-specific anatomical landmarks & reproductive nodes
  const femaleLandmarks = [
    {
      id: "brain",
      organId: "brain",
      label: "Hypothalamus-Pituitary-Ovarian (HPO) Axis",
      latin: "Axis hypothalamo-hypophysio-ovaricus",
      desc: "Cyclic GnRH pulses dictate monthly LH surge and FSH follicular recruitment for ovulation.",
      x: 180,
      y: 42,
      accent: "#ec4899",
      system: "Endocrine & Nervous",
    },
    {
      id: "thyroid",
      organId: "thyroid",
      label: "Thyroid Gland (Endocrine Core)",
      latin: "Glandula thyroidea",
      desc: "Butterfly-shaped endocrine organ (15–20g); regulates basal metabolic rate, body temperature, and menstrual ovulatory cyclicity.",
      x: 180,
      y: 95,
      accent: "#f43f5e",
      system: "Endocrine",
    },
    {
      id: "heart",
      organId: "heart",
      label: "Heart & Mediastinal Vessels",
      latin: "Cor humanum / Vasculatura",
      desc: "Four-chambered pump; average mass 250–300g; pre-menopausal estrogen provides vascular nitric oxide endothelial protection.",
      x: 195,
      y: 165,
      accent: "#f43f5e",
      system: "Cardiovascular",
    },
    {
      id: "lungs",
      organId: "lungs",
      label: "Bilateral Lungs & Diaphragm",
      latin: "Pulmones (Sinister et Dexter)",
      desc: "Total lung capacity ~4.5–5.0 L; high diaphragmatic excursion adapting to pelvic volume.",
      x: 145,
      y: 175,
      accent: "#34d399",
      system: "Respiratory",
    },
    {
      id: "liver",
      organId: "liver",
      label: "Liver & Biliary Tree",
      latin: "Hepar et Vesica biliaris",
      desc: "Metabolizes estrogens and progesterone; produces pregnancy plasma carrier proteins.",
      x: 155,
      y: 235,
      accent: "#eab308",
      system: "Digestive",
    },
    {
      id: "kidneys",
      organId: "kidneys",
      label: "Retroperitoneal Kidneys",
      latin: "Renes (Sinister et Dexter)",
      desc: "Filtration and fluid volume regulation; adapts to 40–50% plasma volume expansion during gestation.",
      x: 205,
      y: 255,
      accent: "#f97316",
      system: "Renal",
    },
    {
      id: "uterus",
      organId: "uterus",
      label: "Uterus & Endometrial Cavity",
      latin: "Uterus (Corpus, Fundus et Cervix)",
      desc: "Hollow, thick-walled muscular gestational organ (7.5 × 5 × 2.5 cm); cyclical proliferative and secretory endometrial regeneration.",
      x: 180,
      y: 335,
      accent: "#ec4899",
      system: "Female Reproductive",
    },
    {
      id: "ovaries",
      organId: "ovaries",
      label: "Bilateral Ovaries & Folliculogenesis",
      latin: "Ovaria (Sinister et Dexter)",
      desc: "Female primary gonads; reservoir of primordial follicles (~300,000 at menarche); cyclical secretion of estradiol and progesterone.",
      x: 140,
      y: 330,
      accent: "#ec4899",
      system: "Female Reproductive",
    },
    {
      id: "fallopian_tubes",
      organId: "fallopian_tubes",
      label: "Fallopian Tubes (Oviducts) & Fimbriae",
      latin: "Tubae uterinae (Salpinges)",
      desc: "10–12 cm ciliated bilateral conduits; fimbriated infundibulum captures ovulated oocyte; ampulla is normal site of fertilization.",
      x: 220,
      y: 330,
      accent: "#f43f5e",
      system: "Female Reproductive",
    },
    {
      id: "cervix_vagina",
      organId: "cervix_vagina",
      label: "Cervix & Vaginal Canal",
      latin: "Cervix uteri et Vagina",
      desc: "Fibromuscular inferior uterine gateway producing fertile mucus (spinnbarkeit); expandable fibroelastic birth canal.",
      x: 180,
      y: 375,
      accent: "#fb7185",
      system: "Female Reproductive",
    },
    {
      id: "skeleton",
      organId: "skeleton",
      label: "Gynecoid Skeletal Pelvis",
      latin: "Pelvis gynecoidea",
      desc: "Broad, round-oval pelvic brim optimized for human parturition; obtuse subpubic arch (> 90°); wide sciatic notches.",
      x: 232,
      y: 305,
      accent: "#a8a29e",
      system: "Skeletal",
    },
  ];

  const landmarks = isMale ? maleLandmarks : femaleLandmarks;
  const activeLandmark = hoveredNode || landmarks[isMale ? 6 : 6]; // default to prostate or uterus

  return (
    <div className={`anatomical-diagram-card ${isMale ? "male-theme" : "female-theme"}`}>
      {/* Diagram HUD Header */}
      <div className="diagram-header-bar">
        <div className="diagram-header-left">
          <span className="diagram-tag">
            {isMale ? "MALE ANATOMICAL SCHEMATIC" : "FEMALE ANATOMICAL SCHEMATIC"}
          </span>
          <h3 className="diagram-title">
            {isMale
              ? "Male Anatomical & Reproductive Architecture"
              : "Female Anatomical & Gynecological Architecture"}
          </h3>
          <p className="diagram-subtitle">
            {isMale
              ? "Comprehensive anatomical map displaying masculine visceral morphology, android pelvic girdle, and androgenic endocrine axis."
              : "Comprehensive anatomical map displaying feminine visceral morphology, gynecoid pelvic girdle, and cyclic ovarian-uterine axis."}
          </p>
        </div>

        <div className="diagram-stats-chips">
          <div className="stat-chip">
            <span className="chip-label">{isMale ? "Hormonal Axis" : "Hormonal Axis"}</span>
            <span className="chip-val">{isMale ? "Testosterone / DHT" : "Estradiol / Progesterone"}</span>
          </div>
          <div className="stat-chip">
            <span className="chip-label">Pelvic Type</span>
            <span className="chip-val">{isMale ? "Android (<70° Arch)" : "Gynecoid (>90° Brim)"}</span>
          </div>
          <div className="stat-chip">
            <span className="chip-label">Interactive Nodes</span>
            <span className="chip-val">{landmarks.length} Active Hotspots</span>
          </div>
        </div>
      </div>

      {/* Main Diagram Viewport: Vector Schematic + Live Anatomical HUD Readout */}
      <div className="diagram-body-grid">
        {/* Left: Interactive Vector Body Diagram */}
        <div className="diagram-svg-container">
          <svg viewBox="0 0 360 490" className="anatomical-schematic-svg">
            <defs>
              <linearGradient id={isMale ? "maleContourGrad" : "femaleContourGrad"} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isMale ? "#e5b869" : "#ec4899"} stopOpacity="0.65" />
                <stop offset="100%" stopColor={isMale ? "#78521b" : "#be185d"} stopOpacity="0.2" />
              </linearGradient>

              <filter id="diagramGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Medical Grid */}
            <g className="diagram-grid-lines" opacity="0.15">
              <line x1="0" y1="50" x2="360" y2="50" stroke={isMale ? "#e5b869" : "#ec4899"} strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="360" y2="120" stroke={isMale ? "#e5b869" : "#ec4899"} strokeDasharray="3 3" />
              <line x1="0" y1="210" x2="360" y2="210" stroke={isMale ? "#e5b869" : "#ec4899"} strokeDasharray="3 3" />
              <line x1="0" y1="310" x2="360" y2="310" stroke={isMale ? "#e5b869" : "#ec4899"} strokeDasharray="3 3" />
              <line x1="0" y1="410" x2="360" y2="410" stroke={isMale ? "#e5b869" : "#ec4899"} strokeDasharray="3 3" />
              <line x1="180" y1="0" x2="180" y2="490" stroke={isMale ? "#e5b869" : "#ec4899"} strokeDasharray="2 4" />
            </g>

            {/* Sex-Dimorphic Body Contours */}
            {isMale ? (
              // MALE SILHOUETTE: Broad shoulders, narrow android waist, scrotal anatomy
              <g className="male-silhouette-group" stroke="#e5b869" strokeWidth="1.6" fill="url(#maleContourGrad)">
                {/* Cranium & Neck */}
                <ellipse cx="180" cy="45" rx="28" ry="34" />
                <path d="M168 76 L168 106 L192 106 L192 76" />
                {/* Broad Deltoids & Masculine Torso */}
                <path d="M168 106 L108 126 L96 165 L118 215 L130 295 L144 320 L180 325 L216 320 L230 295 L242 215 L264 165 L252 126 L192 106 Z" />
                {/* Android Pelvic Basin & Male Genitalia */}
                <path d="M144 320 L158 368 L170 380 L180 395 L190 380 L202 368 L216 320 Z" />
                {/* Scrotal Sac */}
                <ellipse cx="180" cy="385" rx="14" ry="16" fill="rgba(229, 184, 105, 0.25)" stroke="#e5b869" strokeDasharray="2 2" />
                {/* Upper Limbs */}
                <path d="M96 165 L76 265 L68 340 L80 342 L92 268 L114 185 Z" opacity="0.65" />
                <path d="M264 165 L284 265 L292 340 L280 342 L268 268 L246 185 Z" opacity="0.65" />
                {/* Thighs */}
                <path d="M152 375 L138 480 L166 480 L174 410 Z" opacity="0.65" />
                <path d="M208 375 L222 480 L194 480 L186 410 Z" opacity="0.65" />
              </g>
            ) : (
              // FEMALE SILHOUETTE: Hourglass waist, wide gynecoid hips, mammary contours
              <g className="female-silhouette-group" stroke="#ec4899" strokeWidth="1.6" fill="url(#femaleContourGrad)">
                {/* Cranium & Slender Neck */}
                <ellipse cx="180" cy="45" rx="25" ry="32" />
                <path d="M172 74 L172 104 L188 104 L188 74" />
                {/* Feminine Shoulders, Mammary Arcs & Hourglass Waist */}
                <path d="M172 104 L126 122 L116 160 C128 178, 148 185, 154 195 C146 225, 134 255, 134 275 C134 295, 122 315, 120 330 L180 338 L240 330 C238 315, 226 295, 226 275 C226 255, 214 225, 206 195 C212 185, 232 178, 244 160 L234 122 L188 104 Z" />
                {/* Mammary contours */}
                <path d="M136 172 C142 192, 164 192, 172 178" fill="none" stroke="#ec4899" strokeWidth="1.4" opacity="0.8" />
                <path d="M224 172 C218 192, 196 192, 188 178" fill="none" stroke="#ec4899" strokeWidth="1.4" opacity="0.8" />
                {/* Gynecoid Pelvis / Uterine Basin */}
                <ellipse cx="180" cy="336" rx="26" ry="18" fill="rgba(236, 72, 153, 0.3)" stroke="#ec4899" strokeDasharray="2 2" />
                {/* Upper Limbs */}
                <path d="M116 160 L98 255 L90 330 L102 332 L114 260 L130 180 Z" opacity="0.65" />
                <path d="M244 160 L262 255 L270 330 L258 332 L246 260 L230 180 Z" opacity="0.65" />
                {/* Thighs */}
                <path d="M132 342 L124 480 L152 480 L168 375 Z" opacity="0.65" />
                <path d="M228 342 L236 480 L208 480 L192 375 Z" opacity="0.65" />
              </g>
            )}

            {/* Interactive Organ Hotspot Nodes */}
            {landmarks.map((lm) => {
              const isSelected = activeLandmark?.id === lm.id;
              return (
                <g
                  key={lm.id}
                  className={`diagram-node-point ${isSelected ? "selected" : ""}`}
                  transform={`translate(${lm.x}, ${lm.y})`}
                  onMouseEnter={() => setHoveredNode(lm)}
                  onClick={() => onSelectOrgan && onSelectOrgan(lm.organId)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Outer Pulsing Target Halo */}
                  <circle
                    r={isSelected ? 14 : 9}
                    fill="none"
                    stroke={lm.accent}
                    strokeWidth={isSelected ? 2.2 : 1.2}
                    opacity={isSelected ? 1.0 : 0.6}
                    filter={isSelected ? "url(#diagramGlow)" : undefined}
                  />
                  {/* Inner Solid Hub */}
                  <circle r={isSelected ? 5.5 : 3.8} fill={lm.accent} />
                  {/* Crosshairs if selected */}
                  {isSelected && (
                    <g stroke={lm.accent} strokeWidth="1.2" opacity="0.8">
                      <line x1="-18" y1="0" x2="-8" y2="0" />
                      <line x1="8" y1="0" x2="18" y2="0" />
                      <line x1="0" y1="-18" x2="0" y2="-8" />
                      <line x1="0" y1="8" x2="0" y2="18" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Live Anatomical HUD Readout for Hovered / Active Landmark */}
        <div className="diagram-hud-panel">
          <div className="hud-badge-row">
            <span className="hud-system-badge" style={{ borderColor: activeLandmark.accent, color: activeLandmark.accent }}>
              {activeLandmark.system}
            </span>
            <span className="hud-status-badge">TARGET LOCKED</span>
          </div>

          <h4 className="hud-organ-name">{activeLandmark.label}</h4>
          <span className="hud-latin-name">{activeLandmark.latin}</span>

          <p className="hud-desc-text">{activeLandmark.desc}</p>

          <div className="hud-dimorphism-card">
            <div className="dimorphism-header">
              <span className="dimorphism-title">
                {isMale ? "MALE ANATOMICAL SPECIFICATION" : "FEMALE ANATOMICAL SPECIFICATION"}
              </span>
            </div>
            <p className="dimorphism-body">
              {isMale
                ? activeLandmark.id === "testes"
                  ? "Bilateral gonads (15–20g each). Thermoregulation maintains spermatogenesis at 34°C. Leydig cells generate ~95% of circulating testosterone."
                  : activeLandmark.id === "prostate"
                  ? "Walnut-sized gland encircling the urethra. Secretes milky alkaline solution containing citric acid, calcium, and PSA."
                  : activeLandmark.id === "skeleton"
                  ? "Heavier android pelvis characterized by high bone mineral density, prominent muscle attachment crests, and acute pubic arch."
                  : "Organized for male physiology with elevated circulating hemoglobin and androgen-responsive metabolic receptors."
                : activeLandmark.id === "uterus"
                ? "Gestation organ composed of outer perimetrium, thick muscular myometrium, and hormone-responsive inner endometrium."
                : activeLandmark.id === "ovaries"
                ? "Bilateral female gonads housing germline follicles. Synthesize cyclical estradiol, progesterone, and anti-Müllerian hormone (AMH)."
                : activeLandmark.id === "fallopian_tubes"
                ? "Tubal ampulla provides mucosal microenvironment for capacitation and syngamy; rhythmic ciliary beats sweep zygote toward fundus."
                : activeLandmark.id === "skeleton"
                ? "Broad gynecoid pelvic architecture with wide subpubic arch (>90°), flared iliac blades, and round obstetric inlet."
                : "Organized for female physiology featuring cyclical estrogenic modulation and gestational organ volume adaptation."}
            </p>
          </div>

          <div className="hud-action-row">
            <button
              className="hud-inspect-btn"
              onClick={() => onSelectOrgan && onSelectOrgan(activeLandmark.organId)}
              style={{
                background: isMale
                  ? "linear-gradient(135deg, #e5b869 0%, #b8863b 100%)"
                  : "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                color: isMale ? "#14110b" : "#ffffff",
                boxShadow: isMale
                  ? "0 4px 18px rgba(229, 184, 105, 0.38)"
                  : "0 4px 18px rgba(236, 72, 153, 0.4)",
              }}
              title={`Open ${activeLandmark.label} in 3D Explorer Inspection Mode`}
            >
              <span>Dismantle & Inspect in 3D Explorer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

