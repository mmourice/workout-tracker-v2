// src/pages/Session.jsx
import React, { useEffect, useRef, useState } from "react";

/* ---------- Inline Minimal Rest Timer (no external import) ---------- */
function RestTimerInline({ open, onClose, startSeconds = 90 }) {
  const [secs, setSecs] = useState(startSeconds);
  const [running, setRunning] = useState(true);
  const raf = useRef(null);
  const last = useRef(null);

  useEffect(() => {
    if (!open) return;
    setSecs(startSeconds);
    setRunning(true);
  }, [open, startSeconds]);

  useEffect(() => {
    if (!open || !running) return;
    const tick = (t) => {
      if (!last.current) last.current = t;
      const dt = (t - last.current) / 1000;
      last.current = t;
      setSecs((s) => Math.max(0, s - dt));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [open, running]);

  if (!open) return null;

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(Math.floor(secs % 60)).padStart(2, "0");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Rest Time</h3>
          <button className="icon-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="timer-face">
          <div className="timer-circle" />
          <div className="timer-value">{mm}:{ss}</div>
        </div>

        <div className="timer-actions">
          <button onClick={() => setSecs((s) => Math.max(0, s - 30))}>−30</button>
          <button className="pause" onClick={() => setRunning((r) => !r)}>
            {running ? "Pause" : "Resume"}
          </button>
          <button onClick={() => setSecs((s) => s + 30)}>+30</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Session Page (single column UI you liked) ---------- */
function makeSet(id) { return { id, kg: "", reps: "" }; }

export default function Session() {
  const [sets, setSets] = useState([makeSet(1), makeSet(2), makeSet(3)]);
  const [showTimer, setShowTimer] = useState(false);

  // Optional: persist sets so refresh doesn’t wipe
  useEffect(() => {
    try {
      const raw = localStorage.getItem("session_sets");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSets(parsed);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("session_sets", JSON.stringify(sets)); } catch {}
  }, [sets]);

  const  = () =>
    setSets((s) => [...s, makeSet(s.length ? s[s.length - 1].id + 1 : 1)]);
  const removeSet = (id) => setSets((s) => s.filter((x) => x.id !== id));
  const updateSet = (id, field, value) =>
    setSets((s) => s.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const saveSession = () => {
  const entry = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    dateISO: new Date().toISOString(),
    exerciseName: "Current Exercise", // later: replace with actual selected exercise
    sets: sets.map(s => ({ kg: s.kg || "0", reps: s.reps || "0" })),
  };

  try {
    const raw = localStorage.getItem("wt_logs");
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(entry);
    localStorage.setItem("wt_logs", JSON.stringify(arr));
    alert("Session saved ✔"); // later: replace with toast
  } catch (e) {
    alert("Could not save session.");
    console.error(e);
  }
};

  return (
    <div className="page">
      <h1 className="title">Session</h1>

      <section className="card session-card" style={{ position: "relative" }}>
        {/* Header */}
        <div className="card-head" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <h2 className="card-title" style={{ margin:0 }}>Current Exercise</h2>

          {/* Stopwatch as a plain button; big hit area */}
          <button
            className="timer-btn"
            aria-label="Open rest timer"
            onClick={() => setShowTimer(true)}
            title="Rest timer"
          >
            {/* inline icon (no external import) */}
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2h6" />
              <path d="M12 2v2" />
              <circle cx="12" cy="14" r="8" />
              <path d="M12 14l3-3" />
            </svg>
          </button>
        </div>

        {/* Sets (single column) */}
        <div className="sets-col">
          {sets.map((s) => (
            <div key={s.id} className="set-card">
              <div className="set-head">
                <span className="set-title">Set {s.id}</span>
                <button className="icon-x" aria-label={`Remove set ${s.id}`} onClick={() => removeSet(s.id)}>×</button>
              </div>

              <div className="fields">
                <input
                  className="input"
                  inputMode="decimal"
                  placeholder="kg"
                  value={s.kg}
                  onChange={(e) => updateSet(s.id, "kg", e.target.value)}
                />
                <input
                  className="input"
                  inputMode="numeric"
                  placeholder="reps"
                  value={s.reps}
                  onChange={(e) => updateSet(s.id, "reps", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="cta add-set" onClick={}>+ Add set</button>

<div className="mt-8" />
<button className="btn-primary wide" onClick={saveSession}>
  Save Session
</button>
      </section>

      {/* Inline modal (no external file) */}
      <RestTimerInline open={showTimer} onClose={() => setShowTimer(false)} startSeconds={90} />
    </div>
  );
}
