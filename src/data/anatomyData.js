/**
 * Complete Medical Anatomical Knowledge Base & Organ Directory
 * Exhaustive coverage of all 54 human anatomical organs, glands, visceral structures,
 * and musculoskeletal systems across 10 anatomical domains.
 */

export const ANATOMICAL_SYSTEMS = [
  {
    "id": "circulatory",
    "name": "Cardiovascular & Circulatory System",
    "latinName": "Systema cardiovasculare",
    "description": "Hemodynamic pump and closed vascular circuit transporting oxygen, glucose, signaling hormones, and immune cells.",
    "color": "#ef4444",
    "icon": "Heart",
    "defaultOpacity": 1.0,
    "defaultVisible": true
  },
  {
    "id": "respiratory",
    "name": "Respiratory & Pulmonary System",
    "latinName": "Systema respiratorium",
    "description": "Conducting airways and alveolar parenchyma facilitating systemic gas exchange and vocalization.",
    "color": "#a8a29e",
    "icon": "Wind",
    "defaultOpacity": 1.0,
    "defaultVisible": true
  },
  {
    "id": "nervous",
    "name": "Central & Peripheral Nervous System",
    "latinName": "Systema nervosum",
    "description": "Electrochemical signaling matrix orchestrating cognition, memory, voluntary locomotion, and autonomic homeostatic tone.",
    "color": "#eab308",
    "icon": "Cpu",
    "defaultOpacity": 1.0,
    "defaultVisible": true
  },
  {
    "id": "digestive",
    "name": "Digestive & Gastrointestinal System",
    "latinName": "Systema alimentarium",
    "description": "Continuous tract responsible for mechanical propulsion, enzymatic hydrolysis, nutrient assimilation, and xenobiotic metabolism.",
    "color": "#10b981",
    "icon": "Utensils",
    "defaultOpacity": 1.0,
    "defaultVisible": true
  },
  {
    "id": "urinary",
    "name": "Urinary & Renal Homeostatic System",
    "latinName": "Systema urinarium",
    "description": "Bilateral nephron filtration network balancing plasma volume, osmolality, acid-base equilibrium, and nitrogenous clearance.",
    "color": "#f59e0b",
    "icon": "Droplet",
    "defaultOpacity": 1.0,
    "defaultVisible": true
  },
  {
    "id": "endocrine",
    "name": "Endocrine & Neuroendocrine System",
    "latinName": "Systema endocrinum",
    "description": "Ductless glandular network regulating basal metabolic rate, glycemic set-points, electrolyte retention, and stress responses.",
    "color": "#ec4899",
    "icon": "Flame",
    "defaultOpacity": 1.0,
    "defaultVisible": true
  },
  {
    "id": "skeletal",
    "name": "Articulated Skeletal Framework (206 Bones)",
    "latinName": "Systema skeletale",
    "description": "Rigid osseous framework providing biomechanical levers, visceral armor, calcium reserves, and medullary hematopoiesis.",
    "color": "#e7e5e4",
    "icon": "Bone",
    "defaultOpacity": 1.0,
    "defaultVisible": true
  },
  {
    "id": "muscular",
    "name": "Superficial & Deep Muscular System",
    "latinName": "Systema musculare",
    "description": "Contractile sarcomeric engine generating somatic torque, posture maintenance, venous return, and thermogenesis.",
    "color": "#f97316",
    "icon": "Activity",
    "defaultOpacity": 1.0,
    "defaultVisible": true
  },
  {
    "id": "reproductive",
    "name": "Male & Female Reproductive System",
    "latinName": "Systema reproductionis",
    "description": "Gonadal and ductal apparatus producing gametes, sexual dimorphic steroids, fertilization environments, and gestation.",
    "color": "#fb7185",
    "icon": "Users",
    "defaultOpacity": 1.0,
    "defaultVisible": true
  },
  {
    "id": "sensory",
    "name": "Specialized Sensory Organs",
    "latinName": "Organa sensuum",
    "description": "Transducing receptors translating photonic, auditory, vestibular, and gustatory stimuli into neurological neural action potentials.",
    "color": "#e5b869",
    "icon": "Eye",
    "defaultOpacity": 1.0,
    "defaultVisible": true
  }
];

export const ORGANS = {
  "heart": {
    "id": "heart",
    "name": "Heart & Cardiac Chambers",
    "latinName": "Cor humanum / Cardia",
    "systemId": "circulatory",
    "systemName": "Cardiovascular System",
    "cavity": "Thoracic Cavity (Middle Mediastinum)",
    "vertebralLevel": "T5 - T8",
    "dimensions": "300g \u00b7 5.0 L/min Cardiac Output",
    "icon": "\ud83e\udec0",
    "modelUrl": "/hra-heart.glb",
    "standaloneModelUrl": "/hra-heart.glb",
    "summary": "Four-chambered muscular double pump generating systemic systolic pressures (~120 mmHg) to perfuse oxygenated blood throughout the body.",
    "function": "Four-chambered muscular double pump generating systemic systolic pressures (~120 mmHg) to perfuse oxygenated blood throughout the body.",
    "physiology": "Operates as a synchronized dual pump: the right atrium and ventricle circulate deoxygenated blood to the lungs for gas exchange, while the left atrium and powerful left ventricle generate arterial systolic pressures (~120 mmHg) to perfuse oxygen-rich blood through the aorta to all systemic capillary beds.",
    "bloodSupply": "Right and Left Coronary Arteries originating from aortic sinuses; venous drainage into Coronary Sinus.",
    "nerveSupply": "Cardiac plexus (Sympathetic T1-T4 acceleratory, Vagus Nerve CN X inhibitory).",
    "clinicalNotes": "Coronary Artery Disease (CAD), Myocardial Infarction, Arrhythmias, Heart Failure.",
    "coordinates": {
      "x": -0.035,
      "y": 0.28,
      "z": 0.05
    },
    "mapPosition": {
      "xPercent": 48,
      "yPercent": 34
    },
    "hotspots": [
      {
        "id": "aorta",
        "name": "Ascending Aorta",
        "pos": [
          0.0,
          0.42,
          0.05
        ],
        "description": "Delivers oxygenated blood to the systemic arterial tree."
      },
      {
        "id": "svc",
        "name": "Superior Vena Cava",
        "pos": [
          0.22,
          0.35,
          -0.08
        ],
        "description": "Returns deoxygenated blood from upper body into right atrium."
      },
      {
        "id": "pulmonary_trunk",
        "name": "Pulmonary Trunk",
        "pos": [
          -0.12,
          0.28,
          0.18
        ],
        "description": "Transports blood from right ventricle into lungs."
      },
      {
        "id": "left_ventricle",
        "name": "Left Ventricle",
        "pos": [
          -0.22,
          -0.12,
          0.14
        ],
        "description": "Thick-walled muscular pumping chamber generating systemic blood pressure."
      },
      {
        "id": "right_ventricle",
        "name": "Right Ventricle",
        "pos": [
          0.12,
          -0.08,
          0.18
        ],
        "description": "Pumps deoxygenated blood through pulmonary valve into pulmonary circulation."
      }
    ],
    "hotspotsCount": 5,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "heart",
      "heart",
      "heart & cardiac chambers",
      "cor humanum / cardia"
    ]
  },
  "aorta": {
    "id": "aorta",
    "name": "Aorta & Systemic Great Arteries",
    "latinName": "Aorta ascendens, arcus et descendens",
    "systemId": "circulatory",
    "systemName": "Cardiovascular System",
    "cavity": "Superior & Posterior Mediastinum, Retroperitoneum",
    "vertebralLevel": "T4 - L4 (Aortic Bifurcation)",
    "dimensions": "2.5 cm diameter \u00b7 ~100 mmHg Mean Pressure",
    "icon": "\ud83e\ude78",
    "modelUrl": "/hra-vasculature.glb",
    "standaloneModelUrl": "/hra-vasculature.glb",
    "summary": "Largest arterial conduit in the body; its elastic Windkessel recoil dampens pulsatile systolic pressure and maintains continuous capillary perfusion.",
    "function": "Largest arterial conduit in the body; its elastic Windkessel recoil dampens pulsatile systolic pressure and maintains continuous capillary perfusion.",
    "physiology": "Elastic Windkessel artery that expands under systolic pressure and recoils during diastole, maintaining continuous capillary perfusion throughout the cardiac cycle.",
    "bloodSupply": "Vasa vasorum supplying the outer adventitia and media.",
    "nerveSupply": "Aortic plexus with baroreceptors in aortic arch via CN X (Depressor nerve).",
    "clinicalNotes": "Thoracic and Abdominal Aortic Aneurysms (AAA), Aortic Dissection, Coarctation of Aorta.",
    "coordinates": {
      "x": 0.0,
      "y": 0.24,
      "z": 0.01
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 38
    },
    "hotspots": [
      {
        "id": "aortic_root",
        "name": "Aortic Root & Sinuses",
        "pos": [
          0.0,
          0.35,
          0.0
        ],
        "description": "Gives origin to left and right coronary arteries."
      },
      {
        "id": "aortic_arch",
        "name": "Aortic Arch & Truncus",
        "pos": [
          0.0,
          0.48,
          0.0
        ],
        "description": "Branches into brachiocephalic, left common carotid, and subclavian arteries."
      },
      {
        "id": "descending_aorta",
        "name": "Descending Thoracic Aorta",
        "pos": [
          0.0,
          0.1,
          -0.04
        ],
        "description": "Travels through posterior mediastinum to feed intercostal vessels."
      }
    ],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "aorta",
      "aorta",
      "aorta & systemic great arteries",
      "aorta ascendens, arcus et descendens"
    ]
  },
  "vena_cava": {
    "id": "vena_cava",
    "name": "Superior & Inferior Vena Cava",
    "latinName": "Vena cava superior et inferior",
    "systemId": "circulatory",
    "systemName": "Cardiovascular System",
    "cavity": "Mediastinum & Retroperitoneal Cavity",
    "vertebralLevel": "C6 - T8 (SVC) \u00b7 T8 - L5 (IVC)",
    "dimensions": "3.0 cm diameter \u00b7 Low Pressure Venous Return",
    "icon": "\ud83d\udd35",
    "modelUrl": "/hra-vasculature.glb",
    "standaloneModelUrl": "/hra-vasculature.glb",
    "summary": "Primary systemic venous trunks collecting deoxygenated blood from the upper and lower body and returning it into the right atrium.",
    "function": "Primary systemic venous trunks collecting deoxygenated blood from the upper and lower body and returning it into the right atrium.",
    "physiology": "Collects systemic venous return under low pressure (central venous pressure 2\u20138 mmHg) and conveys it into the right atrium.",
    "bloodSupply": "Vasa vasorum.",
    "nerveSupply": "Splanchnic sympathetic fibers.",
    "clinicalNotes": "Superior Vena Cava Syndrome (often secondary to bronchogenic carcinoma), IVC thrombosis.",
    "coordinates": {
      "x": 0.04,
      "y": 0.22,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 53,
      "yPercent": 36
    },
    "hotspots": [
      {
        "id": "svc_junction",
        "name": "Cavoatrial Junction",
        "pos": [
          0.05,
          0.25,
          0.0
        ],
        "description": "Entry point into right atrium near Sinoatrial (SA) node."
      }
    ],
    "hotspotsCount": 1,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "vena_cava",
      "vena cava",
      "superior & inferior vena cava",
      "vena cava superior et inferior"
    ]
  },
  "vasculature": {
    "id": "vasculature",
    "name": "Systemic Great Vasculature Tree",
    "latinName": "Vasa sanguinea majora",
    "systemId": "circulatory",
    "systemName": "Cardiovascular System",
    "cavity": "Head, Thorax, Abdomen, and Limbs",
    "vertebralLevel": "C1 - S5",
    "dimensions": "~100,000 km Total Capillary Network",
    "icon": "\ud83e\ude7a",
    "modelUrl": "/hra-vasculature.glb",
    "standaloneModelUrl": "/hra-vasculature.glb",
    "summary": "Comprehensive vascular network of systemic arteries, arterioles, venous return arches, and microvascular beds carrying blood.",
    "function": "Comprehensive vascular network of systemic arteries, arterioles, venous return arches, and microvascular beds carrying blood.",
    "physiology": "Conveys oxygen, hormones, glucose, and immune cells via dynamic vasomotor autoregulation mediated by nitric oxide and endothelin.",
    "bloodSupply": "Systemic cardiac output (5.0 L/min).",
    "nerveSupply": "Sympathetic perivascular vasomotor fibers controlling peripheral resistance.",
    "clinicalNotes": "Atherosclerosis, Peripheral Artery Disease (PAD), Vasculitis, Deep Vein Thrombosis.",
    "coordinates": {
      "x": 0.0,
      "y": 0.22,
      "z": 0.01
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 45
    },
    "hotspots": [
      {
        "id": "carotid_bifurcation",
        "name": "Carotid Bifurcation",
        "pos": [
          0.08,
          0.62,
          0.02
        ],
        "description": "Carotid sinus baroreceptors and carotid body chemoreceptors."
      },
      {
        "id": "iliac_bifurcation",
        "name": "Aortic Bifurcation (L4)",
        "pos": [
          0.0,
          -0.22,
          0.0
        ],
        "description": "Splits into right and left common iliac arteries."
      }
    ],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "vasculature",
      "vasculature",
      "systemic great vasculature tree",
      "vasa sanguinea majora"
    ]
  },
  "spleen": {
    "id": "spleen",
    "name": "Spleen (Hematologic & Lymphoid)",
    "latinName": "Splen / Lien",
    "systemId": "circulatory",
    "systemName": "Lymphatic & Immune",
    "cavity": "Left Hypochondrium (Under Ribs 9\u201311)",
    "vertebralLevel": "T9 - T11",
    "dimensions": "150g \u00b7 12 \u00d7 7 \u00d7 4 cm",
    "icon": "\ud83d\udee1\ufe0f",
    "modelUrl": "/hra-spleen.glb",
    "standaloneModelUrl": "/hra-spleen.glb",
    "summary": "Filters circulating blood, phagocytoses aging/damaged erythrocytes in the red pulp, and orchestrates adaptive humoral immunity in white pulp follicles.",
    "function": "Filters circulating blood, phagocytoses aging/damaged erythrocytes in the red pulp, and orchestrates adaptive humoral immunity in white pulp follicles.",
    "physiology": "Red pulp contains Billroth cords that mechanically filter senescent erythrocytes; white pulp mounts adaptive T and B-lymphocyte humoral immune responses.",
    "bloodSupply": "Tortuous Splenic Artery from Celiac Trunk; Splenic Vein joins SMV to form Portal Vein.",
    "nerveSupply": "Celiac plexus.",
    "clinicalNotes": "Splenomegaly in portal hypertension; splenic rupture during blunt abdominal trauma.",
    "coordinates": {
      "x": -0.16,
      "y": 0.12,
      "z": -0.02
    },
    "mapPosition": {
      "xPercent": 36,
      "yPercent": 42
    },
    "hotspots": [
      {
        "id": "splenic_hilum",
        "name": "Splenic Hilum",
        "pos": [
          0.0,
          0.0,
          0.0
        ],
        "description": "Entry and exit for splenic artery and vein."
      }
    ],
    "hotspotsCount": 1,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "spleen",
      "spleen",
      "spleen (hematologic & lymphoid)",
      "splen / lien"
    ]
  },
  "coronary_circulation": {
    "id": "coronary_circulation",
    "name": "Coronary Arteries & Veins",
    "latinName": "Arteriae et venae coronariae",
    "systemId": "circulatory",
    "systemName": "Cardiovascular System",
    "cavity": "Epicardial Sulci of the Heart",
    "vertebralLevel": "T5 - T8",
    "dimensions": "LAD, LCx, RCA \u00b7 ~250 mL/min flow",
    "icon": "\ud83e\udec0",
    "modelUrl": "/hra-heart.glb",
    "standaloneModelUrl": "/hra-heart.glb",
    "summary": "Dedicated myocardial blood supply branching from the aortic root; provides oxygen-rich perfusion to the working ventricular myocardium.",
    "function": "Dedicated myocardial blood supply branching from the aortic root; provides oxygen-rich perfusion to the working ventricular myocardium.",
    "physiology": "Dedicated myocardial blood supply branching from the aortic root; provides oxygen-rich perfusion to the working ventricular myocardium.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "coronary_circulation",
      "coronary circulation",
      "coronary arteries & veins",
      "arteriae et venae coronariae"
    ]
  },
  "lungs": {
    "id": "lungs",
    "name": "Lungs & Alveolar Parenchyma",
    "latinName": "Pulmones (Sinister et Dexter)",
    "systemId": "respiratory",
    "systemName": "Respiratory System",
    "cavity": "Thoracic Cavity (Bilateral Pleural Cavities)",
    "vertebralLevel": "C7 - T10",
    "dimensions": "Combined 1,050g \u00b7 ~6L TLC",
    "icon": "\ud83e\udec1",
    "modelUrl": "/hra-lungs.glb",
    "standaloneModelUrl": "/hra-lungs.glb",
    "summary": "Paired respiratory organs containing ~300 million alveoli with ~70 m\u00b2 surface area for oxygen uptake into hemoglobin and CO2 excretion.",
    "function": "Paired respiratory organs containing ~300 million alveoli with ~70 m\u00b2 surface area for oxygen uptake into hemoglobin and CO2 excretion.",
    "physiology": "Gas exchange across ~300 million alveoli with ~70 m\u00b2 total surface area. Right lung has 3 lobes (superior, middle, inferior); left lung has 2 lobes with cardiac notch.",
    "bloodSupply": "Pulmonary arteries (deoxygenated gas exchange); Bronchial arteries (systemic oxygenated nourishment).",
    "nerveSupply": "Pulmonary plexus (Vagus CN X bronchoconstriction, T2-T5 bronchodilation).",
    "clinicalNotes": "COPD, Asthma, Pneumonia, Pulmonary Embolism, ARDS.",
    "coordinates": {
      "x": 0.0,
      "y": 0.28,
      "z": 0.02
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 33
    },
    "hotspots": [
      {
        "id": "trachea",
        "name": "Trachea",
        "pos": [
          0.0,
          0.58,
          0.0
        ],
        "description": "Conducts air from larynx down into primary bronchi."
      },
      {
        "id": "right_lobe",
        "name": "Right Superior Lobe",
        "pos": [
          0.35,
          0.2,
          0.05
        ],
        "description": "Upper section of 3-lobed right lung."
      },
      {
        "id": "left_lobe",
        "name": "Left Superior Lobe",
        "pos": [
          -0.35,
          0.2,
          0.05
        ],
        "description": "Upper lobe of 2-lobed left lung accommodating heart."
      },
      {
        "id": "carina",
        "name": "Carina Bifurcation",
        "pos": [
          0.0,
          0.22,
          -0.05
        ],
        "description": "Cartilaginous ridge where trachea splits into bronchi."
      }
    ],
    "hotspotsCount": 4,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "lungs",
      "lungs",
      "lungs & alveolar parenchyma",
      "pulmones (sinister et dexter)"
    ]
  },
  "trachea": {
    "id": "trachea",
    "name": "Trachea & Primary Bronchial Carina",
    "latinName": "Trachea et Carina tracheae",
    "systemId": "respiratory",
    "systemName": "Respiratory System",
    "cavity": "Superior & Middle Mediastinum",
    "vertebralLevel": "C6 - T4/T5 (Sternal Angle)",
    "dimensions": "10\u201312 cm length \u00b7 2.0 cm diameter",
    "icon": "\ud83c\udf8b",
    "modelUrl": "/hra-lungs.glb",
    "standaloneModelUrl": "/hra-lungs.glb",
    "summary": "Cartilaginous airway trunk stabilized by 16\u201320 C-shaped hyaline rings; conducts inhaled air and sweeps inhaled debris upward via mucociliary escalator.",
    "function": "Cartilaginous airway trunk stabilized by 16\u201320 C-shaped hyaline rings; conducts inhaled air and sweeps inhaled debris upward via mucociliary escalator.",
    "physiology": "Stabilized by 16\u201320 C-shaped hyaline cartilage rings; lined by pseudostratified ciliated columnar epithelium acting as a mucociliary escalator.",
    "bloodSupply": "Inferior thyroid and bronchial arteries.",
    "nerveSupply": "Recurrent laryngeal nerve (CN X).",
    "clinicalNotes": "Tracheostomy landmarks (2nd-4th tracheal rings), Tracheomalacia, Foreign body aspiration.",
    "coordinates": {
      "x": 0.0,
      "y": 0.48,
      "z": 0.02
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 26
    },
    "hotspots": [
      {
        "id": "tracheal_rings",
        "name": "Hyaline Cartilage Rings",
        "pos": [
          0.0,
          0.1,
          0.05
        ],
        "description": "Prevents airway collapse during negative intrathoracic inspiratory pressure."
      }
    ],
    "hotspotsCount": 1,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "trachea",
      "trachea",
      "trachea & primary bronchial carina",
      "trachea et carina tracheae"
    ]
  },
  "larynx": {
    "id": "larynx",
    "name": "Larynx & Vocal Cords (Phonation)",
    "latinName": "Larynx (Cartilagines laryngis)",
    "systemId": "respiratory",
    "systemName": "Respiratory System",
    "cavity": "Anterior Cervical Visceral Space",
    "vertebralLevel": "C3 - C6",
    "dimensions": "5 cm height \u00b7 Hyoid to Cricoid",
    "icon": "\ud83e\udd56",
    "modelUrl": "/hra-larynx.glb",
    "standaloneModelUrl": "/hra-larynx.glb",
    "summary": "Cartilaginous sound-producing organ housing true and false vocal folds; guards the tracheal inlet during swallowing via the epiglottis.",
    "function": "Cartilaginous sound-producing organ housing true and false vocal folds; guards the tracheal inlet during swallowing via the epiglottis.",
    "physiology": "Houses vocal folds whose tension is modulated by cricothyroid and thyroarytenoid muscles, producing pitch variation; epiglottis folds down to seal the airway during swallowing.",
    "bloodSupply": "Superior and inferior laryngeal arteries.",
    "nerveSupply": "Superior and recurrent laryngeal nerves (CN X).",
    "clinicalNotes": "Laryngospasm, Vocal cord nodules, Laryngeal carcinoma, Recurrent laryngeal nerve injury causes hoarseness.",
    "coordinates": {
      "x": 0.0,
      "y": 0.62,
      "z": 0.04
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 22
    },
    "hotspots": [
      {
        "id": "thyroid_cartilage",
        "name": "Thyroid Cartilage (Adam's Apple)",
        "pos": [
          0.0,
          0.15,
          0.1
        ],
        "description": "Shield-shaped cartilage protecting vocal folds."
      },
      {
        "id": "vocal_folds",
        "name": "True Vocal Folds",
        "pos": [
          0.0,
          -0.05,
          0.02
        ],
        "description": "Vibrate during phonation to generate vocal sounds."
      }
    ],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "larynx",
      "larynx",
      "larynx & vocal cords (phonation)",
      "larynx (cartilagines laryngis)"
    ]
  },
  "diaphragm": {
    "id": "diaphragm",
    "name": "Thoracic Diaphragm (Phrenic Engine)",
    "latinName": "Diaphragma thoracis",
    "systemId": "respiratory",
    "systemName": "Respiratory & Muscular",
    "cavity": "Thoracoabdominal Junction",
    "vertebralLevel": "T8 - L3 (Caval, Esophageal, Aortic Hiatuses)",
    "dimensions": "Dome-shaped sheet \u00b7 Phrenic Nerve C3-C5",
    "icon": "\ud83e\ude82",
    "modelUrl": "/z-anatomy-body.glb",
    "standaloneModelUrl": "/z-anatomy-body.glb",
    "summary": "Primary musculotendinous engine of ventilation; its downward contraction expands thoracic cavity volume and creates negative intrapleural pressure.",
    "function": "Primary musculotendinous engine of ventilation; its downward contraction expands thoracic cavity volume and creates negative intrapleural pressure.",
    "physiology": "Primary musculotendinous engine of ventilation; its downward contraction expands thoracic cavity volume and creates negative intrapleural pressure.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.04
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "diaphragm",
      "diaphragm",
      "thoracic diaphragm (phrenic engine)",
      "diaphragma thoracis"
    ]
  },
  "bronchial_tree": {
    "id": "bronchial_tree",
    "name": "Bronchial Arborization & Bronchioles",
    "latinName": "Arbor bronchialis",
    "systemId": "respiratory",
    "systemName": "Respiratory System",
    "cavity": "Pulmonary Parenchyma",
    "vertebralLevel": "T4 - T10",
    "dimensions": "23 generations of dichotomous branching",
    "icon": "\ud83c\udf3f",
    "modelUrl": "/hra-lungs.glb",
    "standaloneModelUrl": "/hra-lungs.glb",
    "summary": "Conduction and respiratory zones branching from lobar and segmental bronchi down to terminal and respiratory bronchioles.",
    "function": "Conduction and respiratory zones branching from lobar and segmental bronchi down to terminal and respiratory bronchioles.",
    "physiology": "Conduction and respiratory zones branching from lobar and segmental bronchi down to terminal and respiratory bronchioles.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "bronchial_tree",
      "bronchial tree",
      "bronchial arborization & bronchioles",
      "arbor bronchialis"
    ]
  },
  "pharynx": {
    "id": "pharynx",
    "name": "Pharynx (Nasopharynx, Oropharynx, Laryngopharynx)",
    "latinName": "Pharynx humanus",
    "systemId": "respiratory",
    "systemName": "Respiratory & Digestive",
    "cavity": "Posterior Craniofacial & Cervical Space",
    "vertebralLevel": "Base of Skull - C6",
    "dimensions": "12\u201314 cm length",
    "icon": "\ud83d\udde3\ufe0f",
    "modelUrl": "/z-anatomy-body.glb",
    "standaloneModelUrl": "/z-anatomy-body.glb",
    "summary": "Fibromuscular funnel serving as shared crossroads for ventilation and deglutition, housing Waldeyer's ring of tonsillar lymphoid tissue.",
    "function": "Fibromuscular funnel serving as shared crossroads for ventilation and deglutition, housing Waldeyer's ring of tonsillar lymphoid tissue.",
    "physiology": "Fibromuscular funnel serving as shared crossroads for ventilation and deglutition, housing Waldeyer's ring of tonsillar lymphoid tissue.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.58,
      "z": 0.03
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 37
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "pharynx",
      "pharynx",
      "pharynx (nasopharynx, oropharynx, laryngopharynx)",
      "pharynx humanus"
    ]
  },
  "brain": {
    "id": "brain",
    "name": "Cerebrum & Cerebral Cortex",
    "latinName": "Encephalon / Cerebrum",
    "systemId": "nervous",
    "systemName": "Nervous System",
    "cavity": "Cranial Cavity (Calvaria)",
    "vertebralLevel": "Intracranial",
    "dimensions": "1,350g \u00b7 ~86 Billion Neurons",
    "icon": "\ud83e\udde0",
    "modelUrl": "/hra-brain.glb",
    "standaloneModelUrl": "/hra-brain.glb",
    "summary": "Highest neurological executive center coordinating sensory processing, voluntary movement, abstract reasoning, emotional valence, and consciousness.",
    "function": "Highest neurological executive center coordinating sensory processing, voluntary movement, abstract reasoning, emotional valence, and consciousness.",
    "physiology": "86 billion neurons orchestrating sensory integration, voluntary motor output, autonomic regulation, emotion, memory, and executive thought.",
    "bloodSupply": "Circle of Willis supplied by bilateral Internal Carotid and Vertebral Arteries.",
    "nerveSupply": "12 pairs of Cranial Nerves (CN I to CN XII).",
    "clinicalNotes": "Stroke (Ischemic/Hemorrhagic), Traumatic Brain Injury, Glioblastoma, Alzheimer's, Parkinson's.",
    "coordinates": {
      "x": 0.0,
      "y": 0.74,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 11
    },
    "hotspots": [
      {
        "id": "frontal_cortex",
        "name": "Frontal Cortex",
        "pos": [
          0.0,
          0.28,
          0.38
        ],
        "description": "Executive planning, motor cortex, Broca speech formulation."
      },
      {
        "id": "cerebellum",
        "name": "Cerebellum",
        "pos": [
          0.0,
          -0.32,
          -0.32
        ],
        "description": "Fine motor coordination, balance, and procedural memory."
      },
      {
        "id": "brainstem",
        "name": "Brainstem & Medulla",
        "pos": [
          0.0,
          -0.48,
          -0.06
        ],
        "description": "Autonomic vital centers controlling heart rate, BP, and respiration."
      },
      {
        "id": "temporal_lobe",
        "name": "Temporal Lobe",
        "pos": [
          0.42,
          -0.06,
          0.12
        ],
        "description": "Auditory processing, Wernicke speech comprehension, and hippocampus memory."
      }
    ],
    "hotspotsCount": 4,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "brain",
      "brain",
      "cerebrum & cerebral cortex",
      "encephalon / cerebrum"
    ]
  },
  "cerebellum": {
    "id": "cerebellum",
    "name": "Cerebellum (Fine Motor Coordinator)",
    "latinName": "Cerebellum (Arbor vitae)",
    "systemId": "nervous",
    "systemName": "Nervous System",
    "cavity": "Posterior Cranial Fossa",
    "vertebralLevel": "Infratentorial",
    "dimensions": "150g \u00b7 50% of Total Brain Neurons",
    "icon": "\ud83e\udde9",
    "modelUrl": "/hra-brain.glb",
    "standaloneModelUrl": "/hra-brain.glb",
    "summary": "Calculates real-time sensorimotor error corrections, coordinates smooth voluntary movements, calibrates balance, and stores procedural muscle memories.",
    "function": "Calculates real-time sensorimotor error corrections, coordinates smooth voluntary movements, calibrates balance, and stores procedural muscle memories.",
    "physiology": "Calculates real-time sensorimotor error corrections, coordinates smooth voluntary movements, calibrates balance, and stores procedural muscle memories.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.72,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 34
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "cerebellum",
      "cerebellum",
      "cerebellum (fine motor coordinator)",
      "cerebellum (arbor vitae)"
    ]
  },
  "brainstem": {
    "id": "brainstem",
    "name": "Brainstem (Midbrain, Pons, Medulla)",
    "latinName": "Truncus encephali",
    "systemId": "nervous",
    "systemName": "Nervous System",
    "cavity": "Posterior Cranial Fossa & Foramen Magnum",
    "vertebralLevel": "Clivus to C1",
    "dimensions": "7 cm length \u00b7 Cranial Nerves III-XII",
    "icon": "\ud83d\udd79\ufe0f",
    "modelUrl": "/hra-brain.glb",
    "standaloneModelUrl": "/hra-brain.glb",
    "summary": "Controls involuntary vital survival reflexes including respiration, cardiac chronotropy, vasomotor vascular tone, swallowing, and vomiting.",
    "function": "Controls involuntary vital survival reflexes including respiration, cardiac chronotropy, vasomotor vascular tone, swallowing, and vomiting.",
    "physiology": "Controls involuntary vital survival reflexes including respiration, cardiac chronotropy, vasomotor vascular tone, swallowing, and vomiting.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.72,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 34
    },
    "hotspots": [],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "brainstem",
      "brainstem",
      "brainstem (midbrain, pons, medulla)",
      "truncus encephali"
    ]
  },
  "spinal_cord": {
    "id": "spinal_cord",
    "name": "Spinal Cord & Cauda Equina",
    "latinName": "Medulla spinalis",
    "systemId": "nervous",
    "systemName": "Nervous System",
    "cavity": "Vertebral Spinal Canal",
    "vertebralLevel": "Foramen Magnum to L1/L2 (Conus Medullaris)",
    "dimensions": "45 cm length \u00b7 31 Pairs of Spinal Nerves",
    "icon": "\u26a1",
    "modelUrl": "/bodyparts3d-skeleton.glb",
    "standaloneModelUrl": "/bodyparts3d-skeleton.glb",
    "summary": "Ascending sensory and descending motor white matter conduits relaying signals between peripheral somatic organs and the central brain.",
    "function": "Ascending sensory and descending motor white matter conduits relaying signals between peripheral somatic organs and the central brain.",
    "physiology": "Ascending sensory and descending motor white matter conduits relaying signals between peripheral somatic organs and the central brain.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "spinal_cord",
      "spinal cord",
      "spinal cord & cauda equina",
      "medulla spinalis"
    ]
  },
  "thalamus_hypothalamus": {
    "id": "thalamus_hypothalamus",
    "name": "Thalamus & Hypothalamus",
    "latinName": "Thalamus et Hypothalamus",
    "systemId": "nervous",
    "systemName": "Nervous & Endocrine",
    "cavity": "Diencephalon (Surrounding Third Ventricle)",
    "vertebralLevel": "Intracranial Deep Core",
    "dimensions": "4g (Hypothalamus) \u00b7 Circadian Clock",
    "icon": "\ud83d\udca1",
    "modelUrl": "/hra-brain.glb",
    "standaloneModelUrl": "/hra-brain.glb",
    "summary": "Thalamus relays all sensory inputs (except olfaction) to the cortex; hypothalamus governs autonomic homeostasis, body temperature, hunger, and endocrine axes.",
    "function": "Thalamus relays all sensory inputs (except olfaction) to the cortex; hypothalamus governs autonomic homeostasis, body temperature, hunger, and endocrine axes.",
    "physiology": "Thalamus relays all sensory inputs (except olfaction) to the cortex; hypothalamus governs autonomic homeostasis, body temperature, hunger, and endocrine axes.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "thalamus_hypothalamus",
      "thalamus hypothalamus",
      "thalamus & hypothalamus",
      "thalamus et hypothalamus"
    ]
  },
  "meninges": {
    "id": "meninges",
    "name": "Cranial & Spinal Meninges (Dura, Arachnoid, Pia)",
    "latinName": "Meninges cerebrales et spinales",
    "systemId": "nervous",
    "systemName": "Nervous System",
    "cavity": "Cranial Cavity & Spinal Canal",
    "vertebralLevel": "Skull to S2",
    "dimensions": "Contains ~150 mL Cerebrospinal Fluid",
    "icon": "\ud83d\udee1\ufe0f",
    "modelUrl": "/hra-brain.glb",
    "standaloneModelUrl": "/hra-brain.glb",
    "summary": "Three-layered protective membranous envelope suspending neural structures in shock-absorbing CSF and enclosing the dural venous sinuses.",
    "function": "Three-layered protective membranous envelope suspending neural structures in shock-absorbing CSF and enclosing the dural venous sinuses.",
    "physiology": "Three-layered protective membranous envelope suspending neural structures in shock-absorbing CSF and enclosing the dural venous sinuses.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.72,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 34
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "meninges",
      "meninges",
      "cranial & spinal meninges (dura, arachnoid, pia)",
      "meninges cerebrales et spinales"
    ]
  },
  "liver": {
    "id": "liver",
    "name": "Liver & Hepatic Lobules",
    "latinName": "Hepar / Iecur",
    "systemId": "digestive",
    "systemName": "Digestive & Metabolic",
    "cavity": "Right Hypochondrium & Epigastrium",
    "vertebralLevel": "T8 - L1",
    "dimensions": "1.5 kg (Largest visceral organ)",
    "icon": "\ud83e\udd6a",
    "modelUrl": "/hra-liver.glb",
    "standaloneModelUrl": "/hra-liver.glb",
    "summary": "Metabolic nexus receiving dual blood supply (Portal Vein & Hepatic Artery); synthesizes plasma proteins, stores glycogen, and produces bile.",
    "function": "Metabolic nexus receiving dual blood supply (Portal Vein & Hepatic Artery); synthesizes plasma proteins, stores glycogen, and produces bile.",
    "physiology": "Largest metabolic factory; dual blood inflow (75% portal vein, 25% hepatic artery); synthesizes albumin, coagulation factors, detoxifies ammonia to urea, produces bile.",
    "bloodSupply": "Hepatic Portal Vein and Hepatic Artery Proper; Hepatic Veins drain into IVC.",
    "nerveSupply": "Hepatic plexus (Celiac ganglia and CN X).",
    "clinicalNotes": "Cirrhosis, Portal Hypertension, Viral Hepatitis, Hepatocellular Carcinoma (HCC), NAFLD.",
    "coordinates": {
      "x": 0.08,
      "y": 0.08,
      "z": 0.06
    },
    "mapPosition": {
      "xPercent": 56,
      "yPercent": 42
    },
    "hotspots": [
      {
        "id": "right_lobe",
        "name": "Right Hepatic Lobe",
        "pos": [
          0.25,
          0.1,
          0.05
        ],
        "description": "Larger anatomical lobe containing segments V through VIII."
      },
      {
        "id": "left_lobe",
        "name": "Left Hepatic Lobe",
        "pos": [
          -0.25,
          0.1,
          0.05
        ],
        "description": "Extends across epigastrium toward left hypochondrium."
      },
      {
        "id": "gallbladder_bed",
        "name": "Gallbladder Fossa",
        "pos": [
          0.1,
          -0.2,
          0.08
        ],
        "description": "Inferior visceral surface where gallbladder rests."
      }
    ],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "liver",
      "liver",
      "liver & hepatic lobules",
      "hepar / iecur"
    ]
  },
  "gallbladder": {
    "id": "gallbladder",
    "name": "Gallbladder & Extrahepatic Biliary Tree",
    "latinName": "Vesica biliaris et ductus choledochus",
    "systemId": "digestive",
    "systemName": "Digestive System",
    "cavity": "Inferior Visceral Surface of Liver",
    "vertebralLevel": "L1 (Tip of 9th Costal Cartilage)",
    "dimensions": "50 mL capacity \u00b7 Pear-shaped reservoir",
    "icon": "\ud83c\udf50",
    "modelUrl": "/hra-liver.glb",
    "standaloneModelUrl": "/hra-liver.glb",
    "summary": "Stores and concentrates bile up to tenfold; contracts in response to cholecystokinin (CCK) to discharge bile into the duodenum for fat emulsification.",
    "function": "Stores and concentrates bile up to tenfold; contracts in response to cholecystokinin (CCK) to discharge bile into the duodenum for fat emulsification.",
    "physiology": "Concentrates liver bile up to 10-fold by actively absorbing water; contracts under cholecystokinin (CCK) stimulation following a fatty meal.",
    "bloodSupply": "Cystic Artery (arising from Right Hepatic Artery inside Calot's triangle).",
    "nerveSupply": "Celiac plexus.",
    "clinicalNotes": "Cholelithiasis (gallstones), Acute Cholecystitis, Choledocholithiasis.",
    "coordinates": {
      "x": 0.08,
      "y": 0.02,
      "z": 0.07
    },
    "mapPosition": {
      "xPercent": 55,
      "yPercent": 44
    },
    "hotspots": [
      {
        "id": "cystic_duct",
        "name": "Cystic Duct & Spiral Valves",
        "pos": [
          0.0,
          0.1,
          0.0
        ],
        "description": "Conveys bile to and from common bile duct."
      }
    ],
    "hotspotsCount": 1,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "gallbladder",
      "gallbladder",
      "gallbladder & extrahepatic biliary tree",
      "vesica biliaris et ductus choledochus"
    ]
  },
  "stomach": {
    "id": "stomach",
    "name": "Stomach & Gastric Reservoir",
    "latinName": "Gaster / Ventriculus",
    "systemId": "digestive",
    "systemName": "Digestive System",
    "cavity": "Left Upper Quadrant (Epigastrium)",
    "vertebralLevel": "T10 - L2 (Cardia at T11, Pylorus at L1)",
    "dimensions": "1.0\u20131.5 L capacity \u00b7 pH 1.5\u20132.0",
    "icon": "\ud83e\udd58",
    "modelUrl": "/hra-large-intestine.glb",
    "standaloneModelUrl": "/hra-large-intestine.glb",
    "summary": "J-shaped muscular organ initiating enzymatic proteolysis via pepsin and mechanical churning of ingested nutrients into acidic chyme.",
    "function": "J-shaped muscular organ initiating enzymatic proteolysis via pepsin and mechanical churning of ingested nutrients into acidic chyme.",
    "physiology": "Secretes concentrated hydrochloric acid (pH 1.5\u20132.0) via parietal cells and pepsinogen via chief cells; churns food bolus into chyme; secretes intrinsic factor for B12.",
    "bloodSupply": "Left and Right Gastric, Left and Right Gastro-omental, and Short Gastric Arteries.",
    "nerveSupply": "Anterior and posterior Vagal trunks (CN X).",
    "clinicalNotes": "Peptic Ulcer Disease (H. pylori), Gastritis, GERD, Gastric Adenocarcinoma.",
    "coordinates": {
      "x": -0.06,
      "y": 0.08,
      "z": 0.06
    },
    "mapPosition": {
      "xPercent": 44,
      "yPercent": 42
    },
    "hotspots": [
      {
        "id": "fundus",
        "name": "Gastric Fundus",
        "pos": [
          -0.15,
          0.2,
          0.0
        ],
        "description": "Dome-shaped superior reservoir capturing swallowed gas."
      },
      {
        "id": "pylorus",
        "name": "Pyloric Sphincter",
        "pos": [
          0.15,
          -0.15,
          0.0
        ],
        "description": "Regulates chyme delivery into duodenum."
      }
    ],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "stomach",
      "stomach",
      "stomach & gastric reservoir",
      "gaster / ventriculus"
    ]
  },
  "pancreas": {
    "id": "pancreas",
    "name": "Pancreas (Digestive & Endocrine)",
    "latinName": "Pancreas",
    "systemId": "digestive",
    "systemName": "Digestive & Endocrine",
    "cavity": "Retroperitoneal Space (Epigastrium)",
    "vertebralLevel": "L1 - L2",
    "dimensions": "80g \u00b7 15 cm length",
    "icon": "\ud83e\uddec",
    "modelUrl": "/hra-pancreas.glb",
    "standaloneModelUrl": "/hra-pancreas.glb",
    "summary": "Exocrine acini secrete alkaline digestive enzymes (lipase, amylase, trypsinogen); endocrine Islets of Langerhans secrete insulin and glucagon.",
    "function": "Exocrine acini secrete alkaline digestive enzymes (lipase, amylase, trypsinogen); endocrine Islets of Langerhans secrete insulin and glucagon.",
    "physiology": "Exocrine acini secrete digestive enzymes (lipase, amylase, proteases) and bicarbonate; endocrine Islets of Langerhans secrete insulin (beta), glucagon (alpha), and somatostatin (delta).",
    "bloodSupply": "Splenic artery, superior and inferior pancreaticoduodenal arteries.",
    "nerveSupply": "Celiac and superior mesenteric plexuses.",
    "clinicalNotes": "Type 1 & 2 Diabetes, Acute/Chronic Pancreatitis, Pancreatic Adenocarcinoma.",
    "coordinates": {
      "x": -0.02,
      "y": 0.04,
      "z": 0.01
    },
    "mapPosition": {
      "xPercent": 49,
      "yPercent": 43
    },
    "hotspots": [
      {
        "id": "pancreatic_head",
        "name": "Head of Pancreas",
        "pos": [
          0.15,
          0.0,
          0.0
        ],
        "description": "Nestled inside C-loop of duodenum."
      },
      {
        "id": "pancreatic_tail",
        "name": "Tail of Pancreas",
        "pos": [
          -0.2,
          0.05,
          0.0
        ],
        "description": "Extends toward splenic hilum."
      }
    ],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "pancreas",
      "pancreas",
      "pancreas (digestive & endocrine)",
      "pancreas"
    ]
  },
  "small_intestine": {
    "id": "small_intestine",
    "name": "Small Intestine (Duodenum, Jejunum, Ileum)",
    "latinName": "Intestinum tenue",
    "systemId": "digestive",
    "systemName": "Digestive System",
    "cavity": "Central Abdominopelvic Space",
    "vertebralLevel": "L1 - L5",
    "dimensions": "6 meters length \u00b7 ~30 m\u00b2 mucosal area",
    "icon": "\ud83e\udeb1",
    "proceduralType": "small_intestine",
    "modelUrl": null,
    "standaloneModelUrl": null,
    "summary": "Principal site of chemical nutrient breakdown and trans-epithelial absorption across mucosal villi and microvilli into bloodstream and lacteals.",
    "function": "Principal site of chemical nutrient breakdown and trans-epithelial absorption across mucosal villi and microvilli into bloodstream and lacteals.",
    "physiology": "Site of 90% of all chemical digestion and nutrient absorption. Circular plicae, villi, and microvillar brush border amplify absorptive surface to ~30 m\u00b2.",
    "bloodSupply": "Superior Mesenteric Artery (SMA) branching into jejunal and ileal arcades.",
    "nerveSupply": "Enteric Nervous System (Myenteric and Submucosal plexuses).",
    "clinicalNotes": "Celiac Disease, Crohn's Disease, Small Bowel Obstruction (adhesions), Mesenteric Ischemia.",
    "coordinates": {
      "x": -0.02,
      "y": -0.06,
      "z": 0.06
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 52
    },
    "hotspots": [
      {
        "id": "duodenum",
        "name": "Duodenal C-Loop",
        "pos": [
          0.1,
          0.12,
          0.0
        ],
        "description": "Receives chyme, pancreatic juice, and bile via Ampulla of Vater."
      },
      {
        "id": "jejunum",
        "name": "Jejunal Loops",
        "pos": [
          -0.1,
          -0.02,
          0.05
        ],
        "description": "High mucosal folds specialized for carbohydrate and amino acid absorption."
      }
    ],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "small_intestine",
      "small intestine",
      "small intestine (duodenum, jejunum, ileum)",
      "intestinum tenue"
    ]
  },
  "large_intestine": {
    "id": "large_intestine",
    "name": "Large Intestine & Colon",
    "latinName": "Intestinum crassum (Colon)",
    "systemId": "digestive",
    "systemName": "Digestive System",
    "cavity": "Peripheral Abdominal Frame",
    "vertebralLevel": "T12 - Pelvic Floor",
    "dimensions": "1.5 meters length \u00b7 Cecum to Rectum",
    "icon": "\ud83c\udf00",
    "modelUrl": "/hra-large-intestine.glb",
    "standaloneModelUrl": "/hra-large-intestine.glb",
    "summary": "Reabsorbs water, compacts fecal matter, and hosts gut commensal microflora synthesizing essential Vitamin K and short-chain fatty acids.",
    "function": "Reabsorbs water, compacts fecal matter, and hosts gut commensal microflora synthesizing essential Vitamin K and short-chain fatty acids.",
    "physiology": "Reabsorbs water (~1.5 L/day) and sodium from chyme; compacts feces; gut microbiome synthesizes Vitamin K and short-chain fatty acids.",
    "bloodSupply": "SMA (midgut: cecum to proximal 2/3 transverse colon), IMA (hindgut: distal 1/3 transverse to rectum).",
    "nerveSupply": "Enteric Nervous System modulated by vagus and pelvic splanchnic nerves.",
    "clinicalNotes": "Colorectal Carcinoma, Ulcerative Colitis, Diverticulitis, Hirschsprung Disease.",
    "coordinates": {
      "x": 0.0,
      "y": -0.12,
      "z": 0.06
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 56
    },
    "hotspots": [
      {
        "id": "cecum",
        "name": "Cecum & Ileocecal Valve",
        "pos": [
          0.2,
          -0.15,
          0.04
        ],
        "description": "Entry point for ileal content into large bowel."
      },
      {
        "id": "sigmoid_colon",
        "name": "Sigmoid Colon",
        "pos": [
          -0.18,
          -0.22,
          0.04
        ],
        "description": "S-shaped reservoir leading to rectum."
      }
    ],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "large_intestine",
      "large intestine",
      "large intestine & colon",
      "intestinum crassum (colon)"
    ]
  },
  "appendix": {
    "id": "appendix",
    "name": "Vermiform Appendix (GALT Defense)",
    "latinName": "Appendix vermiformis",
    "systemId": "digestive",
    "systemName": "Digestive & Immune",
    "cavity": "Right Iliac Fossa (McBurney's Point)",
    "vertebralLevel": "L4 - L5",
    "dimensions": "8\u201310 cm length \u00b7 0.6 cm lumen",
    "icon": "\ud83d\udc1b",
    "modelUrl": "/hra-large-intestine.glb",
    "standaloneModelUrl": "/hra-large-intestine.glb",
    "summary": "Blind-ended tubular diverticulum rich in gut-associated lymphoid tissue (GALT); acts as safe reservoir repopulating enteric flora after diarrhea.",
    "function": "Blind-ended tubular diverticulum rich in gut-associated lymphoid tissue (GALT); acts as safe reservoir repopulating enteric flora after diarrhea.",
    "physiology": "Blind-ended tubular diverticulum rich in gut-associated lymphoid tissue (GALT); acts as safe reservoir repopulating enteric flora after diarrhea.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "appendix",
      "appendix",
      "vermiform appendix (galt defense)",
      "appendix vermiformis"
    ]
  },
  "esophagus": {
    "id": "esophagus",
    "name": "Esophagus (Peristaltic Conduit)",
    "latinName": "Oesophagus",
    "systemId": "digestive",
    "systemName": "Digestive System",
    "cavity": "Posterior Mediastinum & Upper Abdomen",
    "vertebralLevel": "C6 - T11 (Gastroesophageal Junction)",
    "dimensions": "25 cm length \u00b7 Stratified Squamous",
    "icon": "\ud83e\udd56",
    "modelUrl": "/z-anatomy-body.glb",
    "standaloneModelUrl": "/z-anatomy-body.glb",
    "summary": "Muscular tube propelling swallowed food bolus from pharynx into the stomach via coordinated involuntary primary and secondary peristalsis waves.",
    "function": "Muscular tube propelling swallowed food bolus from pharynx into the stomach via coordinated involuntary primary and secondary peristalsis waves.",
    "physiology": "Muscular tube propelling swallowed food bolus from pharynx into the stomach via coordinated involuntary primary and secondary peristalsis waves.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "esophagus",
      "esophagus",
      "esophagus (peristaltic conduit)",
      "oesophagus"
    ]
  },
  "kidneys": {
    "id": "kidneys",
    "name": "Bilateral Kidneys (Nephron Filtration)",
    "latinName": "Renes (Sinister et Dexter)",
    "systemId": "urinary",
    "systemName": "Urinary & Renal System",
    "cavity": "Retroperitoneal Lumbar Space",
    "vertebralLevel": "T12 - L3",
    "dimensions": "150g each \u00b7 180 L/day GFR",
    "icon": "\ud83e\uded8",
    "modelUrl": "/hra-kidney.glb",
    "standaloneModelUrl": "/hra-kidney.glb",
    "summary": "Contains ~2 million nephrons that ultrafilter blood plasma, reabsorb electrolytes, regulate systemic blood pressure (RAAS), and excrete urea.",
    "function": "Contains ~2 million nephrons that ultrafilter blood plasma, reabsorb electrolytes, regulate systemic blood pressure (RAAS), and excrete urea.",
    "physiology": "Filter ~180 L of ultrafiltrate daily; reabsorb 99% of fluid and essential electrolytes; secrete renin (RAAS axis), erythropoietin (EPO), and activate calcitriol (Vit D).",
    "bloodSupply": "Bilateral Renal Arteries direct from Abdominal Aorta; Renal Veins to IVC.",
    "nerveSupply": "Renal plexus (Sympathetic T10-L1 vasoconstriction).",
    "clinicalNotes": "Acute Kidney Injury (AKI), Chronic Kidney Disease (CKD), Nephrolithiasis (Kidney Stones), Glomerulonephritis.",
    "coordinates": {
      "x": 0.0,
      "y": 0.05,
      "z": -0.04
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 46
    },
    "hotspots": [
      {
        "id": "renal_cortex",
        "name": "Renal Cortex & Glomeruli",
        "pos": [
          0.15,
          0.2,
          0.0
        ],
        "description": "Ultrafiltration of blood across capillary podocytes."
      },
      {
        "id": "renal_pyramids",
        "name": "Medullary Pyramids",
        "pos": [
          0.05,
          0.0,
          0.0
        ],
        "description": "Loops of Henle and collecting ducts concentrating urine."
      },
      {
        "id": "renal_pelvis",
        "name": "Renal Pelvis & Hilum",
        "pos": [
          -0.1,
          -0.05,
          0.0
        ],
        "description": "Funnel collecting urine into ureter."
      }
    ],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "kidneys",
      "kidneys",
      "bilateral kidneys (nephron filtration)",
      "renes (sinister et dexter)"
    ]
  },
  "ureters": {
    "id": "ureters",
    "name": "Bilateral Ureters (Peristaltic Ducts)",
    "latinName": "Ureter (Sinister et Dexter)",
    "systemId": "urinary",
    "systemName": "Urinary System",
    "cavity": "Retroperitoneal Abdomen & True Pelvis",
    "vertebralLevel": "L2 - S4",
    "dimensions": "25\u201330 cm length \u00b7 Transitional Epithelium",
    "icon": "\u3030\ufe0f",
    "modelUrl": "/hra-kidney.glb",
    "standaloneModelUrl": "/hra-kidney.glb",
    "summary": "Muscular tubes actively propelling drops of filtered urine from renal pelvis down into the urinary bladder via rhythmic smooth-muscle peristalsis.",
    "function": "Muscular tubes actively propelling drops of filtered urine from renal pelvis down into the urinary bladder via rhythmic smooth-muscle peristalsis.",
    "physiology": "Muscular tubes actively propelling drops of filtered urine from renal pelvis down into the urinary bladder via rhythmic smooth-muscle peristalsis.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "ureters",
      "ureters",
      "bilateral ureters (peristaltic ducts)",
      "ureter (sinister et dexter)"
    ]
  },
  "bladder": {
    "id": "bladder",
    "name": "Urinary Bladder & Detrusor",
    "latinName": "Vesica urinaria",
    "systemId": "urinary",
    "systemName": "Urinary System",
    "cavity": "True Pelvis (Subperitoneal Space)",
    "vertebralLevel": "Pubic Symphysis",
    "dimensions": "400\u2013600 mL capacity",
    "icon": "\ud83d\udca7",
    "modelUrl": "/hra-bladder.glb",
    "standaloneModelUrl": "/hra-bladder.glb",
    "summary": "Distensible reservoir lined with transitional urothelium; detrusor muscle contracts voluntarily during micturition coordinated by sacral nerves.",
    "function": "Distensible reservoir lined with transitional urothelium; detrusor muscle contracts voluntarily during micturition coordinated by sacral nerves.",
    "physiology": "Distensible hollow muscular reservoir storing 400\u2013600 mL of urine; lined with impermeable urothelium; detrusor contracts under parasympathetic S2\u2013S4 control during micturition.",
    "bloodSupply": "Superior and Inferior Vesical Arteries (from Internal Iliac).",
    "nerveSupply": "Pelvic splanchnic (parasympathetic), hypogastric (sympathetic), pudendal (voluntary external sphincter).",
    "clinicalNotes": "Urinary Tract Infection (Cystitis), Neurogenic Bladder, Urinary Incontinence, Urothelial Carcinoma.",
    "coordinates": {
      "x": 0.0,
      "y": -0.32,
      "z": 0.08
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 62
    },
    "hotspots": [
      {
        "id": "trigone",
        "name": "Bladder Trigone",
        "pos": [
          0.0,
          -0.1,
          0.0
        ],
        "description": "Smooth triangular zone between bilateral ureteric orifices and internal urethral orifice."
      }
    ],
    "hotspotsCount": 1,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "bladder",
      "bladder",
      "urinary bladder & detrusor",
      "vesica urinaria"
    ]
  },
  "urethra": {
    "id": "urethra",
    "name": "Urethra & Micturition Sphincters",
    "latinName": "Urethra humana",
    "systemId": "urinary",
    "systemName": "Urinary System",
    "cavity": "Pelvic Floor & Perineum",
    "vertebralLevel": "Subvesical Outlet",
    "dimensions": "4 cm (Female) \u00b7 20 cm (Male)",
    "icon": "\ud83d\udebf",
    "modelUrl": "/hra-bladder.glb",
    "standaloneModelUrl": "/hra-bladder.glb",
    "summary": "Terminal excretory canal conveying urine from the bladder out of the body; features involuntary internal and voluntary external sphincters.",
    "function": "Terminal excretory canal conveying urine from the bladder out of the body; features involuntary internal and voluntary external sphincters.",
    "physiology": "Terminal excretory canal conveying urine from the bladder out of the body; features involuntary internal and voluntary external sphincters.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": -0.32,
      "z": 0.04
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 57
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "urethra",
      "urethra",
      "urethra & micturition sphincters",
      "urethra humana"
    ]
  },
  "thyroid": {
    "id": "thyroid",
    "name": "Thyroid Gland (Metabolic Thermogenesis)",
    "latinName": "Glandula thyroidea",
    "systemId": "endocrine",
    "systemName": "Endocrine System",
    "cavity": "Anterior Cervical Visceral Space (Pretracheal)",
    "vertebralLevel": "C5 - T1",
    "dimensions": "20\u201325g \u00b7 Butterfly-shaped bilobed gland",
    "icon": "\ud83e\udd8b",
    "modelUrl": "/hra-larynx.glb",
    "standaloneModelUrl": "/hra-larynx.glb",
    "summary": "Synthesizes thyroxine (T4) and triiodothyronine (T3) regulating basal metabolic rate, body temperature, protein synthesis, and bone growth.",
    "function": "Synthesizes thyroxine (T4) and triiodothyronine (T3) regulating basal metabolic rate, body temperature, protein synthesis, and bone growth.",
    "physiology": "Synthesizes thyroxine (T4) and triiodothyronine (T3) regulating basal metabolic rate, body temperature, protein synthesis, and bone growth.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.58,
      "z": 0.03
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 37
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "thyroid",
      "thyroid",
      "thyroid gland (metabolic thermogenesis)",
      "glandula thyroidea"
    ]
  },
  "parathyroid": {
    "id": "parathyroid",
    "name": "Parathyroid Glands (Calcium Balance)",
    "latinName": "Glandulae parathyroideae (4 Glandulae)",
    "systemId": "endocrine",
    "systemName": "Endocrine System",
    "cavity": "Posterior Capsule of Thyroid Lobes",
    "vertebralLevel": "C6 - C7",
    "dimensions": "4 glands \u00b7 30\u201340 mg each",
    "icon": "\ud83d\udd2c",
    "modelUrl": "/hra-larynx.glb",
    "standaloneModelUrl": "/hra-larynx.glb",
    "summary": "Secretes Parathyroid Hormone (PTH) in response to hypocalcemia; stimulates osteoclastic bone resorption and renal calcium reabsorption.",
    "function": "Secretes Parathyroid Hormone (PTH) in response to hypocalcemia; stimulates osteoclastic bone resorption and renal calcium reabsorption.",
    "physiology": "Secretes Parathyroid Hormone (PTH) in response to hypocalcemia; stimulates osteoclastic bone resorption and renal calcium reabsorption.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.58,
      "z": 0.03
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 37
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "parathyroid",
      "parathyroid",
      "parathyroid glands (calcium balance)",
      "glandulae parathyroideae (4 glandulae)"
    ]
  },
  "adrenals": {
    "id": "adrenals",
    "name": "Adrenal Glands (Cortisol & Adrenaline)",
    "latinName": "Glandulae suprarenales",
    "systemId": "endocrine",
    "systemName": "Endocrine System",
    "cavity": "Perirenal Fat on Superior Renal Poles",
    "vertebralLevel": "T12",
    "dimensions": "4\u20135g each \u00b7 Cortex + Medulla",
    "icon": "\u26a1",
    "modelUrl": "/hra-kidney.glb",
    "standaloneModelUrl": "/hra-kidney.glb",
    "summary": "Adrenal cortex secretes cortisol, aldosterone, and androgens; adrenal medulla secretes epinephrine and norepinephrine for sympathetic fight-or-flight.",
    "function": "Adrenal cortex secretes cortisol, aldosterone, and androgens; adrenal medulla secretes epinephrine and norepinephrine for sympathetic fight-or-flight.",
    "physiology": "Adrenal cortex secretes cortisol, aldosterone, and androgens; adrenal medulla secretes epinephrine and norepinephrine for sympathetic fight-or-flight.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "adrenals",
      "adrenals",
      "adrenal glands (cortisol & adrenaline)",
      "glandulae suprarenales"
    ]
  },
  "pituitary": {
    "id": "pituitary",
    "name": "Pituitary Gland (Hypophysis Master Gland)",
    "latinName": "Hypophysis / Glandula pituitaria",
    "systemId": "endocrine",
    "systemName": "Endocrine System",
    "cavity": "Sella Turcica of Sphenoid Bone",
    "vertebralLevel": "Intracranial Skull Base",
    "dimensions": "0.5g \u00b7 Pea-sized master controller",
    "icon": "\ud83d\udc51",
    "modelUrl": "/hra-brain.glb",
    "standaloneModelUrl": "/hra-brain.glb",
    "summary": "Master endocrine gland; anterior lobe secretes ACTH, TSH, GH, LH, FSH, and Prolactin; posterior lobe stores oxytocin and vasopressin (ADH).",
    "function": "Master endocrine gland; anterior lobe secretes ACTH, TSH, GH, LH, FSH, and Prolactin; posterior lobe stores oxytocin and vasopressin (ADH).",
    "physiology": "Master endocrine gland; anterior lobe secretes ACTH, TSH, GH, LH, FSH, and Prolactin; posterior lobe stores oxytocin and vasopressin (ADH).",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "pituitary",
      "pituitary",
      "pituitary gland (hypophysis master gland)",
      "hypophysis / glandula pituitaria"
    ]
  },
  "thymus": {
    "id": "thymus",
    "name": "Thymus Gland (T-Cell Maturation)",
    "latinName": "Thymus",
    "systemId": "endocrine",
    "systemName": "Endocrine & Lymphoid",
    "cavity": "Anterior Superior Mediastinum",
    "vertebralLevel": "C6 - T4",
    "dimensions": "35\u201340g in youth (Involutes with age)",
    "icon": "\ud83d\udee1\ufe0f",
    "modelUrl": "/hra-lungs.glb",
    "standaloneModelUrl": "/hra-lungs.glb",
    "summary": "Primary lymphoid organ responsible for the central selection, antigen education, and immunocompetent maturation of circulating T-lymphocytes.",
    "function": "Primary lymphoid organ responsible for the central selection, antigen education, and immunocompetent maturation of circulating T-lymphocytes.",
    "physiology": "Primary lymphoid organ responsible for the central selection, antigen education, and immunocompetent maturation of circulating T-lymphocytes.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "thymus",
      "thymus",
      "thymus gland (t-cell maturation)",
      "thymus"
    ]
  },
  "skeleton": {
    "id": "skeleton",
    "name": "Articulated Skeletal Framework (206 Bones)",
    "latinName": "Skeleton humanum (206 Ossa)",
    "systemId": "skeletal",
    "systemName": "Skeletal Framework",
    "cavity": "Axial & Appendicular Whole Body",
    "vertebralLevel": "Full Cranium to Distal Phalanges",
    "dimensions": "206 Bones \u00b7 ~14% of Total Adult Body Mass",
    "icon": "\ud83e\uddb4",
    "modelUrl": "/bodyparts3d-skeleton.glb",
    "standaloneModelUrl": "/bodyparts3d-skeleton.glb",
    "summary": "Rigid osteological framework providing mechanical leverage for movement, protective armor for vital viscera, and hematopoietic red marrow.",
    "function": "Rigid osteological framework providing mechanical leverage for movement, protective armor for vital viscera, and hematopoietic red marrow.",
    "physiology": "206 bones in adult (80 axial, 126 appendicular); provides mechanical support, protects visceral cavities, serves as mineral reservoir for 99% of calcium, and houses hematopoietic bone marrow.",
    "bloodSupply": "Nutrient arteries, metaphyseal and periosteal vessels.",
    "nerveSupply": "Sensory periosteal nerves.",
    "clinicalNotes": "Osteoporosis, Fractures, Osteoarthritis, Osteomyelitis.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [
      {
        "id": "cranium",
        "name": "Cranium & Skull",
        "pos": [
          0.0,
          0.85,
          0.0
        ],
        "description": "Protects brain and sensory organs."
      },
      {
        "id": "ribcage",
        "name": "Thoracic Cage",
        "pos": [
          0.0,
          0.3,
          0.0
        ],
        "description": "Guards heart and lungs during breathing."
      },
      {
        "id": "pelvis",
        "name": "Pelvic Ring",
        "pos": [
          0.0,
          -0.28,
          0.0
        ],
        "description": "Transmits upper body weight into lower extremities."
      }
    ],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "skeleton",
      "skeleton",
      "articulated skeletal framework (206 bones)",
      "skeleton humanum (206 ossa)"
    ]
  },
  "skull": {
    "id": "skull",
    "name": "Cranium & Facial Skeleton (Skull)",
    "latinName": "Cranium (Neurocranium et Viscerocranium)",
    "systemId": "skeletal",
    "systemName": "Skeletal System",
    "cavity": "Cephalic Head Region",
    "vertebralLevel": "Superior to C1 Atlas",
    "dimensions": "22 Bones (8 Cranial, 14 Facial)",
    "icon": "\ud83d\udc80",
    "modelUrl": "/6048cca2dd4c4815b0527e162e9fde69.glb",
    "standaloneModelUrl": "/6048cca2dd4c4815b0527e162e9fde69.glb",
    "summary": "Houses and shields the brain, sensory apparatus of eyes, ears, and olfactory nerves; supports masticatory jaw biomechanics.",
    "function": "Houses and shields the brain, sensory apparatus of eyes, ears, and olfactory nerves; supports masticatory jaw biomechanics.",
    "physiology": "Houses and shields the brain, sensory apparatus of eyes, ears, and olfactory nerves; supports masticatory jaw biomechanics.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.72,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 34
    },
    "hotspots": [],
    "hotspotsCount": 4,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "skull",
      "skull",
      "cranium & facial skeleton (skull)",
      "cranium (neurocranium et viscerocranium)"
    ]
  },
  "spine": {
    "id": "spine",
    "name": "Vertebral Column & Intervertebral Discs",
    "latinName": "Columna vertebralis (33 Vertebrae)",
    "systemId": "skeletal",
    "systemName": "Skeletal System",
    "cavity": "Dorsal Axial Core",
    "vertebralLevel": "C1 Atlas to Co4 Coccyx",
    "dimensions": "70 cm length \u00b7 4 Physiologic Curvatures",
    "icon": "\ud83e\ude9c",
    "modelUrl": "/bodyparts3d-skeleton.glb",
    "standaloneModelUrl": "/bodyparts3d-skeleton.glb",
    "summary": "Flexible axial support column with cervical, thoracic, lumbar lordoses and kyphoses; protects spinal cord while supporting torso axial weight.",
    "function": "Flexible axial support column with cervical, thoracic, lumbar lordoses and kyphoses; protects spinal cord while supporting torso axial weight.",
    "physiology": "Flexible axial support column with cervical, thoracic, lumbar lordoses and kyphoses; protects spinal cord while supporting torso axial weight.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 4,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "spine",
      "spine",
      "vertebral column & intervertebral discs",
      "columna vertebralis (33 vertebrae)"
    ]
  },
  "ribcage": {
    "id": "ribcage",
    "name": "Thoracic Rib Cage & Sternum",
    "latinName": "Cavea thoracis (12 Costae et Sternum)",
    "systemId": "skeletal",
    "systemName": "Skeletal System",
    "cavity": "Thoracic Visceral Cage",
    "vertebralLevel": "T1 - T12",
    "dimensions": "12 pairs of ribs (7 True, 3 False, 2 Floating)",
    "icon": "\ud83e\ude7b",
    "modelUrl": "/bodyparts3d-skeleton.glb",
    "standaloneModelUrl": "/bodyparts3d-skeleton.glb",
    "summary": "Bony and cartilaginous protective cage for heart and lungs; expands and recoils synchronously during pulmonary respiration.",
    "function": "Bony and cartilaginous protective cage for heart and lungs; expands and recoils synchronously during pulmonary respiration.",
    "physiology": "Bony and cartilaginous protective cage for heart and lungs; expands and recoils synchronously during pulmonary respiration.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.28,
      "z": 0.04
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 44
    },
    "hotspots": [],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "ribcage",
      "ribcage",
      "thoracic rib cage & sternum",
      "cavea thoracis (12 costae et sternum)"
    ]
  },
  "pelvis_skeleton": {
    "id": "pelvis_skeleton",
    "name": "Pelvic Girdle & Sacroiliac Architecture",
    "latinName": "Cingulum pelvicum (Os coxae et Os sacrum)",
    "systemId": "skeletal",
    "systemName": "Skeletal System",
    "cavity": "Pelvic Bowl",
    "vertebralLevel": "L5 - Coccyx",
    "dimensions": "Ilium, Ischium, and Pubis fused at Acetabulum",
    "icon": "\ud83e\udd63",
    "modelUrl": "/bodyparts3d-skeleton.glb",
    "standaloneModelUrl": "/bodyparts3d-skeleton.glb",
    "summary": "Massive bony ring transferring upper body mass to lower limbs; exhibits sexual dimorphism (broad gynoid birth canal in females, narrow android in males).",
    "function": "Massive bony ring transferring upper body mass to lower limbs; exhibits sexual dimorphism (broad gynoid birth canal in females, narrow android in males).",
    "physiology": "Massive bony ring transferring upper body mass to lower limbs; exhibits sexual dimorphism (broad gynoid birth canal in females, narrow android in males).",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": -0.32,
      "z": 0.04
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 57
    },
    "hotspots": [],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "pelvis_skeleton",
      "pelvis skeleton",
      "pelvic girdle & sacroiliac architecture",
      "cingulum pelvicum (os coxae et os sacrum)"
    ]
  },
  "muscles": {
    "id": "muscles",
    "name": "Superficial & Deep Skeletal Musculature",
    "latinName": "Musculi skeleti (640+ Musculi)",
    "systemId": "muscular",
    "systemName": "Muscular System",
    "cavity": "Somatic Body Wall & Extremities",
    "vertebralLevel": "Cranium to Phalanges",
    "dimensions": "640 Named Muscles \u00b7 40\u201345% of Body Mass",
    "icon": "\ud83d\udcaa",
    "modelUrl": "/z-anatomy-body.glb",
    "standaloneModelUrl": "/z-anatomy-body.glb",
    "summary": "Striated sarcomeric motor units generating joint torques, dynamic locomotion, upright posture stabilization, and non-shivering thermogenesis.",
    "function": "Striated sarcomeric motor units generating joint torques, dynamic locomotion, upright posture stabilization, and non-shivering thermogenesis.",
    "physiology": "Striated sarcomeric motor units generating joint torques, dynamic locomotion, upright posture stabilization, and non-shivering thermogenesis.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 4,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "muscles",
      "muscles",
      "superficial & deep skeletal musculature",
      "musculi skeleti (640+ musculi)"
    ]
  },
  "pectoralis_serratus": {
    "id": "pectoralis_serratus",
    "name": "Pectoral Girdle & Serratus Anterior",
    "latinName": "Musculus pectoralis major et serratus anterior",
    "systemId": "muscular",
    "systemName": "Muscular System",
    "cavity": "Anterior & Lateral Thoracic Wall",
    "vertebralLevel": "C5 - T1 (Medial/Lateral Pectoral & Long Thoracic N.)",
    "dimensions": "Broad fan-shaped muscular plates",
    "icon": "\ud83e\udebd",
    "modelUrl": "/z-anatomy-body.glb",
    "standaloneModelUrl": "/z-anatomy-body.glb",
    "summary": "Pectoralis flexes, adducts and rotates humerus; serratus anterior protracts scapula and anchors it tightly against thoracic wall (Boxer's muscle).",
    "function": "Pectoralis flexes, adducts and rotates humerus; serratus anterior protracts scapula and anchors it tightly against thoracic wall (Boxer's muscle).",
    "physiology": "Pectoralis flexes, adducts and rotates humerus; serratus anterior protracts scapula and anchors it tightly against thoracic wall (Boxer's muscle).",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.28,
      "z": 0.04
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 44
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "pectoralis_serratus",
      "pectoralis serratus",
      "pectoral girdle & serratus anterior",
      "musculus pectoralis major et serratus anterior"
    ]
  },
  "abdominal_wall": {
    "id": "abdominal_wall",
    "name": "Anterolateral Abdominal Core Wall",
    "latinName": "Musculi abdominis (Rectus, Obliquus, Transversus)",
    "systemId": "muscular",
    "systemName": "Muscular System",
    "cavity": "Anterior Abdominal Somatic Wall",
    "vertebralLevel": "T7 - L1",
    "dimensions": "4 layered flat muscle sheets & Linea Alba",
    "icon": "\ud83d\udee1\ufe0f",
    "modelUrl": "/z-anatomy-body.glb",
    "standaloneModelUrl": "/z-anatomy-body.glb",
    "summary": "Compresses abdominal viscera, supports spinal posture, aids forced expiration and defecation, and generates trunk flexion and rotation.",
    "function": "Compresses abdominal viscera, supports spinal posture, aids forced expiration and defecation, and generates trunk flexion and rotation.",
    "physiology": "Compresses abdominal viscera, supports spinal posture, aids forced expiration and defecation, and generates trunk flexion and rotation.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.04
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "abdominal_wall",
      "abdominal wall",
      "anterolateral abdominal core wall",
      "musculi abdominis (rectus, obliquus, transversus)"
    ]
  },
  "eyes": {
    "id": "eyes",
    "name": "Eyes & Optical Visual Apparatus",
    "latinName": "Oculi et Apparatus visualis",
    "systemId": "sensory",
    "systemName": "Sensory System",
    "cavity": "Bilateral Bony Orbits",
    "vertebralLevel": "Facial Skeleton",
    "dimensions": "24 mm diameter \u00b7 ~120 Million Rods, 6M Cones",
    "icon": "\ud83d\udc41\ufe0f",
    "modelUrl": "/hra-eye.glb",
    "standaloneModelUrl": "/hra-eye.glb",
    "summary": "Photoreceptive sensory organ focusing light onto the neurosensory retina via cornea and crystalline lens; signals transduced along Optic Nerve CN II.",
    "function": "Photoreceptive sensory organ focusing light onto the neurosensory retina via cornea and crystalline lens; signals transduced along Optic Nerve CN II.",
    "physiology": "Optical apparatus focusing photons through cornea and crystalline lens onto neural retina; photoreceptor rods and cones transduce light into electrical signals sent via Optic Nerve (CN II).",
    "bloodSupply": "Ophthalmic Artery (Internal Carotid) and Central Retinal Artery.",
    "nerveSupply": "Optic Nerve (CN II, sensory), Oculomotor (CN III), Trochlear (CN IV), Abducens (CN VI, ocular motility).",
    "clinicalNotes": "Glaucoma (elevated IOP), Cataracts (lens opacification), Macular Degeneration, Retinal Detachment.",
    "coordinates": {
      "x": 0.0,
      "y": 0.72,
      "z": 0.12
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 14
    },
    "hotspots": [
      {
        "id": "cornea",
        "name": "Cornea & Anterior Chamber",
        "pos": [
          0.0,
          0.0,
          0.35
        ],
        "description": "Clear anterior refracting surface providing ~70% of optical power."
      },
      {
        "id": "retina",
        "name": "Neural Retina & Macula",
        "pos": [
          0.0,
          0.0,
          -0.3
        ],
        "description": "Photoreceptive layer housing fovea centralis for sharp visual acuity."
      },
      {
        "id": "optic_nerve",
        "name": "Optic Nerve (CN II)",
        "pos": [
          0.0,
          -0.05,
          -0.45
        ],
        "description": "Axons transmitting visual information directly to visual cortex."
      }
    ],
    "hotspotsCount": 3,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "eyes",
      "eyes",
      "eyes & optical visual apparatus",
      "oculi et apparatus visualis"
    ]
  },
  "ears": {
    "id": "ears",
    "name": "Inner Ear (Cochlea & Vestibular Labyrinth)",
    "latinName": "Auris interna (Labyrinthus osseus et membranaceus)",
    "systemId": "sensory",
    "systemName": "Sensory System",
    "cavity": "Petrous Part of Temporal Bone",
    "vertebralLevel": "Skull Base",
    "dimensions": "Organ of Corti & Semicircular Canals",
    "icon": "\ud83d\udc42",
    "modelUrl": "/bodyparts3d-skeleton.glb",
    "standaloneModelUrl": "/bodyparts3d-skeleton.glb",
    "summary": "Houses hair-cell mechanoreceptors for sound transduction in the spiral cochlea and dynamic balance/head orientation in vestibular canals.",
    "function": "Houses hair-cell mechanoreceptors for sound transduction in the spiral cochlea and dynamic balance/head orientation in vestibular canals.",
    "physiology": "Houses hair-cell mechanoreceptors for sound transduction in the spiral cochlea and dynamic balance/head orientation in vestibular canals.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "ears",
      "ears",
      "inner ear (cochlea & vestibular labyrinth)",
      "auris interna (labyrinthus osseus et membranaceus)"
    ]
  },
  "tongue": {
    "id": "tongue",
    "name": "Tongue & Gustatory Papillae",
    "latinName": "Lingua (Papillae linguales)",
    "systemId": "sensory",
    "systemName": "Sensory & Digestive",
    "cavity": "Oral Cavity Proper",
    "vertebralLevel": "Mandibular Arch",
    "dimensions": "8 intrinsic and extrinsic muscles \u00b7 Hypoglossal N.",
    "icon": "\ud83d\udc45",
    "modelUrl": "/bodyparts3d-skeleton.glb",
    "standaloneModelUrl": "/bodyparts3d-skeleton.glb",
    "summary": "Muscular hydrostat orchestrating speech articulation, bolus manipulation during mastication, and taste perception via gustatory taste buds.",
    "function": "Muscular hydrostat orchestrating speech articulation, bolus manipulation during mastication, and taste perception via gustatory taste buds.",
    "physiology": "Muscular hydrostat orchestrating speech articulation, bolus manipulation during mastication, and taste perception via gustatory taste buds.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male",
      "female"
    ],
    "meshNames": [
      "tongue",
      "tongue",
      "tongue & gustatory papillae",
      "lingua (papillae linguales)"
    ]
  },
  "uterus": {
    "id": "uterus",
    "name": "Uterus & Endometrium (Female Anatomy)",
    "latinName": "Uterus (Fundus, Corpus et Cervix uteri)",
    "systemId": "reproductive",
    "systemName": "Female Reproductive System",
    "cavity": "True Lesser Female Pelvis",
    "vertebralLevel": "S2 - S4",
    "dimensions": "7.5 \u00d7 5.0 \u00d7 2.5 cm \u00b7 60\u201380g nulliparous",
    "icon": "\ud83d\udc76",
    "modelUrl": "/hra-uterus.glb",
    "standaloneModelUrl": "/hra-uterus.glb",
    "summary": "Hollow thick-walled muscular organ designed for blastocyst implantation, placental gestation, and myometrial oxytocin contractions during labor.",
    "function": "Hollow thick-walled muscular organ designed for blastocyst implantation, placental gestation, and myometrial oxytocin contractions during labor.",
    "physiology": "Hollow thick-walled muscular reproductive organ providing mechanical bed for blastocyst implantation, embryonic nourishment, and fetal gestation; powerful myometrium contracts during labor.",
    "bloodSupply": "Bilateral Uterine Arteries (Internal Iliac) crossing anterior to ureter.",
    "nerveSupply": "Uterovaginal plexus from inferior hypogastric plexus.",
    "clinicalNotes": "Uterine Leiomyomas (Fibroids), Endometriosis, Endometrial Carcinoma, Cervical Dysplasia (HPV).",
    "coordinates": {
      "x": 0.0,
      "y": -0.28,
      "z": 0.03
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 60
    },
    "hotspots": [
      {
        "id": "fundus",
        "name": "Uterine Fundus",
        "pos": [
          0.0,
          0.2,
          0.0
        ],
        "description": "Broad curved superior zone above insertion of fallopian tubes."
      },
      {
        "id": "cervix",
        "name": "Cervix & External Os",
        "pos": [
          0.0,
          -0.25,
          0.0
        ],
        "description": "Fibromuscular neck projecting into superior vaginal canal."
      }
    ],
    "hotspotsCount": 2,
    "genderAvailability": [
      "female"
    ],
    "meshNames": [
      "uterus",
      "uterus",
      "uterus & endometrium (female anatomy)",
      "uterus (fundus, corpus et cervix uteri)"
    ]
  },
  "ovaries": {
    "id": "ovaries",
    "name": "Bilateral Ovaries (Oogenesis & Estrogen)",
    "latinName": "Ovaria (Sinistrum et Dextrum)",
    "systemId": "reproductive",
    "systemName": "Female Reproductive & Endocrine",
    "cavity": "Ovarian Fossa of Pelvic Wall",
    "vertebralLevel": "S2 - S4",
    "dimensions": "4 \u00d7 2 \u00d7 1 cm \u00b7 ~400,000 Primordial Follicles",
    "icon": "\ud83c\udf38",
    "modelUrl": "/hra-uterus.glb",
    "standaloneModelUrl": "/hra-uterus.glb",
    "summary": "Female gonads producing haploid ova via cyclical follicular maturation; secretes systemic estrogens, progesterone, and inhibin.",
    "function": "Female gonads producing haploid ova via cyclical follicular maturation; secretes systemic estrogens, progesterone, and inhibin.",
    "physiology": "Female gonads producing haploid ova via cyclical follicular maturation; secretes systemic estrogens, progesterone, and inhibin.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": -0.32,
      "z": 0.04
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 57
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "female"
    ],
    "meshNames": [
      "ovaries",
      "ovaries",
      "bilateral ovaries (oogenesis & estrogen)",
      "ovaria (sinistrum et dextrum)"
    ]
  },
  "fallopian_tubes": {
    "id": "fallopian_tubes",
    "name": "Fallopian Tubes (Oviducts & Fimbriae)",
    "latinName": "Tubae uterinae (Salpinges)",
    "systemId": "reproductive",
    "systemName": "Female Reproductive System",
    "cavity": "Superior Border of Broad Ligament",
    "vertebralLevel": "S2 - S4",
    "dimensions": "10\u201312 cm length \u00b7 Ampulla site of fertilization",
    "icon": "\ud83e\udeb6",
    "modelUrl": "/hra-uterus.glb",
    "standaloneModelUrl": "/hra-uterus.glb",
    "summary": "Ciliated muscular ducts capturing ovulated oocyte via fimbriated infundibulum and conveying zygote toward the endometrial uterine cavity.",
    "function": "Ciliated muscular ducts capturing ovulated oocyte via fimbriated infundibulum and conveying zygote toward the endometrial uterine cavity.",
    "physiology": "Ciliated muscular ducts capturing ovulated oocyte via fimbriated infundibulum and conveying zygote toward the endometrial uterine cavity.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "female"
    ],
    "meshNames": [
      "fallopian_tubes",
      "fallopian tubes",
      "fallopian tubes (oviducts & fimbriae)",
      "tubae uterinae (salpinges)"
    ]
  },
  "cervix_vagina": {
    "id": "cervix_vagina",
    "name": "Cervix & Vaginal Canal",
    "latinName": "Cervix uteri et Vagina",
    "systemId": "reproductive",
    "systemName": "Female Reproductive System",
    "cavity": "Pelvic Cavity to Perineum",
    "vertebralLevel": "Subperitoneal Lower Pelvis",
    "dimensions": "8\u201310 cm length \u00b7 Stratified Non-keratinized",
    "icon": "\ud83c\udf3a",
    "modelUrl": "/hra-uterus.glb",
    "standaloneModelUrl": "/hra-uterus.glb",
    "summary": "Fibromuscular canal connecting uterine cavity to the exterior; serves as birth canal during parturition and copulatory passage.",
    "function": "Fibromuscular canal connecting uterine cavity to the exterior; serves as birth canal during parturition and copulatory passage.",
    "physiology": "Fibromuscular canal connecting uterine cavity to the exterior; serves as birth canal during parturition and copulatory passage.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": -0.32,
      "z": 0.04
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 57
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "female"
    ],
    "meshNames": [
      "cervix_vagina",
      "cervix vagina",
      "cervix & vaginal canal",
      "cervix uteri et vagina"
    ]
  },
  "testes": {
    "id": "testes",
    "name": "Testes & Seminiferous Tubules (Male Anatomy)",
    "latinName": "Testes (Sinister et Dexter)",
    "systemId": "reproductive",
    "systemName": "Male Reproductive & Endocrine",
    "cavity": "Scrotal Sac (Externalized Thermoregulation)",
    "vertebralLevel": "Perineal",
    "dimensions": "4 \u00d7 3 \u00d7 2.5 cm \u00b7 15\u201320g each \u00b7 34\u00b0C",
    "icon": "\ud83e\udd5a",
    "modelUrl": "/hra-bladder.glb",
    "standaloneModelUrl": "/hra-bladder.glb",
    "summary": "Male primary gonads; seminiferous tubules generate ~100 million spermatozoa daily via spermatogenesis; interstitial Leydig cells secrete testosterone.",
    "function": "Male primary gonads; seminiferous tubules generate ~100 million spermatozoa daily via spermatogenesis; interstitial Leydig cells secrete testosterone.",
    "physiology": "Male primary gonads; seminiferous tubules generate ~100 million spermatozoa daily via spermatogenesis; interstitial Leydig cells secrete testosterone.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male"
    ],
    "meshNames": [
      "testes",
      "testes",
      "testes & seminiferous tubules (male anatomy)",
      "testes (sinister et dexter)"
    ]
  },
  "prostate": {
    "id": "prostate",
    "name": "Prostate Gland & Seminal Vesicles",
    "latinName": "Prostata et Glandulae vesiculosae",
    "systemId": "reproductive",
    "systemName": "Male Reproductive System",
    "cavity": "Pelvic Cavity (Inferior to Bladder Neck)",
    "vertebralLevel": "S2 - S4",
    "dimensions": "20g \u00b7 Walnut-sized fibromuscular gland",
    "icon": "\ud83c\udf30",
    "modelUrl": "/hra-bladder.glb",
    "standaloneModelUrl": "/hra-bladder.glb",
    "summary": "Surrounds prostatic urethra; secretes alkaline fluid with PSA and citric acid (30% of semen) activating sperm motility and neutralizing vaginal acidity.",
    "function": "Surrounds prostatic urethra; secretes alkaline fluid with PSA and citric acid (30% of semen) activating sperm motility and neutralizing vaginal acidity.",
    "physiology": "Surrounds prostatic urethra; secretes alkaline fluid with PSA and citric acid (30% of semen) activating sperm motility and neutralizing vaginal acidity.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.58,
      "z": 0.03
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 37
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male"
    ],
    "meshNames": [
      "prostate",
      "prostate",
      "prostate gland & seminal vesicles",
      "prostata et glandulae vesiculosae"
    ]
  },
  "vas_deferens": {
    "id": "vas_deferens",
    "name": "Vas Deferens & Epididymis",
    "latinName": "Ductus deferens et Epididymis",
    "systemId": "reproductive",
    "systemName": "Male Reproductive System",
    "cavity": "Scrotum, Inguinal Canal & Pelvis",
    "vertebralLevel": "Inguinal to Retrovesical",
    "dimensions": "45 cm length \u00b7 Thick Smooth Muscle Wall",
    "icon": "\u3030\ufe0f",
    "modelUrl": "/hra-bladder.glb",
    "standaloneModelUrl": "/hra-bladder.glb",
    "summary": "Epididymis stores and matures sperm for 10\u201314 days; vas deferens conducts sperm rapidly through the inguinal canal during emission.",
    "function": "Epididymis stores and matures sperm for 10\u201314 days; vas deferens conducts sperm rapidly through the inguinal canal during emission.",
    "physiology": "Epididymis stores and matures sperm for 10\u201314 days; vas deferens conducts sperm rapidly through the inguinal canal during emission.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male"
    ],
    "meshNames": [
      "vas_deferens",
      "vas deferens",
      "vas deferens & epididymis",
      "ductus deferens et epididymis"
    ]
  },
  "penis": {
    "id": "penis",
    "name": "Male Erectile Corpora & External Genitalia",
    "latinName": "Penis (Corpora cavernosa et Corpus spongiosum)",
    "systemId": "reproductive",
    "systemName": "Male Reproductive System",
    "cavity": "Anterior Perineal Region",
    "vertebralLevel": "Infrapubic",
    "dimensions": "Tumescent erectile vascular lacunae",
    "icon": "\u2642\ufe0f",
    "modelUrl": "/hra-bladder.glb",
    "standaloneModelUrl": "/hra-bladder.glb",
    "summary": "Composed of three erectile columns; parasympathetic nitric oxide dilates helicine arteries producing tumescence for reproduction and micturition.",
    "function": "Composed of three erectile columns; parasympathetic nitric oxide dilates helicine arteries producing tumescence for reproduction and micturition.",
    "physiology": "Composed of three erectile columns; parasympathetic nitric oxide dilates helicine arteries producing tumescence for reproduction and micturition.",
    "bloodSupply": "Regional arterial inflow branching from systemic aorta; venous drainage to regional venous trunks.",
    "nerveSupply": "Regional somatic and autonomic plexuses.",
    "clinicalNotes": "Subject to inflammation, trauma, neoplastic transformation, and congenital variations.",
    "coordinates": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "mapPosition": {
      "xPercent": 50,
      "yPercent": 50
    },
    "hotspots": [],
    "hotspotsCount": 2,
    "genderAvailability": [
      "male"
    ],
    "meshNames": [
      "penis",
      "penis",
      "male erectile corpora & external genitalia",
      "penis (corpora cavernosa et corpus spongiosum)"
    ]
  }
};

/**
 * Calibration table unifying standing-body 3D coordinates, 2D SVG locator coordinates (viewBox 0..100 x 0..200),
 * concise shortNames, procedural sculpted organs, and submesh isolation keywords across all 54 structures.
 */
const ORGAN_CALIBRATION = {
  heart: { shortName: "Heart", coordinates: { x: 0.04, y: 1.10, z: 0.08 }, mapPosition: { xPercent: 53, yPercent: 60 } },
  aorta: { shortName: "Aorta", isolateMode: "submesh_focus", submeshKeywords: ["aorta", "aortic"], coordinates: { x: 0, y: 1.18, z: 0.02 }, mapPosition: { xPercent: 50, yPercent: 55 } },
  vena_cava: { shortName: "Vena Cava", isolateMode: "submesh_focus", submeshKeywords: ["vena_cava", "cava", "iliac_vein"], coordinates: { x: -0.05, y: 1.15, z: 0.02 }, mapPosition: { xPercent: 47, yPercent: 57 } },
  vasculature: { shortName: "Vasculature", coordinates: { x: 0, y: 0.45, z: 0.02 }, mapPosition: { xPercent: 50, yPercent: 76 } },
  spleen: { shortName: "Spleen", coordinates: { x: 0.20, y: 0.84, z: -0.04 }, mapPosition: { xPercent: 62, yPercent: 79 } },
  coronary_circulation: { shortName: "Coronary Vessels", isolateMode: "submesh_focus", submeshKeywords: ["valve", "aortic", "atrium", "ventricle"], coordinates: { x: 0.04, y: 1.10, z: 0.09 }, mapPosition: { xPercent: 54, yPercent: 61 } },
  lungs: { shortName: "Lungs", coordinates: { x: 0, y: 1.15, z: 0.02 }, mapPosition: { xPercent: 42, yPercent: 58 } },
  trachea: { shortName: "Trachea", isolateMode: "submesh_focus", submeshKeywords: ["trachea", "carina", "bronch"], coordinates: { x: 0, y: 1.36, z: 0.04 }, mapPosition: { xPercent: 50, yPercent: 44 } },
  larynx: { shortName: "Larynx", coordinates: { x: 0, y: 1.50, z: 0.06 }, mapPosition: { xPercent: 50, yPercent: 36 } },
  diaphragm: { shortName: "Diaphragm", isolateMode: "submesh_focus", submeshKeywords: ["diaphragm"], coordinates: { x: 0, y: 0.94, z: 0.02 }, mapPosition: { xPercent: 50, yPercent: 71 } },
  bronchial_tree: { shortName: "Bronchi", isolateMode: "submesh_focus", submeshKeywords: ["bronch", "hilum"], coordinates: { x: 0, y: 1.18, z: 0.02 }, mapPosition: { xPercent: 56, yPercent: 56 } },
  pharynx: { shortName: "Pharynx", proceduralType: "pharynx", coordinates: { x: 0, y: 1.62, z: 0.02 }, mapPosition: { xPercent: 50, yPercent: 32 } },
  brain: { shortName: "Cerebrum", coordinates: { x: 0, y: 1.90, z: 0.02 }, mapPosition: { xPercent: 50, yPercent: 17 } },
  cerebellum: { shortName: "Cerebellum", isolateMode: "submesh_focus", submeshKeywords: ["cerebell", "vermis", "floccul"], coordinates: { x: 0, y: 1.76, z: -0.08 }, mapPosition: { xPercent: 50, yPercent: 24 } },
  brainstem: { shortName: "Brainstem", isolateMode: "submesh_focus", submeshKeywords: ["pons", "medulla", "midbrain", "tegmentum", "collicul", "peduncle"], coordinates: { x: 0, y: 1.72, z: -0.04 }, mapPosition: { xPercent: 50, yPercent: 27 } },
  spinal_cord: { shortName: "Spinal Cord", isolateMode: "submesh_focus", submeshKeywords: ["vertebra", "atlas", "axis", "sacrum"], coordinates: { x: 0, y: 0.78, z: -0.10 }, mapPosition: { xPercent: 50, yPercent: 75 } },
  thalamus_hypothalamus: { shortName: "Thalamus", isolateMode: "submesh_focus", submeshKeywords: ["thalam", "hypothalam", "mamillary"], coordinates: { x: 0, y: 1.84, z: 0.0 }, mapPosition: { xPercent: 50, yPercent: 20 } },
  meninges: { shortName: "Meninges", coordinates: { x: 0, y: 1.90, z: 0.02 }, mapPosition: { xPercent: 50, yPercent: 16 } },
  liver: { shortName: "Liver", coordinates: { x: -0.12, y: 0.84, z: 0.04 }, mapPosition: { xPercent: 42, yPercent: 79 } },
  gallbladder: { shortName: "Gallbladder", proceduralType: "gallbladder", coordinates: { x: -0.08, y: 0.78, z: 0.10 }, mapPosition: { xPercent: 44, yPercent: 83 } },
  stomach: { shortName: "Stomach", proceduralType: "stomach", coordinates: { x: 0.10, y: 0.80, z: 0.06 }, mapPosition: { xPercent: 58, yPercent: 80 } },
  pancreas: { shortName: "Pancreas", coordinates: { x: 0.02, y: 0.70, z: 0.02 }, mapPosition: { xPercent: 52, yPercent: 85 } },
  small_intestine: { shortName: "Small Intestine", proceduralType: "small_intestine", standaloneModelUrl: null, modelUrl: null, coordinates: { x: 0.0, y: 0.50, z: 0.04 }, mapPosition: { xPercent: 50, yPercent: 95 } },
  large_intestine: { shortName: "Colon", coordinates: { x: 0.0, y: 0.45, z: 0.02 }, mapPosition: { xPercent: 41, yPercent: 96 } },
  appendix: { shortName: "Appendix", isolateMode: "submesh_focus", submeshKeywords: ["appendix", "cecum"], coordinates: { x: -0.16, y: 0.34, z: 0.08 }, mapPosition: { xPercent: 39, yPercent: 102 } },
  esophagus: { shortName: "Esophagus", proceduralType: "esophagus", coordinates: { x: 0, y: 1.12, z: -0.02 }, mapPosition: { xPercent: 50, yPercent: 52 } },
  kidneys: { shortName: "Kidneys", coordinates: { x: 0, y: 0.68, z: -0.06 }, mapPosition: { xPercent: 42, yPercent: 87 } },
  ureters: { shortName: "Ureters", standaloneModelUrl: "/7a0c4c6bd5d84f7daf5fcfc5d20516c9.glb", modelUrl: "/7a0c4c6bd5d84f7daf5fcfc5d20516c9.glb", coordinates: { x: 0, y: 0.42, z: -0.02 }, mapPosition: { xPercent: 45, yPercent: 96 } },
  bladder: { shortName: "Bladder", coordinates: { x: 0, y: 0.08, z: 0.08 }, mapPosition: { xPercent: 50, yPercent: 114 } },
  urethra: { shortName: "Urethra", isolateMode: "submesh_focus", submeshKeywords: ["neck", "trigone"], coordinates: { x: 0, y: 0.0, z: 0.06 }, mapPosition: { xPercent: 50, yPercent: 119 } },
  thyroid: { shortName: "Thyroid", proceduralType: "thyroid", coordinates: { x: 0, y: 1.46, z: 0.07 }, mapPosition: { xPercent: 50, yPercent: 38 } },
  parathyroid: { shortName: "Parathyroid", proceduralType: "parathyroid", coordinates: { x: 0, y: 1.46, z: 0.03 }, mapPosition: { xPercent: 52, yPercent: 38 } },
  adrenals: { shortName: "Adrenals", proceduralType: "adrenals", coordinates: { x: 0, y: 0.78, z: -0.06 }, mapPosition: { xPercent: 56, yPercent: 82 } },
  pituitary: { shortName: "Pituitary", proceduralType: "pituitary", coordinates: { x: 0, y: 1.80, z: 0.04 }, mapPosition: { xPercent: 50, yPercent: 21 } },
  thymus: { shortName: "Thymus", isolateMode: "submesh_focus", submeshKeywords: ["trachea", "upper"], coordinates: { x: 0, y: 1.24, z: 0.08 }, mapPosition: { xPercent: 50, yPercent: 49 } },
  skeleton: { shortName: "Skeleton", coordinates: { x: 0, y: 0.15, z: 0 }, mapPosition: { xPercent: 50, yPercent: 85 } },
  skull: { shortName: "Skull", coordinates: { x: 0, y: 1.85, z: 0.04 }, mapPosition: { xPercent: 50, yPercent: 20 } },
  spine: { shortName: "Spine", isolateMode: "submesh_focus", submeshKeywords: ["vertebra", "atlas", "axis", "sacrum", "coccyx"], coordinates: { x: 0, y: 0.80, z: -0.10 }, mapPosition: { xPercent: 50, yPercent: 78 } },
  ribcage: { shortName: "Ribcage", isolateMode: "submesh_focus", submeshKeywords: ["rib", "sternum"], coordinates: { x: 0, y: 1.12, z: 0.06 }, mapPosition: { xPercent: 44, yPercent: 62 } },
  pelvis_skeleton: { shortName: "Pelvis", isolateMode: "submesh_focus", submeshKeywords: ["hip", "pelv", "ilium", "ischium", "pubis", "sacrum"], coordinates: { x: 0, y: 0.16, z: 0 }, mapPosition: { xPercent: 43, yPercent: 110 } },
  muscles: { shortName: "Muscles", coordinates: { x: 0, y: 0.15, z: 0 }, mapPosition: { xPercent: 30, yPercent: 82 } },
  pectoralis_serratus: { shortName: "Pectorals", isolateMode: "submesh_focus", submeshKeywords: ["pectoral", "serratus"], coordinates: { x: 0, y: 1.14, z: 0.12 }, mapPosition: { xPercent: 60, yPercent: 58 } },
  abdominal_wall: { shortName: "Abdominals", isolateMode: "submesh_focus", submeshKeywords: ["abdomin", "oblique", "rectus"], coordinates: { x: 0, y: 0.56, z: 0.14 }, mapPosition: { xPercent: 50, yPercent: 90 } },
  eyes: { shortName: "Eyes", coordinates: { x: 0, y: 1.84, z: 0.18 }, mapPosition: { xPercent: 50, yPercent: 18 } },
  ears: { shortName: "Ears", proceduralType: "ears", coordinates: { x: 0.16, y: 1.80, z: 0 }, mapPosition: { xPercent: 60, yPercent: 21 } },
  tongue: { shortName: "Tongue", proceduralType: "tongue", coordinates: { x: 0, y: 1.68, z: 0.12 }, mapPosition: { xPercent: 50, yPercent: 27 } },
  uterus: { shortName: "Uterus", coordinates: { x: 0, y: 0.12, z: -0.04 }, mapPosition: { xPercent: 50, yPercent: 112 } },
  ovaries: { shortName: "Ovaries", proceduralType: "ovaries", coordinates: { x: 0.10, y: 0.12, z: -0.02 }, mapPosition: { xPercent: 43, yPercent: 111 } },
  fallopian_tubes: { shortName: "Fallopian Tubes", proceduralType: "fallopian_tubes", coordinates: { x: -0.10, y: 0.14, z: -0.02 }, mapPosition: { xPercent: 57, yPercent: 110 } },
  cervix_vagina: { shortName: "Cervix", isolateMode: "submesh_focus", submeshKeywords: ["cervix", "cervical"], coordinates: { x: 0, y: 0.04, z: -0.03 }, mapPosition: { xPercent: 50, yPercent: 118 } },
  testes: { shortName: "Testes", proceduralType: "testes", coordinates: { x: 0, y: -0.08, z: 0.08 }, mapPosition: { xPercent: 50, yPercent: 125 } },
  prostate: { shortName: "Prostate", proceduralType: "prostate", coordinates: { x: 0, y: 0.02, z: 0.04 }, mapPosition: { xPercent: 50, yPercent: 117 } },
  vas_deferens: { shortName: "Vas Deferens", proceduralType: "vas_deferens", coordinates: { x: 0.05, y: 0.0, z: 0.06 }, mapPosition: { xPercent: 46, yPercent: 121 } },
  penis: { shortName: "Genitalia", proceduralType: "penis", coordinates: { x: 0, y: -0.06, z: 0.10 }, mapPosition: { xPercent: 50, yPercent: 124 } },
};

Object.entries(ORGAN_CALIBRATION).forEach(([id, cal]) => {
  if (ORGANS[id]) {
    Object.assign(ORGANS[id], cal);
    if (typeof ORGANS[id].nerveSupply === "string") {
      ORGANS[id].nerveSupply = ORGANS[id].nerveSupply.replace(/autonomic autonomic/gi, "autonomic");
    }
  }
});

export const ALL_HUMAN_ORGANS = Object.values(ORGANS);

/**
 * AI Anatomy Intelligence Assistant Response Engine
 */
export function queryAnatomyAI(userInput) {
  if (!userInput || !userInput.trim()) {
    return {
      text: 'I am your AI Anatomy Medical Assistant. Ask me any question about human body systems, organ locations, physiological functions, or pathologies.',
      action: null,
    };
  }

  const q = userInput.toLowerCase();

  // 1. HEART / CIRCULATORY
  if (q.includes('heart') || q.includes('cardiac') || q.includes('aorta') || q.includes('circulation') || q.includes('pulse')) {
    if (q.includes('where') || q.includes('located') || q.includes('location')) {
      return {
        text: 'The heart is located in the middle mediastinum of the thoracic cavity, situated between the two lungs, posterior to the sternum and costal cartilages (T5–T8). Approximately two-thirds of its mass lies to the left of the midsagittal plane.',
        action: { type: 'FOCUS_ORGAN', organId: 'heart', layer: 'circulatory' },
      };
    }
    return {
      text: 'The human heart is a 4-chambered muscular organ (left/right atria and ventricles) contracting roughly 100,000 times daily to pump ~7,200 liters of blood through your circulatory system.',
      action: { type: 'FOCUS_ORGAN', organId: 'heart', layer: 'circulatory' },
    };
  }

  // 2. BRAIN / NERVOUS
  if (q.includes('brain') || q.includes('nervous') || q.includes('spinal cord') || q.includes('cerebrum') || q.includes('head') || q.includes('cortex')) {
    return {
      text: 'The brain contains approximately 86 billion neurons responsible for cognition, memory, voluntary motion, and homeostatic regulation. It consumes about 20% of your total oxygen and glucose.',
      action: { type: 'FOCUS_ORGAN', organId: 'brain', layer: 'nervous' },
    };
  }

  // 3. LUNGS / RESPIRATORY
  if (q.includes('lung') || q.includes('respiratory') || q.includes('breath') || q.includes('trachea') || q.includes('oxygen')) {
    return {
      text: 'The lungs facilitate vital gas exchange across ~300 million microscopic alveoli, supplying oxygen to red blood cell hemoglobin while extracting carbon dioxide from venous blood.',
      action: { type: 'FOCUS_ORGAN', organId: 'lungs', layer: 'respiratory' },
    };
  }

  // 4. LIVER
  if (q.includes('liver') || q.includes('hepatic') || q.includes('bile') || q.includes('gallbladder')) {
    return {
      text: 'The liver is the heaviest internal organ (~1.5 kg). It detoxifies metabolic waste and drugs, manufactures blood clotting proteins, processes cholesterol, and continuously produces bile stored in the gallbladder.',
      action: { type: 'FOCUS_ORGAN', organId: 'liver', layer: 'digestive' },
    };
  }

  // 5. KIDNEYS / RENAL
  if (q.includes('kidney') || q.includes('renal') || q.includes('urine') || q.includes('nephron')) {
    return {
      text: 'The kidneys filter approximately 180 liters of blood ultrafiltrate daily to remove urea, creatinine, and toxins, balancing water, electrolytes, and secreting hormones like renin and erythropoietin.',
      action: { type: 'FOCUS_ORGAN', organId: 'kidneys', layer: 'urinary' },
    };
  }

  // 6. SKELETON
  if (q.includes('skeleton') || q.includes('bone') || q.includes('skull') || q.includes('spine') || q.includes('pelvis') || q.includes('rib')) {
    return {
      text: 'The adult human skeleton consists of 206 articulated bones. It provides internal mechanical support, protects fragile internal organs, stores calcium, and manufactures blood cells in bone marrow.',
      action: { type: 'FOCUS_ORGAN', organId: 'skeleton', layer: 'skeletal' },
    };
  }

  // GENERAL
  return {
    text: `Based on human clinical anatomy: "${userInput}" relates to our interactive 3D model. You can click any organ to inspect its high-resolution 3D anatomy, or use the dismantle slider to explore internal structures.`,
    action: null,
  };
}

/**
 * Educational Quiz Bank
 */
export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Which vital muscular organ is located in the middle mediastinum and pumps blood through systemic circulation?',
    targetOrganId: 'heart',
    options: ['Heart', 'Brain', 'Liver', 'Kidneys'],
    correctAnswer: 'Heart',
    hint: 'Located in the thoracic cavity between both lungs.',
    explanation: 'The heart sits in the middle mediastinum (T5-T8) and pumps ~5 Liters of blood per minute through the arterial system.',
  },
  {
    id: 'q2',
    question: 'Identify the largest visceral organ in the right hypochondrium responsible for detoxifying metabolic waste and producing bile.',
    targetOrganId: 'liver',
    options: ['Pancreas', 'Liver', 'Spleen', 'Stomach'],
    correctAnswer: 'Liver',
    hint: 'Located in the upper right abdomen beneath the diaphragm.',
    explanation: 'The liver weighs ~1.5 kg and performs over 500 metabolic functions, including bile synthesis and glycogen storage.',
  },
  {
    id: 'q3',
    question: 'Which paired retroperitoneal organs filter ~180 Liters of blood ultrafiltrate daily to maintain electrolyte balance and generate urine?',
    targetOrganId: 'kidneys',
    options: ['Lungs', 'Adrenals', 'Kidneys', 'Bladder'],
    correctAnswer: 'Kidneys',
    hint: 'Located in the posterior abdominal wall at T12-L3.',
    explanation: 'The bilateral kidneys contain nephrons that filter waste while reabsorbing 99% of filtered fluid and electrolytes.',
  }
];

/**
 * Authoritative medical metadata resolver for ANY mesh or anatomical part.
 */
export function getAnatomicalDataForPart(partIdOrName, meshObject = null) {
  if (!partIdOrName) return null;
  const raw = String(partIdOrName);
  const lower = raw.toLowerCase().trim();

  // 1. Direct match in ORGANS dictionary
  if (ORGANS[raw]) return ORGANS[raw];
  if (ORGANS[lower]) return ORGANS[lower];

  for (const [, org] of Object.entries(ORGANS)) {
    if (org.id === lower || org.id === raw) return org;
  }
  for (const [, org] of Object.entries(ORGANS)) {
    if (org.meshNames && org.meshNames.some((m) => lower.includes(m.toLowerCase()))) {
      return org;
    }
  }

  // 2. Computed coordinates fallback calibrated to SVG viewBox 100x200
  let coords = { x: 0, y: 1.0, z: 0.1 };
  if (meshObject && meshObject.position) {
    coords = {
      x: +(meshObject.position.x || 0).toFixed(2),
      y: +(meshObject.position.y || 1.0).toFixed(2),
      z: +(meshObject.position.z || 0.1).toFixed(2),
    };
  }

  const xPercent = Math.max(16, Math.min(84, Math.round(50 + (coords.x / 0.85) * 30)));
  const yPercent = Math.max(14, Math.min(188, Math.round(104 - (coords.y / 2.05) * 86)));

  // 3. Fallback generic anatomical part
  return {
    id: raw,
    name: raw.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    latinName: 'Structura anatomica',
    systemId: 'skeletal',
    systemName: 'Anatomical Framework',
    cavity: 'Somatic Body Frame',
    vertebralLevel: 'Axial Column',
    dimensions: 'Standard Adult Anatomical Scale',
    coordinates: coords,
    mapPosition: { xPercent, yPercent },
    function: 'Integral anatomical structure of the human musculoskeletal and organ systems.',
    physiology: 'Contributes to biological integrity, physiological stability, and biomechanical posture.',
    bloodSupply: 'Regional arterial and microvascular perfusion network.',
    nerveSupply: 'Peripheral and somatic innervation.',
    clinicalNotes: 'Evaluated via CT, MRI, ultrasound, or direct physical examination.',
    standaloneModelUrl: '/bodyparts3d-skeleton.glb',
    hotspots: []
  };
}
