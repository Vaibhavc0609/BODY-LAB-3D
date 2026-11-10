/**
 * Clinical Pathology & Machine Learning Diagnostic Knowledge Base
 * Powers in-browser diagnostic probability calculation, ICD-10 mapping,
 * biomarker indicators, and symptom risk assessments for all 54 human organs.
 */

export const ORGAN_PATHOLOGY_DATABASE = {
  heart: {
    organId: "heart",
    organName: "Heart & Coronary Vasculature",
    symptoms: [
      { id: "angina", label: "Retrosternal Angina", weight: 0.35 },
      { id: "dyspnea", label: "Exertional Dyspnea", weight: 0.25 },
      { id: "orthopnea", label: "Orthopnea / PND", weight: 0.2 },
      { id: "palpitations", label: "Palpitations / Tachycardia", weight: 0.15 },
      { id: "edema", label: "Bilateral Ankle Edema", weight: 0.2 },
      { id: "syncope", label: "Exertional Syncope", weight: 0.3 },
      { id: "diaphoresis", label: "Cold Diaphoresis", weight: 0.25 },
    ],
    conditions: [
      {
        id: "acs",
        name: "Acute Coronary Syndrome (STEMI / NSTEMI)",
        icd10: "I21.9",
        keySymptoms: ["angina", "diaphoresis", "dyspnea"],
        severity: "CRITICAL",
        biomarkers: ["hs-cTnI > 52 ng/L", "CK-MB > 25 U/L", "Myoglobin Elevated"],
        imaging: "Emergent 12-Lead ECG & Invasive Coronary Angiography",
        management: "Dual antiplatelet therapy, anticoagulation, emergency PCI catheterization.",
      },
      {
        id: "chf",
        name: "Congestive Heart Failure (NYHA Class III/IV)",
        icd10: "I50.9",
        keySymptoms: ["dyspnea", "orthopnea", "edema"],
        severity: "HIGH",
        biomarkers: ["NT-proBNP > 1,800 pg/mL", "Serum Sodium < 135 mEq/L"],
        imaging: "Transthoracic Echocardiogram (TTE) showing EF < 35%",
        management: "Loop diuretics (Furosemide), ARNI/ACEi, beta-blocker, SGLT2 inhibitor.",
      },
      {
        id: "afib",
        name: "Atrial Fibrillation (RVR)",
        icd10: "I48.91",
        keySymptoms: ["palpitations", "syncope", "dyspnea"],
        severity: "MODERATE",
        biomarkers: ["TSH Panel", "Serum Potassium / Magnesium"],
        imaging: "Telemetry / 12-Lead ECG showing irregularly irregular RR intervals",
        management: "Rate control (Metoprolol / Diltiazem), stroke thromboprophylaxis (DOAC).",
      },
    ],
  },

  vasculature: {
    organId: "vasculature",
    organName: "Aorta & Systemic Great Vessels",
    symptoms: [
      { id: "tearing_pain", label: "Tearing Interscapular Pain", weight: 0.4 },
      { id: "pulse_deficit", label: "Bilateral BP / Pulse Deficit", weight: 0.35 },
      { id: "claudication", label: "Lower Limb Claudication", weight: 0.25 },
      { id: "svc_swelling", label: "Facial / Neck Venous Congestion", weight: 0.3 },
      { id: "syncope", label: "Hypotensive Syncope", weight: 0.3 },
      { id: "pulsatile_mass", label: "Pulsatile Abdominal Mass", weight: 0.3 },
    ],
    conditions: [
      {
        id: "aortic_dissection",
        name: "Acute Thoracic Aortic Dissection (Stanford Type A)",
        icd10: "I71.01",
        keySymptoms: ["tearing_pain", "pulse_deficit", "syncope"],
        severity: "CRITICAL",
        biomarkers: ["D-Dimer Markedly Elevated", "Lactate Elevation"],
        imaging: "Emergent CT Angiography (CTA) demonstrating intimal flap & false lumen",
        management: "IV Esmolol (target HR < 60 bpm, SBP < 110 mmHg), emergent cardiothoracic surgical repair.",
      },
      {
        id: "aaa",
        name: "Abdominal Aortic Aneurysm (AAA)",
        icd10: "I71.4",
        keySymptoms: ["pulsatile_mass", "tearing_pain", "syncope"],
        severity: "HIGH",
        biomarkers: ["Hemoglobin / Hematocrit Baseline", "Crossmatch"],
        imaging: "Contrast Abdominal CTA / Duplex Ultrasound (> 5.5 cm diameter)",
        management: "Endovascular aneurysm repair (EVAR) or open synthetic graft replacement.",
      },
      {
        id: "svc_syndrome",
        name: "Superior Vena Cava Obstruction",
        icd10: "I87.1",
        keySymptoms: ["svc_swelling", "claudication"],
        severity: "HIGH",
        biomarkers: ["Tissue Biopsy / D-Dimer"],
        imaging: "Contrast Thoracic CT Venography showing mediastinal venous compression",
        management: "Head-of-bed elevation, endovascular stenting, targeted etiology therapy.",
      },
    ],
  },

  lungs: {
    organId: "lungs",
    organName: "Lungs & Respiratory Tree",
    symptoms: [
      { id: "cough", label: "Purulent Productive Cough", weight: 0.25 },
      { id: "pleuritic_pain", label: "Pleuritic Chest Pain", weight: 0.3 },
      { id: "hemoptysis", label: "Hemoptysis (Blood Sputum)", weight: 0.4 },
      { id: "wheezing", label: "Expiratory Wheezing", weight: 0.25 },
      { id: "hypoxemia", label: "Hypoxemia (SpO2 < 90%)", weight: 0.35 },
      { id: "tachypnea", label: "Tachypnea (> 26 bpm)", weight: 0.2 },
      { id: "fever", label: "High Pyrexia (> 38.5°C)", weight: 0.2 },
    ],
    conditions: [
      {
        id: "pneumonia",
        name: "Community-Acquired Lobar Pneumonia",
        icd10: "J18.9",
        keySymptoms: ["cough", "fever", "pleuritic_pain", "hypoxemia"],
        severity: "HIGH",
        biomarkers: ["Procalcitonin > 0.5 mcg/L", "CRP > 120 mg/L", "WBC > 15,000/mcL"],
        imaging: "Chest X-Ray (CXR) showing dense lobar alveolar consolidation",
        management: "Empiric beta-lactam + macrolide antibiotic coverage, supplemental O2.",
      },
      {
        id: "pe",
        name: "Acute Massive Pulmonary Embolism",
        icd10: "I26.99",
        keySymptoms: ["pleuritic_pain", "hypoxemia", "tachypnea", "hemoptysis"],
        severity: "CRITICAL",
        biomarkers: ["D-Dimer > 2,500 ng/mL FEU", "Troponin I Elevation"],
        imaging: "CT Pulmonary Angiography (CTPA) showing luminal filling defect",
        management: "Therapeutic anticoagulation (Heparin/LMWH), systemic thrombolysis if massive.",
      },
      {
        id: "copd",
        name: "Acute Exacerbation of COPD",
        icd10: "J44.1",
        keySymptoms: ["cough", "wheezing", "hypoxemia", "tachypnea"],
        severity: "MODERATE",
        biomarkers: ["ABG: PaCO2 > 50 mmHg, PaO2 < 60 mmHg"],
        imaging: "High-Res Chest CT showing centrilobular emphysema & hyperinflation",
        management: "Inhaled bronchodilators (SABA/SAMA), systemic corticosteroids, NIV support.",
      },
    ],
  },

  respiratory_airway: {
    organId: "respiratory_airway",
    organName: "Larynx, Trachea & Airway",
    symptoms: [
      { id: "stridor", label: "Inspiratory Stridor", weight: 0.4 },
      { id: "hoarseness", label: "Progressive Hoarseness / Dysphonia", weight: 0.3 },
      { id: "dysphagia", label: "Odynophagia & Drooling", weight: 0.35 },
      { id: "bark_cough", label: "Brassy Seal-Bark Cough", weight: 0.25 },
      { id: "hypoxemia", label: "Airway Obstruction Hypoxia", weight: 0.3 },
    ],
    conditions: [
      {
        id: "epiglottitis",
        name: "Acute Supracricoid Epiglottitis / Airway Edema",
        icd10: "J05.10",
        keySymptoms: ["stridor", "dysphagia", "hypoxemia"],
        severity: "CRITICAL",
        biomarkers: ["Blood Cultures", "Inflammatory Leukocytosis"],
        imaging: "Lateral Neck Radiograph ('Thumbprint' sign) — secure airway prior to transport",
        management: "Immediate endotracheal intubation readiness, IV Ceftriaxone + Corticosteroids.",
      },
      {
        id: "laryngitis_nodule",
        name: "Chronic Vocal Cord Dysfunction / Paralysis",
        icd10: "J38.0",
        keySymptoms: ["hoarseness", "bark_cough"],
        severity: "MODERATE",
        biomarkers: ["Viral / Autoimmune Panel"],
        imaging: "Flexible Fiberoptic Nasolaryngoscopy & Videostroboscopy",
        management: "Voice rest, speech pathology rehabilitation, surgical medialization if unilateral palsy.",
      },
    ],
  },

  brain: {
    organId: "brain",
    organName: "Cerebrum, Brainstem & CNS",
    symptoms: [
      { id: "hemiparesis", label: "Acute Unilateral Hemiparesis", weight: 0.4 },
      { id: "aphasia", label: "Expressive / Receptive Aphasia", weight: 0.35 },
      { id: "cephalea", label: "Thunderclap Severe Cephalea", weight: 0.3 },
      { id: "facial_droop", label: "Unilateral Facial Droop", weight: 0.3 },
      { id: "vertigo", label: "Cerebellar Ataxia & Vertigo", weight: 0.25 },
      { id: "seizure", label: "New-Onset Epileptic Seizure", weight: 0.35 },
      { id: "altered_mental", label: "Depressed GCS / Sensorium", weight: 0.35 },
    ],
    conditions: [
      {
        id: "stroke",
        name: "Acute Ischemic Stroke (MCA Territory)",
        icd10: "I63.9",
        keySymptoms: ["hemiparesis", "aphasia", "facial_droop"],
        severity: "CRITICAL",
        biomarkers: ["Coagulation Profile (INR/PTT)", "Point-of-Care Glucose"],
        imaging: "Non-contrast Head CT followed by DWI/ADC Brain MRI & CT Angiography",
        management: "IV Alteplase / Tenecteplase within 4.5h window; mechanical thrombectomy.",
      },
      {
        id: "sah",
        name: "Aneurysmal Subarachnoid Hemorrhage",
        icd10: "I60.9",
        keySymptoms: ["cephalea", "altered_mental", "seizure"],
        severity: "CRITICAL",
        biomarkers: ["CSF Xanthochromia on Lumbar Puncture"],
        imaging: "Non-contrast CT Brain showing basal cistern hyperdensity; CTA",
        management: "Emergent endovascular aneurysm coiling, Nimodipine vasospasm prophylaxis.",
      },
      {
        id: "cerebellar_ataxia",
        name: "Posterior Circulation / Cerebellar Infarct",
        icd10: "G11.9",
        keySymptoms: ["vertigo", "altered_mental", "cephalea"],
        severity: "HIGH",
        biomarkers: ["Serum Toxicology & Electrolytes"],
        imaging: "Posterior Fossa Brain MRI (DWI) demonstrating cerebellar ischemia",
        management: "Neuro-ICU airway/ICP monitoring, posterior fossa decompression if edema ensues.",
      },
    ],
  },

  brainstem_spinal: {
    organId: "brainstem_spinal",
    organName: "Spinal Cord & Brainstem Tracts",
    symptoms: [
      { id: "paraparesis", label: "Bilateral Limb Weakness", weight: 0.4 },
      { id: "saddle_anesthesia", label: "Saddle Anesthesia / Bowel Loss", weight: 0.4 },
      { id: "sensory_level", label: "Dermatomal Sensory Level", weight: 0.35 },
      { id: "hyperreflexia", label: "Spasticity & Hyperreflexia", weight: 0.25 },
      { id: "cranial_palsy", label: "Crossed Cranial Nerve Palsy", weight: 0.3 },
    ],
    conditions: [
      {
        id: "cauda_equina",
        name: "Cauda Equina / Acute Cord Compression",
        icd10: "G83.4",
        keySymptoms: ["paraparesis", "saddle_anesthesia", "sensory_level"],
        severity: "CRITICAL",
        biomarkers: ["Post-void Residual Bladder Volume > 200 mL", "ESR/CRP"],
        imaging: "Emergent Whole-Spine Sagittal T2 MRI showing canal effacement",
        management: "Emergent surgical spinal decompression (< 24h), high-dose IV Dexamethasone.",
      },
      {
        id: "myelopathy",
        name: "Cervical Spondylotic Myelopathy",
        icd10: "M47.12",
        keySymptoms: ["hyperreflexia", "paraparesis", "sensory_level"],
        severity: "HIGH",
        biomarkers: ["Vitamin B12, Copper Levels (rule out SACD)"],
        imaging: "Cervical Spine MRI demonstrating intramedullary T2 cord hyperintensity",
        management: "Cervical collar immobilization followed by anterior/posterior decompression.",
      },
    ],
  },

  stomach: {
    organId: "stomach",
    organName: "Stomach, Esophagus & Upper GI",
    symptoms: [
      { id: "epigastric_pain", label: "Burning Epigastric Pain", weight: 0.35 },
      { id: "hematemesis", label: "Hematemesis / Coffee-Ground Emesis", weight: 0.4 },
      { id: "melena", label: "Melena (Black Tarry Stool)", weight: 0.35 },
      { id: "early_satiety", label: "Early Satiety & Postprandial Bloating", weight: 0.25 },
      { id: "dysphagia_gi", label: "Solid-to-Liquid Dysphagia", weight: 0.3 },
      { id: "reflux", label: "Refractory Acid Regurgitation", weight: 0.2 },
    ],
    conditions: [
      {
        id: "pud_bleed",
        name: "Peptic Ulcer Disease with Upper GI Hemorrhage",
        icd10: "K27.4",
        keySymptoms: ["epigastric_pain", "hematemesis", "melena"],
        severity: "CRITICAL",
        biomarkers: ["Hemoglobin Drop", "BUN/Creatinine Ratio > 30:1", "H. pylori Antigen"],
        imaging: "Urgent Esophagogastroduodenoscopy (EGD) with hemostatic clipping",
        management: "IV Proton Pump Inhibitor (Pantoprazole) infusion, fluid resuscitation, endoscopic hemostasis.",
      },
      {
        id: "gastroparesis",
        name: "Diabetic / Idiopathic Gastroparesis",
        icd10: "K31.84",
        keySymptoms: ["early_satiety", "reflux", "epigastric_pain"],
        severity: "MODERATE",
        biomarkers: ["HbA1c", "Serum Electrolytes (Hypokalemia)"],
        imaging: "4-Hour Solid-Phase Gastric Emptying Scintigraphy (> 10% retention at 4h)",
        management: "Small low-fiber low-fat meals, prokinetics (Metoclopramide / Erythromycin).",
      },
      {
        id: "gerd_esophagitis",
        name: "Erosive Reflux Esophagitis / Stricture",
        icd10: "K21.0",
        keySymptoms: ["reflux", "dysphagia_gi", "epigastric_pain"],
        severity: "MODERATE",
        biomarkers: ["Upper GI Biopsy / 24h pH Impedance"],
        imaging: "Upper Endoscopy (EGD) & Barium Esophagram",
        management: "Once-daily PPI therapy, lifestyle elevation, endoscopic dilation if strictured.",
      },
    ],
  },

  intestines: {
    organId: "intestines",
    organName: "Small Intestine, Colon & Appendix",
    symptoms: [
      { id: "rlq_pain", label: "Migratory RLQ Abdominal Pain", weight: 0.4 },
      { id: "obstipation", label: "Obstipation & Bilious Vomiting", weight: 0.35 },
      { id: "hematochezia", label: "Hematochezia (Bloody Stool)", weight: 0.35 },
      { id: "chronic_diarrhea", label: "Chronic Mucoid / Nocturnal Diarrhea", weight: 0.3 },
      { id: "rebound", label: "Peritoneal Guarding & Rebound", weight: 0.35 },
      { id: "fever_gi", label: "Low-Grade Fever & Anorexia", weight: 0.2 },
    ],
    conditions: [
      {
        id: "appendicitis",
        name: "Acute Appendicitis (Perforation Risk)",
        icd10: "K35.80",
        keySymptoms: ["rlq_pain", "rebound", "fever_gi"],
        severity: "CRITICAL",
        biomarkers: ["WBC > 13,500/mcL with Left Shift", "CRP Elevated"],
        imaging: "Abdominal CT with IV Contrast showing dilated appendix (> 6 mm) & fat stranding",
        management: "NPO, IV broad-spectrum antibiotics, emergent laparoscopic appendectomy.",
      },
      {
        id: "sbo",
        name: "Acute Mechanical Small Bowel Obstruction",
        icd10: "K56.60",
        keySymptoms: ["obstipation", "rebound"],
        severity: "HIGH",
        biomarkers: ["Serum Lactate (screen for strangulation)", "Metabolic Alkalosis"],
        imaging: "CT Abdomen/Pelvis showing transition point & dilated air-fluid loops",
        management: "Nasogastric tube decompression, IV hydration, surgical adhesiolysis if strangulated.",
      },
      {
        id: "ibd_crohns",
        name: "Crohn's Disease / Ulcerative Colitis Flare",
        icd10: "K50.90",
        keySymptoms: ["chronic_diarrhea", "hematochezia", "rlq_pain"],
        severity: "MODERATE",
        biomarkers: ["Fecal Calprotectin > 250 mcg/g", "ESR/CRP", "Anemia Panel"],
        imaging: "Ileocolonoscopy with Biopsy & MR Enterography ('Cobblestone' mucosa)",
        management: "Systemic corticosteroid induction followed by targeted Biologic (Anti-TNF).",
      },
    ],
  },

  pancreas: {
    organId: "pancreas",
    organName: "Pancreas (Exocrine & Islets)",
    symptoms: [
      { id: "epigastric_back", label: "Epigastric Pain Radiating to Back", weight: 0.4 },
      { id: "steatorrhea", label: "Oily Foul-Smelling Steatorrhea", weight: 0.3 },
      { id: "painless_jaundice", label: "Painless Obstructive Jaundice", weight: 0.35 },
      { id: "nausea_vomiting", label: "Intractable Nausea & Emesis", weight: 0.25 },
      { id: "hyperglycemia", label: "Sudden Brittle Hyperglycemia", weight: 0.25 },
    ],
    conditions: [
      {
        id: "acute_pancreatitis",
        name: "Acute Interstitial / Necrotizing Pancreatitis",
        icd10: "K85.9",
        keySymptoms: ["epigastric_back", "nausea_vomiting"],
        severity: "CRITICAL",
        biomarkers: ["Serum Lipase > 3x Upper Limit Normal", "Serum Amylase Elevated", "LDH"],
        imaging: "Contrast Abdominal CT demonstrating pancreatic edema, peripancreatic necrosis",
        management: "Aggressive isotonic Lactated Ringer's resuscitation, analgesia, early enteral nutrition.",
      },
      {
        id: "pancreatic_ca",
        name: "Pancreatic Head Adenocarcinoma",
        icd10: "C25.0",
        keySymptoms: ["painless_jaundice", "steatorrhea", "hyperglycemia"],
        severity: "CRITICAL",
        biomarkers: ["CA 19-9 Tumor Marker Elevated", "Direct Hyperbilirubinemia"],
        imaging: "Pancreatic-Protocol Triple-Phase CT showing hypoenhancing head mass ('Double Duct' sign)",
        management: "Endoscopic biliary stenting, EUS-FNA staging, Whipple pancreaticoduodenectomy / FOLFIRINOX.",
      },
    ],
  },

  liver: {
    organId: "liver",
    organName: "Liver & Hepatobiliary System",
    symptoms: [
      { id: "jaundice", label: "Scleral Icterus & Jaundice", weight: 0.35 },
      { id: "ruq_pain", label: "Right Upper Quadrant Colic", weight: 0.3 },
      { id: "ascites", label: "Abdominal Distension / Ascites", weight: 0.3 },
      { id: "asterixis", label: "Flapping Tremor (Asterixis)", weight: 0.35 },
      { id: "pruritus", label: "Intense Cholestatic Pruritus", weight: 0.2 },
      { id: "dark_urine", label: "Tea-Colored Urine & Acholic Stool", weight: 0.25 },
    ],
    conditions: [
      {
        id: "cirrhosis",
        name: "Decompensated Hepatic Cirrhosis (Child-Pugh C)",
        icd10: "K74.60",
        keySymptoms: ["ascites", "jaundice", "asterixis"],
        severity: "CRITICAL",
        biomarkers: ["Serum Albumin < 2.8 g/dL", "INR > 1.7", "Bilirubin > 3.0 mg/dL"],
        imaging: "Abdominal Doppler US showing nodular liver contour & portal hypertension",
        management: "Lactulose / Rifaximin for encephalopathy, Spironolactone/Furosemide, transplant eval.",
      },
      {
        id: "cholecystitis",
        name: "Acute Calculous Cholecystitis / Choledocholithiasis",
        icd10: "K80.00",
        keySymptoms: ["ruq_pain", "jaundice", "dark_urine"],
        severity: "HIGH",
        biomarkers: ["ALP > 280 U/L", "GGT Elevated", "WBC > 14,000/mcL"],
        imaging: "RUQ Ultrasound showing gallbladder wall > 4 mm, Murphy's sign, CBD dilation",
        management: "IV antibiotics, ERCP stone extraction followed by laparoscopic cholecystectomy.",
      },
    ],
  },

  gallbladder: {
    organId: "gallbladder",
    organName: "Gallbladder & Biliary Ducts",
    symptoms: [
      { id: "ruq_colic", label: "Postprandial Fatty Food RUQ Colic", weight: 0.4 },
      { id: "murphy", label: "Positive Sonographic Murphy's Sign", weight: 0.35 },
      { id: "jaundice_gb", label: "Obstructive Jaundice & Clay Stool", weight: 0.3 },
      { id: "fever_gb", label: "Rigors, Fever & Chills (Charcot's Triad)", weight: 0.35 },
    ],
    conditions: [
      {
        id: "acute_cholangitis",
        name: "Ascending Acute Cholangitis",
        icd10: "K83.0",
        keySymptoms: ["ruq_colic", "jaundice_gb", "fever_gb"],
        severity: "CRITICAL",
        biomarkers: ["Direct Bilirubin Elevated", "ALP Markedly High", "Blood Cultures Positive"],
        imaging: "MRCP / Ultrasound showing common bile duct obstruction & biliary dilation",
        management: "Emergent IV broad-spectrum antibiotics & urgent ERCP biliary decompression.",
      },
      {
        id: "cholelithiasis",
        name: "Symptomatic Cholelithiasis / Acute Cholecystitis",
        icd10: "K80.10",
        keySymptoms: ["ruq_colic", "murphy"],
        severity: "MODERATE",
        biomarkers: ["Mild Transaminitis", "Leukocytosis"],
        imaging: "RUQ Ultrasound demonstrating mobile echogenic gallstones with acoustic shadowing",
        management: "Analgesia, elective or early laparoscopic cholecystectomy.",
      },
    ],
  },

  spleen: {
    organId: "spleen",
    organName: "Spleen & Reticuloendothelial System",
    symptoms: [
      { id: "luq_pain", label: "Left Upper Quadrant Tenderness", weight: 0.35 },
      { id: "kehr_sign", label: "Referred Left Shoulder Pain (Kehr's Sign)", weight: 0.4 },
      { id: "splenomegaly", label: "Palpable LUQ Mass / Early Satiety", weight: 0.25 },
      { id: "cytopenia", label: "Pancytopenia & Easy Bruising", weight: 0.3 },
    ],
    conditions: [
      {
        id: "splenic_rupture",
        name: "Acute Splenic Subcapsular Hematoma / Laceration",
        icd10: "S36.03",
        keySymptoms: ["luq_pain", "kehr_sign"],
        severity: "CRITICAL",
        biomarkers: ["Serial Hemoglobin Drops", "Tachycardia / Hypotension"],
        imaging: "Contrast Abdominal CT showing splenic parenchymal contrast extravasation ('Blush')",
        management: "Resuscitation; splenic artery angioembolization or emergent splenectomy if unstable.",
      },
      {
        id: "hypersplenism",
        name: "Congestive Splenomegaly & Hypersplenism",
        icd10: "R16.1",
        keySymptoms: ["splenomegaly", "cytopenia", "luq_pain"],
        severity: "MODERATE",
        biomarkers: ["Thrombocytopenia < 100k", "Peripheral Smear Howell-Jolly Screening"],
        imaging: "Abdominal Ultrasound showing splenic span > 13 cm",
        management: "Treat underlying portal hypertension/hematologic disorder; encapsulated vaccine prophylaxis.",
      },
    ],
  },

  kidneys: {
    organId: "kidneys",
    organName: "Kidneys & Renal Cortex",
    symptoms: [
      { id: "flank_pain", label: "Colicky Costovertebral Flank Pain", weight: 0.35 },
      { id: "hematuria", label: "Gross / Microscopic Hematuria", weight: 0.3 },
      { id: "oliguria", label: "Oliguria (< 0.5 mL/kg/h)", weight: 0.35 },
      { id: "edema", label: "Periorbital & Ankle Edema", weight: 0.2 },
      { id: "hypertension", label: "Refractory Hypertension", weight: 0.2 },
      { id: "proteinuria", label: "Foamy Urine (Proteinuria)", weight: 0.25 },
      { id: "uremia", label: "Uremic Asterixis & Pruritus", weight: 0.3 },
    ],
    conditions: [
      {
        id: "stones",
        name: "Obstructive Nephrolithiasis (Ureteral Calculus)",
        icd10: "N20.0",
        keySymptoms: ["flank_pain", "hematuria"],
        severity: "MODERATE",
        biomarkers: ["Microscopic RBCs on Urinalysis", "Serum Calcium / Uric Acid"],
        imaging: "Non-contrast Helical CT KUB demonstrating obstructing ureteral calculus",
        management: "NSAID analgesia, medical expulsive therapy (Tamsulosin) or ureteroscopy / ESWL.",
      },
      {
        id: "aki",
        name: "Acute Kidney Injury (KDIGO Stage 2/3)",
        icd10: "N17.9",
        keySymptoms: ["oliguria", "edema", "uremia"],
        severity: "HIGH",
        biomarkers: ["Creatinine > 2.5x Baseline", "BUN > 80 mg/dL", "Hyperkalemia > 5.8 mEq/L"],
        imaging: "Renal Ultrasound showing increased cortical echogenicity without obstruction",
        management: "Correct pre-renal hypoperfusion, stop nephrotoxins, urgent dialysis if refractory.",
      },
      {
        id: "ckd",
        name: "Chronic Kidney Disease (Stage 3b/4)",
        icd10: "N18.4",
        keySymptoms: ["proteinuria", "hypertension", "edema", "uremia"],
        severity: "HIGH",
        biomarkers: ["eGFR 15–44 mL/min/1.73m²", "UACR > 300 mg/g"],
        imaging: "Renal US showing bilaterally small echogenic kidneys with cortical thinning",
        management: "ACEi/ARB therapy, SGLT2 inhibitor, mineralocorticoid blockade, renal diet.",
      },
    ],
  },

  bladder: {
    organId: "bladder",
    organName: "Urinary Bladder & Lower Tract",
    symptoms: [
      { id: "dysuria", label: "Burning Dysuria & Suprapubic Urgency", weight: 0.35 },
      { id: "painless_hematuria", label: "Painless Gross Hematuria", weight: 0.4 },
      { id: "urinary_retention", label: "Acute Urinary Retention & Globe", weight: 0.35 },
      { id: "frequency", label: "Nocturia & Pollakiuria (Frequency)", weight: 0.25 },
    ],
    conditions: [
      {
        id: "urothelial_ca",
        name: "Urothelial (Transitional Cell) Bladder Carcinoma",
        icd10: "C67.9",
        keySymptoms: ["painless_hematuria", "frequency"],
        severity: "HIGH",
        biomarkers: ["Urine Cytology", "NMP22 Bladder Marker", "Normal Coags"],
        imaging: "Rigid / Flexible Cystoscopy & CT Urography showing papillary mucosal lesion",
        management: "Transurethral resection of bladder tumor (TURBT) + intravesical BCG / radical cystectomy.",
      },
      {
        id: "cystitis",
        name: "Acute Bacterial Cystitis / Complicated UTI",
        icd10: "N30.0",
        keySymptoms: ["dysuria", "frequency", "painless_hematuria"],
        severity: "MODERATE",
        biomarkers: ["Leukocyte Esterase (+)", "Nitrites (+)", "Urine Culture > 10^5 CFU/mL"],
        imaging: "Post-void residual bladder scan if recurrent",
        management: "Targeted culture-guided antibiotics (Nitrofurantoin / TMP-SMX), hydration.",
      },
    ],
  },

  uterus: {
    organId: "uterus",
    organName: "Uterus, Endometrium & Cervix",
    symptoms: [
      { id: "menorrhagia", label: "Heavy Menstrual Bleeding (Menorrhagia)", weight: 0.35 },
      { id: "pelvic_pain", label: "Cyclical Dysmenorrhea & Pelvic Pressure", weight: 0.35 },
      { id: "postmenopausal_bleed", label: "Postmenopausal Uterine Bleeding", weight: 0.4 },
      { id: "dyspareunia", label: "Deep Pelvic Dyspareunia", weight: 0.25 },
      { id: "anemia_uterus", label: "Fatigue & Iron-Deficiency Anemia", weight: 0.2 },
    ],
    conditions: [
      {
        id: "leiomyoma",
        name: "Symptomatic Uterine Leiomyomata (Fibroids)",
        icd10: "D25.9",
        keySymptoms: ["menorrhagia", "pelvic_pain", "anemia_uterus"],
        severity: "MODERATE",
        biomarkers: ["Hemoglobin / Ferritin", "Beta-hCG (exclude pregnancy)"],
        imaging: "Transvaginal Ultrasound & Pelvic MRI demonstrating intramural/submucosal myomas",
        management: "Hormonal IUD / GnRH antagonist (Relugolix), uterine artery embolization, myomectomy.",
      },
      {
        id: "endometrial_ca",
        name: "Endometrial Hyperplasia / Adenocarcinoma",
        icd10: "C54.1",
        keySymptoms: ["postmenopausal_bleed", "menorrhagia"],
        severity: "HIGH",
        biomarkers: ["Endometrial Pipelle Histopathology", "CA-125 Baseline"],
        imaging: "Transvaginal Ultrasound showing thickened endometrial stripe (> 4 mm postmenopausal)",
        management: "Total laparoscopic hysterectomy with bilateral salpingo-oophorectomy & lymph node staging.",
      },
      {
        id: "endometriosis",
        name: "Adenomyosis / Deep Infiltrating Endometriosis",
        icd10: "N80.0",
        keySymptoms: ["pelvic_pain", "dyspareunia", "menorrhagia"],
        severity: "MODERATE",
        biomarkers: ["Pelvic Inflammatory & Hormonal Profile"],
        imaging: "Pelvic MRI showing asymmetric junctional zone thickening (> 12 mm)",
        management: "Combined oral contraceptives / progestins, NSAIDs, laparoscopic excision.",
      },
    ],
  },

  ovaries: {
    organId: "ovaries",
    organName: "Bilateral Ovaries & Follicles",
    symptoms: [
      { id: "acute_adnexal_pain", label: "Sudden Unilateral Severe Adnexal Pain", weight: 0.4 },
      { id: "oligomenorrhea", label: "Oligomenorrhea & Hyperandrogenism", weight: 0.3 },
      { id: "adnexal_nausea", label: "Adnexal Pain + Nausea & Vomiting", weight: 0.35 },
      { id: "bloating_ascites", label: "Persistent Pelvic Bloating & Early Satiety", weight: 0.3 },
    ],
    conditions: [
      {
        id: "ovarian_torsion",
        name: "Acute Ovarian Torsion (Surgical Emergency)",
        icd10: "N83.51",
        keySymptoms: ["acute_adnexal_pain", "adnexal_nausea"],
        severity: "CRITICAL",
        biomarkers: ["STAT Serum Beta-hCG", "CBC"],
        imaging: "Transvaginal Color Doppler US showing absent ovarian arterial/venous flow ('Whirlpool' sign)",
        management: "Immediate diagnostic laparoscopy with ovarian detorsion & cystectomy.",
      },
      {
        id: "pcos",
        name: "Polycystic Ovary Syndrome (PCOS)",
        icd10: "E28.2",
        keySymptoms: ["oligomenorrhea"],
        severity: "MODERATE",
        biomarkers: ["Total & Free Testosterone Elevated", "LH:FSH Ratio > 2:1", "AMH Elevated"],
        imaging: "Pelvic US showing peripheral 'string of pearls' follicular pattern (> 20 follicles)",
        management: "Combined hormonal pills, Metformin for insulin resistance, Letrozole for ovulation induction.",
      },
      {
        id: "ovarian_mass",
        name: "Epithelial Ovarian Neoplasm / Complex Cyst",
        icd10: "C56.9",
        keySymptoms: ["bloating_ascites", "acute_adnexal_pain"],
        severity: "HIGH",
        biomarkers: ["CA-125 Elevated", "HE4 (ROMA Score)"],
        imaging: "Pelvic CT / Contrast MRI showing multilocular septated adnexal mass",
        management: "Gynecologic oncology staging laparotomy & platinum-taxane chemotherapy.",
      },
    ],
  },

  fallopian_tubes: {
    organId: "fallopian_tubes",
    organName: "Fallopian Tubes & Adnexa",
    symptoms: [
      { id: "amenorrhea_pain", label: "Unilateral Pelvic Pain after Amenorrhea", weight: 0.4 },
      { id: "vaginal_spotting", label: "Vaginal Spotting & Cervical Motion Tenderness", weight: 0.35 },
      { id: "purulent_discharge", label: "Mucopurulent Cervical Discharge & Fever", weight: 0.3 },
      { id: "orthostasis", label: "Dizziness & Peritoneal Hypotension", weight: 0.35 },
    ],
    conditions: [
      {
        id: "ectopic_preg",
        name: "Ruptured / Unruptured Tubal Ectopic Pregnancy",
        icd10: "O00.1",
        keySymptoms: ["amenorrhea_pain", "vaginal_spotting", "orthostasis"],
        severity: "CRITICAL",
        biomarkers: ["Quantitative Beta-hCG > 1,500 mIU/mL without IUP"],
        imaging: "Transvaginal Ultrasound showing empty uterus + complex adnexal ring + free fluid",
        management: "Methotrexate IM (if stable & unruptured) or emergent laparoscopic salpingectomy.",
      },
      {
        id: "pid_salpingitis",
        name: "Pelvic Inflammatory Disease / Hydrosalpinx",
        icd10: "N70.01",
        keySymptoms: ["purulent_discharge", "vaginal_spotting", "amenorrhea_pain"],
        severity: "HIGH",
        biomarkers: ["NAAT for Chlamydia/Gonorrhea", "ESR/CRP", "WBC > 11,000"],
        imaging: "Pelvic US showing thickened fluid-filled fallopian tube ('Cogwheel' sign)",
        management: "Empiric IM Ceftriaxone + oral Doxycycline + Metronidazole for 14 days.",
      },
    ],
  },

  cervix: {
    organId: "cervix",
    organName: "Cervix & Vaginal Canal",
    symptoms: [
      { id: "postcoital_bleed", label: "Postcoital / Intermenstrual Bleeding", weight: 0.4 },
      { id: "watery_discharge", label: "Persistent Serosanguinous Discharge", weight: 0.3 },
      { id: "cervical_pain", label: "Pelvic Heaviness & Dyspareunia", weight: 0.25 },
    ],
    conditions: [
      {
        id: "cin_cervix",
        name: "Cervical Intraepithelial Neoplasia / Carcinoma",
        icd10: "D06.9",
        keySymptoms: ["postcoital_bleed", "watery_discharge"],
        severity: "HIGH",
        biomarkers: ["High-Risk HPV DNA (16/18)", "Liquid-Based Cervical Cytology"],
        imaging: "Colposcopy with Acetic Acid Staining & Guided Punch Biopsy",
        management: "LEEP / Cold Knife Conization (CIN2/3); radical hysterectomy or chemoradiation if invasive.",
      },
      {
        id: "cervicitis",
        name: "Acute Mucopurulent Cervicitis",
        icd10: "N72",
        keySymptoms: ["watery_discharge", "cervical_pain", "postcoital_bleed"],
        severity: "MODERATE",
        biomarkers: ["Vaginal Wet Mount", "NAAT STI Screening"],
        imaging: "Speculum Exam revealing friable erythematous endocervical os",
        management: "Targeted single-dose Azithromycin or Doxycycline regimen; partner treatment.",
      },
    ],
  },

  prostate: {
    organId: "prostate",
    organName: "Prostate Gland & Seminal Vesicles",
    symptoms: [
      { id: "luts", label: "Urinary Hesitancy & Weak Stream", weight: 0.35 },
      { id: "nocturia", label: "Nocturia & Incomplete Emptying", weight: 0.25 },
      { id: "perineal_pain", label: "Acute Perineal Pain & High Fever", weight: 0.35 },
      { id: "bone_back_pain", label: "Lower Lumbar / Pelvic Bone Pain", weight: 0.35 },
      { id: "hematospermia", label: "Hematospermia / Dysuria", weight: 0.25 },
    ],
    conditions: [
      {
        id: "bph",
        name: "Benign Prostatic Hyperplasia (BPH) with LUTS",
        icd10: "N40.1",
        keySymptoms: ["luts", "nocturia"],
        severity: "MODERATE",
        biomarkers: ["Serum PSA (baseline)", "Post-Void Residual Volume", "Urinalysis"],
        imaging: "Transrectal Prostate US (prostate volume > 40 mL, transitional zone enlargement)",
        management: "Alpha-1 blocker (Tamsulosin) + 5-alpha-reductase inhibitor (Finasteride), TURP/HoLEP.",
      },
      {
        id: "prostatitis",
        name: "Acute Bacterial Prostatitis",
        icd10: "N41.0",
        keySymptoms: ["perineal_pain", "luts", "hematospermia"],
        severity: "HIGH",
        biomarkers: ["Midstream Urine Culture (E. coli)", "Leukocytosis", "Avoid vigorous DRE massage"],
        imaging: "Pelvic CT / TRUS if suspecting prostatic abscess",
        management: "4-week Fluoroquinolone or TMP-SMX antibiotic penetration course + hydration.",
      },
      {
        id: "prostate_ca",
        name: "Prostatic Adenocarcinoma",
        icd10: "C61",
        keySymptoms: ["bone_back_pain", "luts", "hematospermia"],
        severity: "HIGH",
        biomarkers: ["Serum PSA > 10 ng/mL (or Free:Total < 10%)", "Alkaline Phosphatase"],
        imaging: "Multiparametric Prostate MRI (PI-RADS 4/5) + TRUS/Fusion Biopsy (Gleason Score)",
        management: "Active surveillance, radical prostatectomy, external beam RT, or androgen deprivation.",
      },
    ],
  },

  testes: {
    organId: "testes",
    organName: "Testes, Epididymis & Male Reproductive Tract",
    symptoms: [
      { id: "acute_scrotal_pain", label: "Sudden Unilateral Severe Scrotal Pain", weight: 0.45 },
      { id: "absent_cremaster", label: "High-Riding Testis & Absent Cremasteric Reflex", weight: 0.4 },
      { id: "painless_nodule", label: "Firm Painless Intratesticular Nodule", weight: 0.35 },
      { id: "scrotal_swelling", label: "Gradual Erythema, Warmth & Fever", weight: 0.3 },
    ],
    conditions: [
      {
        id: "testicular_torsion",
        name: "Acute Testicular Torsion (Surgical Emergency < 6h)",
        icd10: "N44.0",
        keySymptoms: ["acute_scrotal_pain", "absent_cremaster"],
        severity: "CRITICAL",
        biomarkers: ["Immediate Surgical Consult — Do Not Delay for Labs"],
        imaging: "Scrotal Color Doppler Ultrasound demonstrating absent intratesticular blood flow",
        management: "Emergent surgical detorsion + bilateral orchidopexy within 6 hours to salvage testis.",
      },
      {
        id: "epididymitis",
        name: "Acute Epididymo-Orchitis",
        icd10: "N45.3",
        keySymptoms: ["scrotal_swelling", "acute_scrotal_pain"],
        severity: "MODERATE",
        biomarkers: ["Urine NAAT / Culture", "Positive Prehn's Relief Sign", "CRP"],
        imaging: "Color Doppler US showing hyperemic enlarged epididymis with increased flow",
        management: "Ceftriaxone + Doxycycline (or Levofloxacin if >35 yrs), scrotal elevation & NSAIDs.",
      },
      {
        id: "germ_cell_tumor",
        name: "Testicular Germ Cell Tumor (Seminoma / NSGCT)",
        icd10: "C62.9",
        keySymptoms: ["painless_nodule"],
        severity: "HIGH",
        biomarkers: ["AFP", "Beta-hCG", "LDH Tumor Markers"],
        imaging: "High-Frequency Scrotal Ultrasound showing hypoechoic intratesticular mass",
        management: "Radical inguinal orchiectomy (never trans-scrotal biopsy!) + sperm banking + staging CT.",
      },
    ],
  },

  thyroid: {
    organId: "thyroid",
    organName: "Thyroid & Parathyroid Glands",
    symptoms: [
      { id: "thyrotoxicosis", label: "Palpitations, Heat Intolerance & Weight Loss", weight: 0.35 },
      { id: "hypothyroid", label: "Cold Intolerance, Fatigue & Bradycardia", weight: 0.3 },
      { id: "neck_nodule", label: "Anterior Neck Mass / Swallowing Compression", weight: 0.3 },
      { id: "hypercalcemia", label: "Renal Stones, Bone Pain & Hypercalcemia", weight: 0.35 },
    ],
    conditions: [
      {
        id: "graves",
        name: "Graves' Autoimmune Hyperthyroidism / Thyroid Storm",
        icd10: "E05.00",
        keySymptoms: ["thyrotoxicosis", "neck_nodule"],
        severity: "HIGH",
        biomarkers: ["TSH < 0.01 mIU/L", "Free T4 Markedly Elevated", "TRAb / TSI Positive"],
        imaging: "Thyroid Ultrasound ('Thyroid Inferno' Doppler) & Radioactive Iodine Uptake Scan",
        management: "Methimazole / Propylthiouracil, Propranolol beta-blockade, RAI ablation or thyroidectomy.",
      },
      {
        id: "hashimotos",
        name: "Hashimoto's Chronic Autoimmune Thyroiditis",
        icd10: "E06.3",
        keySymptoms: ["hypothyroid", "neck_nodule"],
        severity: "MODERATE",
        biomarkers: ["TSH Elevated (> 10 mIU/L)", "Low Free T4", "Anti-TPO Antibodies Positive"],
        imaging: "Thyroid US showing diffuse heterogeneous pseudonodular parenchyma",
        management: "Daily Levothyroxine replacement titrated to normalize TSH.",
      },
      {
        id: "hyperpara",
        name: "Primary Hyperparathyroidism (Parathyroid Adenoma)",
        icd10: "E21.0",
        keySymptoms: ["hypercalcemia"],
        severity: "MODERATE",
        biomarkers: ["Serum Calcium > 10.5 mg/dL", "Inappropriately Elevated PTH"],
        imaging: "Technetium-99m Sestamibi Parathyroid Scan + 4D Neck CT",
        management: "Focused parathyroidectomy or Cinacalcet calcimimetic management.",
      },
    ],
  },

  adrenals: {
    organId: "adrenals",
    organName: "Adrenal (Suprarenal) Glands",
    symptoms: [
      { id: "paroxysmal_htn", label: "Episodic Headache, Diaphoresis & Severe HTN", weight: 0.4 },
      { id: "cushingoid", label: "Central Adiposity, Striae & Moon Facies", weight: 0.35 },
      { id: "adrenal_crisis", label: "Refractory Hypotension & Hyperpigmentation", weight: 0.4 },
    ],
    conditions: [
      {
        id: "pheo",
        name: "Pheochromocytoma (Catecholamine Secreting Tumor)",
        icd10: "D35.00",
        keySymptoms: ["paroxysmal_htn"],
        severity: "CRITICAL",
        biomarkers: ["Plasma Free Metanephrines > 4x Normal", "24h Urine Vanillylmandelic Acid"],
        imaging: "Contrast Adrenal CT / MRI ('Lightbulb Bright' T2 signal)",
        management: "Alpha-blockade FIRST (Phenoxybenzamine), then beta-blockade, then laparoscopic adrenalectomy.",
      },
      {
        id: "addisons",
        name: "Primary Adrenal Insufficiency (Addison's Crisis)",
        icd10: "E27.1",
        keySymptoms: ["adrenal_crisis"],
        severity: "CRITICAL",
        biomarkers: ["Morning Cortisol < 3 mcg/dL", "ACTH Markedly Elevated", "Hyponatremia + Hyperkalemia"],
        imaging: "Adrenal CT evaluating autoimmune atrophy, hemorrhage, or infection",
        management: "Emergent IV Hydrocortisone 100 mg + Normal Saline bolus; maintenance Fludrocortisone.",
      },
    ],
  },

  pituitary: {
    organId: "pituitary",
    organName: "Pituitary Gland (Hypophysis)",
    symptoms: [
      { id: "hemianopsia", label: "Bitemporal Hemianopsia (Tunnel Vision)", weight: 0.4 },
      { id: "galactorrhea", label: "Galactorrhea, Amenorrhea or Acral Growth", weight: 0.35 },
      { id: "polyuria_di", label: "Massive Polyuria & Polydipsia (Diabetes Insipidus)", weight: 0.35 },
    ],
    conditions: [
      {
        id: "pituitary_adenoma",
        name: "Pituitary Macroadenoma / Optic Chiasm Compression",
        icd10: "D35.2",
        keySymptoms: ["hemianopsia", "galactorrhea"],
        severity: "HIGH",
        biomarkers: ["Serum Prolactin > 200 ng/mL", "IGF-1", "AM Cortisol / Free T4"],
        imaging: "Dedicated Sella Turcica Contrast Brain MRI showing suprasellar extension",
        management: "Dopamine agonist (Cabergoline for prolactinoma) or transsphenoidal resection.",
      },
      {
        id: "central_di",
        name: "Central Diabetes Insipidus (ADH Deficiency)",
        icd10: "E23.2",
        keySymptoms: ["polyuria_di"],
        severity: "MODERATE",
        biomarkers: ["Hypernatremia", "Urine Osmolality < 200 mOsm/kg"],
        imaging: "Brain MRI showing loss of posterior pituitary bright spot",
        management: "Intranasal / Oral Desmopressin (DDAVP) + fluid access.",
      },
    ],
  },

  eyes: {
    organId: "eyes",
    organName: "Ocular Apparatus & Retina",
    symptoms: [
      { id: "halos_eye_pain", label: "Sudden Severe Eye Pain + Rainbow Halos", weight: 0.45 },
      { id: "curtain_vision", label: "Sudden Flashes, Floaters & 'Curtain' Loss", weight: 0.4 },
      { id: "blurry_glare", label: "Gradual Cloudy Vision & Night Glare", weight: 0.25 },
    ],
    conditions: [
      {
        id: "acute_glaucoma",
        name: "Acute Angle-Closure Glaucoma",
        icd10: "H40.21",
        keySymptoms: ["halos_eye_pain"],
        severity: "CRITICAL",
        biomarkers: ["Intraocular Pressure (IOP) > 45–60 mmHg", "Fixed Mid-Dilated Pupil"],
        imaging: "Slit-Lamp Gonioscopy showing closed iridocorneal drainage angle",
        management: "STAT IV Acetazolamide, topical Timolol/Pilocarpine, urgent Laser Peripheral Iridotomy.",
      },
      {
        id: "retinal_detachment",
        name: "Rhegmatogenous Retinal Detachment",
        icd10: "H33.00",
        keySymptoms: ["curtain_vision"],
        severity: "CRITICAL",
        biomarkers: ["Relative Afferent Pupillary Defect (Marcus Gunn Pupil)"],
        imaging: "Dilated Indirect Ophthalmoscopy & Ocular B-Scan Ultrasound",
        management: "Urgent vitreoretinal repair (pneumatic retinopexy, scleral buckle, vitrectomy).",
      },
    ],
  },

  ears: {
    organId: "ears",
    organName: "Auditory Ossicles, Cochlea & Vestibule",
    symptoms: [
      { id: "positional_vertigo", label: "Brief Positional Spinning Vertigo", weight: 0.35 },
      { id: "tinnitus_snhl", label: "Unilateral Tinnitus & Fullness", weight: 0.3 },
      { id: "otalgia", label: "Otalgia, Otorrhea & Conductive Loss", weight: 0.3 },
    ],
    conditions: [
      {
        id: "bppv_menieres",
        name: "Benign Paroxysmal Positional Vertigo / Ménière's",
        icd10: "H81.10",
        keySymptoms: ["positional_vertigo", "tinnitus_snhl"],
        severity: "MODERATE",
        biomarkers: ["Positive Dix-Hallpike Torsional Nystagmus", "Pure-Tone Audiometry"],
        imaging: "Temporal Bone MRI if asymmetrical sensorineural loss (exclude schwannoma)",
        management: "Epley Canalith Repositioning Maneuver; low-sodium diet & diuretics for Ménière's.",
      },
      {
        id: "otitis_media",
        name: "Acute Suppurative Otitis Media / Mastoiditis",
        icd10: "H66.90",
        keySymptoms: ["otalgia"],
        severity: "MODERATE",
        biomarkers: ["Bulging Erythematous Tympanic Membrane"],
        imaging: "Temporal Bone CT if mastoid tenderness present",
        management: "Oral Amoxicillin-Clavulanate, analgesia; myringotomy if refractory.",
      },
    ],
  },

  skeletal: {
    organId: "skeletal",
    organName: "Skeletal Framework, Spine & Cranium",
    symptoms: [
      { id: "bone_pain", label: "Localized Bone / Joint Tenderness", weight: 0.35 },
      { id: "joint_crepitus", label: "Mechanical Joint Crepitus", weight: 0.25 },
      { id: "morning_stiffness", label: "Morning Stiffness (> 45 min)", weight: 0.25 },
      { id: "deformity", label: "Structural Limb Asymmetry", weight: 0.35 },
      { id: "radiculopathy", label: "Radiating Nerve Root Pain", weight: 0.3 },
      { id: "restricted_rom", label: "Restricted Range of Motion", weight: 0.25 },
    ],
    conditions: [
      {
        id: "osteoarthritis",
        name: "Degenerative Osteoarthritis (Kellgren-Lawrence IV)",
        icd10: "M16.9",
        keySymptoms: ["joint_crepitus", "restricted_rom", "morning_stiffness"],
        severity: "MODERATE",
        biomarkers: ["ESR/CRP Normal", "Non-inflammatory Synovial Fluid"],
        imaging: "Weight-bearing Radiograph showing joint space loss & osteophytes",
        management: "Physical therapy, intra-articular injections, total joint arthroplasty.",
      },
      {
        id: "fracture",
        name: "Cortical / Trabecular Fragility Fracture",
        icd10: "M84.4",
        keySymptoms: ["bone_pain", "deformity", "restricted_rom"],
        severity: "HIGH",
        biomarkers: ["25-OH Vitamin D < 20 ng/mL", "DEXA T-score <= -2.5"],
        imaging: "Multi-slice CT / X-Ray demonstrating cortical discontinuity",
        management: "Orthopedic fixation (ORIF) / immobilization & bisphosphonate bone density therapy.",
      },
      {
        id: "radiculopathy_disc",
        name: "Lumbar Intervertebral Disc Herniation",
        icd10: "M54.16",
        keySymptoms: ["radiculopathy", "bone_pain", "restricted_rom"],
        severity: "MODERATE",
        biomarkers: ["Positive Straight-Leg Raise", "L5/S1 Myotome Deficit"],
        imaging: "3T Lumbar Spine MRI showing posterolateral disc extrusion",
        management: "Targeted PT, epidural steroid injection, or microdiscectomy if progressive deficit.",
      },
    ],
  },

  muscles: {
    organId: "muscles",
    organName: "Skeletal Musculature & Diaphragm",
    symptoms: [
      { id: "myalgia_dark_urine", label: "Severe Myalgia & Tea-Colored Urine", weight: 0.4 },
      { id: "ptosis_fatigue", label: "Fluctuating Ptosis & Fatigable Weakness", weight: 0.35 },
      { id: "focal_tear", label: "Sudden Focal Pop & Bruising During Load", weight: 0.3 },
    ],
    conditions: [
      {
        id: "rhabdo",
        name: "Acute Rhabdomyolysis (Myoglobinuric Nephropathy Risk)",
        icd10: "M62.82",
        keySymptoms: ["myalgia_dark_urine"],
        severity: "CRITICAL",
        biomarkers: ["Serum Creatine Kinase (CK) > 10,000 U/L", "Hyperkalemia", "Urine Blood(+) w/o RBCs"],
        imaging: "Compartment Pressure Check if tense swelling",
        management: "Aggressive IV Normal Saline infusion targeting urine output > 200 mL/h; monitor K+.",
      },
      {
        id: "myasthenia",
        name: "Myasthenia Gravis (Neuromuscular Junction)",
        icd10: "G70.00",
        keySymptoms: ["ptosis_fatigue"],
        severity: "HIGH",
        biomarkers: ["Anti-AChR Antibodies Positive", "Anti-MuSK"],
        imaging: "Chest CT evaluating Thymoma (15% association); Repetitive Nerve Stimulation",
        management: "Pyridostigmine (AChE inhibitor), corticosteroids, IVIG/plasmapheresis in crisis.",
      },
    ],
  },

  brainstem: {
    organId: "brainstem",
    organName: "Brainstem (Midbrain, Pons, Medulla)",
    symptoms: [
      { id: "diplopia_dysphagia", label: "Dysphagia, Hoarseness & Vertigo", weight: 0.4 },
      { id: "horner_ipsi", label: "Ipsilateral Horner Syndrome & Facial Numbness", weight: 0.35 },
      { id: "quadriplegia", label: "Quadriplegia with Preserved Vertical Gaze", weight: 0.4 },
      { id: "crossed_sensory", label: "Crossed Pain/Temperature Sensory Loss", weight: 0.3 },
    ],
    conditions: [
      {
        id: "wallenberg",
        name: "Lateral Medullary (Wallenberg) Syndrome (PICA Stroke)",
        icd10: "I63.8",
        keySymptoms: ["diplopia_dysphagia", "horner_ipsi", "crossed_sensory"],
        severity: "CRITICAL",
        biomarkers: ["Basilar / Vertebral Dissection Screening", "Coags"],
        imaging: "Brain MRI DWI & MR Angiography showing PICA / Vertebral artery occlusion",
        management: "Airway/swallow aspiration precautions, urgent stroke thrombolysis/thrombectomy.",
      },
      {
        id: "basilar_locked_in",
        name: "Basilar Artery Occlusion (Locked-In Pontine Infarct)",
        icd10: "I63.22",
        keySymptoms: ["quadriplegia", "diplopia_dysphagia"],
        severity: "CRITICAL",
        biomarkers: ["Emergency Endovascular Alert"],
        imaging: "CT Angiography demonstrating acute basilar artery thrombus",
        management: "Emergent mechanical thrombectomy + Neuro-ICU ventilatory monitoring.",
      },
    ],
  },
};

/**
 * Resolves ANY of the 54 organ IDs accurately to its true clinical pathology profile.
 */
export function resolvePathologyOrganKey(organId = "") {
  const k = (organId || "").toLowerCase().trim();
  if (ORGAN_PATHOLOGY_DATABASE[k]) return k;

  if (["aorta", "vena_cava", "vasculature", "coronary_circulation"].includes(k)) {
    return k === "coronary_circulation" ? "heart" : "vasculature";
  }
  if (["larynx", "trachea", "bronchial_tree", "pharynx"].includes(k)) return "respiratory_airway";
  if (["diaphragm", "muscles", "pectoralis_serratus", "abdominal_wall"].includes(k)) return "muscles";
  if (["thymus", "lungs"].includes(k)) return "lungs";
  if (["cerebellum", "thalamus_hypothalamus", "meninges", "brain"].includes(k)) return "brain";
  if (k === "spinal_cord") return "brainstem_spinal";
  if (["esophagus", "stomach"].includes(k)) return "stomach";
  if (["small_intestine", "large_intestine", "appendix"].includes(k)) return "intestines";
  if (["gallbladder"].includes(k)) return "gallbladder";
  if (["ureters", "urethra", "bladder"].includes(k)) return "bladder";
  if (["parathyroid", "thyroid"].includes(k)) return "thyroid";
  if (["cervix_vagina"].includes(k)) return "cervix";
  if (["vas_deferens", "penis"].includes(k)) return "testes";
  if (["skull", "spine", "ribcage", "pelvis_skeleton", "skeleton"].includes(k)) return "skeletal";
  if (["tongue"].includes(k)) return "stomach";

  if (k.includes("bone") || k.includes("vertebra") || k.includes("rib") || k.includes("femur") || k.includes("cranium") || k.includes("pelvis") || k.includes("skull")) {
    return "skeletal";
  }
  if (k.includes("muscle") || k.includes("bicep") || k.includes("pector") || k.includes("rectus")) return "muscles";
  if (k.includes("artery") || k.includes("vein") || k.includes("aorta")) return "vasculature";
  if (k.includes("uterus")) return "uterus";
  if (k.includes("ovary")) return "ovaries";
  if (k.includes("prostate")) return "prostate";
  if (k.includes("test")) return "testes";
  if (k.includes("kidney") || k.includes("renal")) return "kidneys";
  if (k.includes("lung") || k.includes("bronch")) return "lungs";
  if (k.includes("liver") || k.includes("hepat")) return "liver";
  if (k.includes("brain") || k.includes("cereb")) return "brain";

  return "heart";
}

/**
 * Diagnostic Machine Learning Predictor Algorithm
 * Computes disease probability distribution based on active selected symptoms.
 */
export function predictClinicalPathology(organId, activeSymptomIds = []) {
  const resolvedKey = resolvePathologyOrganKey(organId);
  const data = ORGAN_PATHOLOGY_DATABASE[resolvedKey] || ORGAN_PATHOLOGY_DATABASE.heart;
  const activeSet = new Set(activeSymptomIds);

  const results = data.conditions.map((condition) => {
    let matchedWeight = 0;
    let totalWeight = 0;

    condition.keySymptoms.forEach((sId) => {
      const symptomObj = data.symptoms.find((s) => s.id === sId);
      const w = symptomObj ? symptomObj.weight : 0.25;
      totalWeight += w;
      if (activeSet.has(sId)) {
        matchedWeight += w;
      }
    });

    const otherActiveCount = activeSymptomIds.filter((sId) => !condition.keySymptoms.includes(sId)).length;
    const penaltyBonus = otherActiveCount * 0.05;

    let probability = totalWeight > 0 ? (matchedWeight / totalWeight) * 0.95 + penaltyBonus : 0.1;

    if (activeSymptomIds.length === 0) {
      probability = 0.08;
    }

    probability = Math.min(0.98, Math.max(0.04, probability));

    return {
      ...condition,
      probability: Math.round(probability * 100),
      matchCount: condition.keySymptoms.filter((sId) => activeSet.has(sId)).length,
      totalKeyCount: condition.keySymptoms.length,
    };
  });

  results.sort((a, b) => b.probability - a.probability);

  return {
    organ: data,
    topCondition: results[0],
    rankedConditions: results,
  };
}
