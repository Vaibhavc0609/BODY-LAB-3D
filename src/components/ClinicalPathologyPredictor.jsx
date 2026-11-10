import { useState, useMemo } from "react";
import {
  ORGAN_PATHOLOGY_DATABASE,
  resolvePathologyOrganKey,
  predictClinicalPathology,
} from "../data/pathologyData";

export default function ClinicalPathologyPredictor({ organId }) {
  const dbData = useMemo(() => {
    const resolvedKey = resolvePathologyOrganKey(organId);
    return ORGAN_PATHOLOGY_DATABASE[resolvedKey] || ORGAN_PATHOLOGY_DATABASE.heart;
  }, [organId]);

  const [selectedSymptoms, setSelectedSymptoms] = useState(() => {
    return dbData?.conditions?.[0]?.keySymptoms?.slice(0, 2) || [];
  });

  const toggleSymptom = (sId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };

  const selectScenario = (scenario) => {
    if (scenario === "acute" && dbData.conditions[0]) {
      setSelectedSymptoms(dbData.conditions[0].keySymptoms);
    } else if (scenario === "chronic") {
      const targetCond = dbData.conditions[1] || dbData.conditions[0];
      if (targetCond) setSelectedSymptoms(targetCond.keySymptoms);
    } else if (scenario === "clear") {
      setSelectedSymptoms([]);
    }
  };

  const prediction = useMemo(() => {
    return predictClinicalPathology(organId, selectedSymptoms);
  }, [organId, selectedSymptoms]);

  const top = prediction.topCondition;

  return (
    <div className="clinical-predictor-card">
      <div className="predictor-header">
        <div className="predictor-title-group">
          <span className="predictor-badge">AI CLINICAL PATHOLOGY ENGINE</span>
          <h4 className="predictor-subtitle">{dbData.organName}</h4>
        </div>
        <div className="scenario-presets">
          <button
            className="scenario-btn"
            onClick={() => selectScenario("acute")}
            title="Simulate Acute Emergency Presentation"
          >
            Acute Case
          </button>
          {dbData.conditions.length > 1 && (
            <button
              className="scenario-btn"
              onClick={() => selectScenario("chronic")}
              title="Simulate Secondary / Chronic Presentation"
            >
              Chronic Case
            </button>
          )}
          <button
            className="scenario-btn clear-btn"
            onClick={() => selectScenario("clear")}
            title="Clear all symptoms"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Interactive Symptom Checkboxes / Chips */}
      <div className="symptom-section">
        <span className="symptom-header-label">
          SELECT PATIENT SYMPTOMS ({selectedSymptoms.length} active):
        </span>
        <div className="symptom-chips-grid">
          {dbData.symptoms.map((s) => {
            const isActive = selectedSymptoms.includes(s.id);
            return (
              <button
                key={s.id}
                className={`symptom-chip ${isActive ? "active" : ""}`}
                onClick={() => toggleSymptom(s.id)}
              >
                <span className="symptom-chip-label">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary ML Prediction Result Banner */}
      {top && (
        <div className="prediction-result-box">
          <div className="prediction-result-top">
            <div className="diagnosis-meta">
              <span className={`severity-tag severity-${top.severity.toLowerCase()}`}>
                {top.severity} SEVERITY
              </span>
              <span className="icd-code-pill">ICD-10: {top.icd10}</span>
            </div>
            <div className="confidence-meter-group">
              <span className="confidence-label">MATCH</span>
              <span className="confidence-percentage">{top.probability}%</span>
            </div>
          </div>

          <h3 className="predicted-condition-name">{top.name}</h3>

          <div className="probability-progress-bar">
            <div
              className="probability-fill"
              style={{ width: `${top.probability}%` }}
            />
          </div>

          {/* Biomarkers & Clinical Lab Indicators */}
          <div className="diagnostic-details-grid">
            <div className="detail-col">
              <span className="detail-col-title">CRITICAL BIOMARKERS</span>
              <ul className="detail-list">
                {top.biomarkers.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="detail-col">
              <span className="detail-col-title">RADIOLOGICAL IMAGING</span>
              <p className="detail-text">{top.imaging}</p>
            </div>
          </div>

          {/* Clinical Management Recommendation */}
          <div className="management-alert-box">
            <span className="management-label">EVIDENCE-BASED PROTOCOL:</span>
            <p className="management-text">{top.management}</p>
          </div>
        </div>
      )}

      {/* Differential Diagnosis Probability Ranking */}
      <div className="differential-rankings">
        <span className="rankings-title">DIFFERENTIAL PROBABILITY SPECTRUM</span>
        <div className="rankings-list">
          {prediction.rankedConditions.map((cond) => (
            <div key={cond.id} className="ranking-row">
              <div className="ranking-info">
                <span className="ranking-name">{cond.name}</span>
                <span className="ranking-icd">({cond.icd10})</span>
              </div>
              <div className="ranking-bar-wrap">
                <div className="ranking-mini-bar" style={{ width: `${cond.probability}%` }} />
                <span className="ranking-pct">{cond.probability}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
