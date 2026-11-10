import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./BioOpeningSequence.css";

const TOTAL_DURATION = 1900; // 1.9s synthesis calibration
const SHUTTER_TRANSITION_MS = 780; // 0.78s criss-cross diagonal aperture parting

const PHASES = [
  { id: 1, label: "GENOME", text: "PHASE 01 // GENOMIC SYNTHESIS & CHROMOSOMAL DECODING" },
  { id: 2, label: "NEURAL", text: "PHASE 02 // NEURAL SYNAPSE NETWORK ARCHITECTURE" },
  { id: 3, label: "VASCULAR", text: "PHASE 03 // VASCULAR HEMODYNAMIC CARDIO-PULMONARY AWAKENING" },
  { id: 4, label: "SKELETON", text: "PHASE 04 // 3D MUSCULOSKELETAL VOLUMETRIC SYNTHESIS" },
  { id: 5, label: "UNSEAL", text: "PHASE 05 // DECOMPRESSION CHAMBER UNSEALED · REVEALING SPECIMEN" },
];

export default function BioOpeningSequence({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const audioCtxRef = useRef(null);
  const droneOscRef = useRef(null);
  const droneGainRef = useRef(null);
  const lastHeartbeatRef = useRef(0);
  const lastChirpPhaseRef = useRef(-1);
  const spokenPhasesRef = useRef(new Set());

  // Intro Voice Synthesizer (Voice ON on intro by default)
  const speakIntroVoice = useCallback((text) => {
    if (!audioEnabled || !window.speechSynthesis) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.pitch = 0.95;
      utter.volume = 0.9;
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore
    }
  }, [audioEnabled]);

  // Initialize or get Web Audio Context safely only after user gesture to prevent autoplay warnings
  const getAudioContext = useCallback((requireGesture = true) => {
    const activated =
      typeof navigator !== "undefined" &&
      (navigator.userActivation?.hasBeenActive || navigator.userActivation?.isActive);
    if (requireGesture && !audioCtxRef.current && !activated) {
      return null;
    }
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return null;
      }
    }
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }, []);

  useEffect(() => {
    const handleGesture = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
    };
    window.addEventListener("pointerdown", handleGesture, { once: true });
    window.addEventListener("keydown", handleGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, []);

  // Sci-fi Sub-Bass Drone Hum
  const startDrone = useCallback(() => {
    try {
      const ctx = getAudioContext(true);
      if (!ctx || droneOscRef.current) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A1 sub-bass

      // Lowpass filter to make it a deep rumble
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(120, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      droneOscRef.current = osc;
      droneGainRef.current = gain;
    } catch {
      // Audio autoplay fallback
    }
  }, [getAudioContext]);

  const stopDrone = useCallback(() => {
    try {
      if (droneGainRef.current && audioCtxRef.current) {
        droneGainRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.6);
        setTimeout(() => {
          droneOscRef.current?.stop();
          droneOscRef.current = null;
          droneGainRef.current = null;
        }, 700);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Heartbeat "Lub-Dub" Pulse
  const playHeartbeat = useCallback(() => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      // "Lub" (lower thud)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(75, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.12);
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.15);

      // "Dub" (slightly higher, 140ms later)
      setTimeout(() => {
        if (!audioCtxRef.current) return;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(95, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.1);
        gain2.gain.setValueAtTime(0.09, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.13);
      }, 140);
    } catch {
      // Ignore
    }
  }, [audioEnabled, getAudioContext]);

  // Telemetry Chirp Ping
  const playTelemetryChirp = useCallback((freq = 780) => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {
      // Ignore
    }
  }, [audioEnabled, getAudioContext]);

  // Aperture Hydraulic Decompression Sound
  const playDecompressionAperture = useCallback(() => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      // White noise buffer for pneumatic hiss
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.2);
      filter.Q.value = 3.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      // Majestic ascending harmonic chime
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
        g.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 1.2);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 1.3);
      });
    } catch {
      // Ignore
    }
  }, [audioEnabled, getAudioContext]);

  // Main Progression Loop (6.0s sequence)
  useEffect(() => {
    const startTime = performance.now();

    // Auto-start ambient drone & intro voice (Voice ON by default on the intro)
    if (audioEnabled) {
      startDrone();
      if (!spokenPhasesRef.current.has(0)) {
        spokenPhasesRef.current.add(0);
        speakIntroVoice("Initializing 3D Human Anatomy Simulator.");
      }
    }

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / TOTAL_DURATION);

      setProgress(p);
      setElapsedMs(Math.round(elapsed));

      // Phase calculation
      const phaseIdx = Math.min(PHASES.length - 1, Math.floor((elapsed / TOTAL_DURATION) * PHASES.length));
      setActivePhaseIndex(phaseIdx);

      // Play chirp on phase step
      if (phaseIdx !== lastChirpPhaseRef.current) {
        lastChirpPhaseRef.current = phaseIdx;
        playTelemetryChirp(620 + phaseIdx * 90);
      }

      // Heartbeat pulse every 420ms
      if (now - lastHeartbeatRef.current > 420) {
        lastHeartbeatRef.current = now;
        playHeartbeat();
      }

      // Sequence Completion Trigger: Begin slow majestic unsealing
      if (p >= 1) {
        clearInterval(interval);
        playDecompressionAperture();
        stopDrone();
        if (audioEnabled && !spokenPhasesRef.current.has(5)) {
          spokenPhasesRef.current.add(5);
          speakIntroVoice("Decompression chamber unsealed. Specimen online.");
        }
        setIsOpening(true);

        setTimeout(() => {
          if (onComplete) onComplete();
        }, SHUTTER_TRANSITION_MS);
      }
    }, 20);

    // Keyboard Skip Handler (ESC / Space / Enter)
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        clearInterval(interval);
        playDecompressionAperture();
        stopDrone();
        window.speechSynthesis?.cancel();
        setIsOpening(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 200); // Fast skip
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      stopDrone();
      window.speechSynthesis?.cancel(); // Cancel any intro speech so it does not leak into inner views
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [audioEnabled, onComplete, playHeartbeat, playTelemetryChirp, playDecompressionAperture, stopDrone, speakIntroVoice, startDrone]);

  // Handle Audio Toggle
  const handleToggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    if (nextState) {
      startDrone();
      playTelemetryChirp(700);
      speakIntroVoice("Intro audio enabled.");
    } else {
      stopDrone();
      window.speechSynthesis?.cancel();
    }
  };

  const handleSkip = () => {
    playDecompressionAperture();
    stopDrone();
    window.speechSynthesis?.cancel();
    setIsOpening(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 200);
  };

  // Formatted countdown timer: 00:06.00s down to 00:00.00s
  const remainingSeconds = Math.max(0, (TOTAL_DURATION - elapsedMs) / 1000).toFixed(2);
  const elapsedFormatted = (elapsedMs / 1000).toFixed(2);

  // Floating Bioluminescent Atmosphere Particles
  const bioParticles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: (10 + (i * 27) % 80).toFixed(1),
      y: (15 + (i * 37) % 70).toFixed(1),
      size: (3 + (i % 4) * 2),
      delay: (i * 0.35).toFixed(2),
      dur: (4.5 + (i % 3) * 1.5).toFixed(1),
    }));
  }, []);

  // 3D DNA Helix Rungs
  const dnaPairs = useMemo(() => Array.from({ length: 18 }).map((_, i) => i), []);

  const currentPhase = PHASES[activePhaseIndex] || PHASES[0];

  return (
    <div
      className={`bio-intro-root ${isOpening ? "opening-shutter-active" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Anatomy Simulator Cinematic Aperture Initialization"
    >
      {/* 4 Majestic Diagonal Hydraulic Shutter Blades */}
      <div className="shutter-leaf shutter-top-left">
        <div className="shutter-engraved-grid" />
        <div className="shutter-edge-glow" />
      </div>
      <div className="shutter-leaf shutter-top-right">
        <div className="shutter-engraved-grid" />
        <div className="shutter-edge-glow" />
      </div>
      <div className="shutter-leaf shutter-bottom-right">
        <div className="shutter-engraved-grid" />
        <div className="shutter-edge-glow" />
      </div>
      <div className="shutter-leaf shutter-bottom-left">
        <div className="shutter-engraved-grid" />
        <div className="shutter-edge-glow" />
      </div>

      {/* Volumetric Center Light Burst (Beams through parting doors) */}
      <div className="center-light-burst" aria-hidden="true" />

      {/* Criss-Cross High-Energy Laser Beams */}
      <div className="crisscross-beam beam-diagonal-1">
        <div className="beam-spark-tracer" />
      </div>
      <div className="crisscross-beam beam-diagonal-2">
        <div className="beam-spark-tracer delay" />
      </div>

      {/* Floating Bioluminescent Particle Nebula */}
      <div className="bio-particle-nebula" aria-hidden="true">
        {bioParticles.map((pt) => (
          <div
            key={pt.id}
            className="bio-particle-orb"
            style={{
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              width: `${pt.size}px`,
              height: `${pt.size}px`,
              animationDelay: `${pt.delay}s`,
              animationDuration: `${pt.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Intro Main Content Layer */}
      <div className={`bio-intro-content ${isOpening ? "content-fade-out" : ""}`}>
        {/* Top Clinical Header Bar */}
        <header className="intro-header-bar">
          <div className="intro-brand-chip">
            <span className="pulsing-beacon-dot" />
            <div className="intro-title-group">
              <span className="intro-brand-title">HUMAN BODY ATLAS</span>
              <span className="intro-brand-sub">ADVANCED 3D BIOLOGICAL SIMULATOR &middot; CLINICAL CORE v2.5</span>
            </div>
          </div>

          <div className="intro-actions-top">
            <button
              className={`intro-sound-toggle ${audioEnabled ? "active" : ""}`}
              onClick={handleToggleAudio}
              title={audioEnabled ? "Mute audio diagnostics" : "Enable immersive clinical audio synthesizer"}
            >
              <span className="sound-wave-icon" aria-hidden="true">
                <span className="bar b1" />
                <span className="bar b2" />
                <span className="bar b3" />
              </span>
              <span>{audioEnabled ? "AUDIO ON (IMMERSIVE)" : "UNMUTE AUDIO"}</span>
            </button>

            <button
              className="intro-skip-btn"
              onClick={handleSkip}
              title="Fast-forward and enter simulator immediately (Space / Esc)"
            >
              <span>ENTER SIMULATOR</span>
              <kbd className="skip-kbd">ESC</kbd>
            </button>
          </div>
        </header>

        {/* Centerpiece: The Fantastic Anatomical Specimen Chamber */}
        <main className="intro-center-stage">
          {/* Calibrated Concentric Gyro Reticles */}
          <div className="specimen-portal-container">
            {/* Degree scale ring (360° medical azimuth) */}
            <div className="reticle-ring ring-azimuth" />
            <div className="reticle-ring ring-ticks" />
            <div className="reticle-ring ring-mid-brackets" />
            <div className="reticle-crosshair crosshair-h" />
            <div className="reticle-crosshair crosshair-v" />
            <div className="reticle-scanning-beam" />

            {/* Glowing Holographic Human Specimen Silhouette Preview */}
            <div className="specimen-silhouette-wrap" aria-hidden="true">
              <svg className="specimen-hologram-svg" viewBox="0 0 100 220" fill="none">
                {/* Cranium / Head */}
                <ellipse cx="50" cy="22" rx="14" ry="17" stroke="#f3c978" strokeWidth="1.2" opacity="0.9" />
                <circle cx="50" cy="22" r="6" fill="rgba(229, 184, 105, 0.25)" />
                <line x1="50" y1="39" x2="50" y2="46" stroke="#f3c978" strokeWidth="2.2" opacity="0.9" />

                {/* Torso & Ribcage Arcs */}
                <path d="M32 46 C32 46, 50 48, 68 46 L74 95 C74 105, 62 118, 50 118 C38 118, 26 105, 26 95 Z" stroke="#e5b869" strokeWidth="1.25" opacity="0.82" />
                <path d="M36 58 Q50 63 64 58" stroke="#f5f5f4" strokeWidth="1.2" opacity="0.65" />
                <path d="M34 68 Q50 74 66 68" stroke="#f5f5f4" strokeWidth="1.2" opacity="0.65" />
                <path d="M33 78 Q50 85 67 78" stroke="#f5f5f4" strokeWidth="1.2" opacity="0.65" />
                <path d="M35 88 Q50 94 65 88" stroke="#f5f5f4" strokeWidth="1.2" opacity="0.65" />

                {/* Pulsing Anatomical Heart Node */}
                <circle className="hologram-pulsing-heart" cx="54" cy="68" r="6.5" fill="#f3c978" />
                <circle className="hologram-heart-ring" cx="54" cy="68" r="12" stroke="#e5b869" strokeWidth="1.2" />

                {/* Pelvis */}
                <path d="M30 118 Q50 125 70 118 L67 136 Q50 142 33 136 Z" stroke="#e5b869" strokeWidth="1.25" opacity="0.82" />

                {/* Arms */}
                <path d="M28 48 L17 92 L12 135" stroke="#ffffff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />
                <path d="M72 48 L83 92 L88 135" stroke="#ffffff" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />

                {/* Legs */}
                <path d="M40 138 L38 178 L37 215" stroke="#ffffff" strokeWidth="1.6" opacity="0.75" strokeLinecap="round" />
                <path d="M60 138 L62 178 L63 215" stroke="#ffffff" strokeWidth="1.6" opacity="0.75" strokeLinecap="round" />

                {/* Vertebral Column Centerline */}
                <line x1="50" y1="46" x2="50" y2="128" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.9" />
              </svg>
            </div>

            {/* 3D Rotating DNA Double-Helix Strand */}
            <div className="dna-helix-container" aria-hidden="true">
              {dnaPairs.map((idx) => {
                const delay = (idx * 0.12).toFixed(2);
                return (
                  <div
                    key={idx}
                    className="dna-rung"
                    style={{
                      animationDelay: `${delay}s`,
                      transform: `translateY(${(idx - 9) * 14}px)`,
                    }}
                  >
                    <div className="dna-node node-left" />
                    <div className="dna-connector" />
                    <div className="dna-node node-right" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Telemetry & Countdown Timer */}
          <div className="intro-core-badge">
            <div className="core-ecg-ring">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="core-timer-readout">
              <span className="timer-label">CHAMBER DECOMPRESSION IN</span>
              <span className="timer-digits">00:0{remainingSeconds}s</span>
            </div>
          </div>
        </main>

        {/* Bottom Clinical HUD: Phase Steps, Telemetry & Progress */}
        <footer className="intro-footer-hud">
          {/* Phase Sequence Pills */}
          <div className="intro-phase-steps-strip">
            {PHASES.map((ph, idx) => {
              const isPast = activePhaseIndex > idx;
              const isCurrent = activePhaseIndex === idx;
              return (
                <div
                  key={ph.id}
                  className={`phase-step-pill ${isCurrent ? "current" : isPast ? "completed" : "pending"}`}
                >
                  <span className="phase-num">0{ph.id}</span>
                  <span className="phase-lbl">{ph.label}</span>
                  {isPast && <span className="phase-check">✓</span>}
                  {isCurrent && <span className="phase-live-pulse" />}
                </div>
              );
            })}
          </div>

          {/* Diagnostic Status Message */}
          <div className="intro-status-banner">
            <span className="status-live-text">{currentPhase.text}</span>
            <span className="status-percent">{Math.round(progress * 100)}%</span>
          </div>

          {/* Glowing Multi-Segment Progress Track */}
          <div className="intro-progress-bar-wrap">
            <div
              className="intro-progress-fill"
              style={{ width: `${(progress * 100).toFixed(1)}%` }}
            />
            <div
              className="intro-progress-scanner-lead"
              style={{ left: `${(progress * 100).toFixed(1)}%` }}
            />
          </div>

          {/* Biometric Telemetry Strip */}
          <div className="intro-vitals-strip">
            <div className="vital-item">
              <span className="vital-name">HEART RATE</span>
              <span className="vital-val">73 BPM &middot; SINUS</span>
            </div>
            <div className="vital-item">
              <span className="vital-name">ARTERIAL PERFUSION</span>
              <span className="vital-val">4.9 L/MIN</span>
            </div>
            <div className="vital-item">
              <span className="vital-name">SPO2 BLOOD GAS</span>
              <span className="vital-val">99.2%</span>
            </div>
            <div className="vital-item">
              <span className="vital-name">CORE TEMPERATURE</span>
              <span className="vital-val">37.0°C</span>
            </div>
            <div className="vital-item">
              <span className="vital-name">TOMOGRAPHY GRID</span>
              <span className="vital-val">4096×4096 HD</span>
            </div>
            <div className="vital-item">
              <span className="vital-name">TIME ELAPSED</span>
              <span className="vital-val">00:{elapsedFormatted}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
