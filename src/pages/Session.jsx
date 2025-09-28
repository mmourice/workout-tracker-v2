// src/pages/Session.jsx
import React, { useState } from "react";
import RestTimer from "../components/RestTimer.jsx";

/**
 * Simple local state version of the Session page.
 * - Two-column inputs (kg / reps)
 * - Minimal "open timer" icon button in the header
 * - Add / remove sets
 * - No external store required
 */

export default function Session() {
  // sets = [{ weight: "", reps: "" }, ...]
  const [sets, setSets] = useState([
    { weight: "", reps: "" },
    { weight: "", reps: "" },
  ]);

  const [timerOpen, setTimerOpen] = useState(false);

  const addSet = () => setSets((s) => [...s, { weight: "", reps: "" }]);
  const removeSet = (idx) =>
    setSets((s) => s.filter((_, i) => i !== idx));
  const updateSet = (idx, patch) =>
    setSets((s) => s.map((set, i) => (i === idx ? { ...set, ...patch } : set)));

  return (
    <div className="page">
      <h1 className="page-title">Session</h1>

      {/* Current Exercise card */}
      <section className="card">
        <header className="card-header" style={{ display: "flex", alignItems: "center" }}>
          <h2 className="card-title">Current Exercise</h2>

          {/* icon-only button to open the timer */}
          <div className="tools">
            <button
              className="icon-btn brand"
              onClick={() => setTimerOpen(true)}
              aria-label="Open rest timer"
              title="Rest timer"
            >
              {/* stopwatch icon (inline SVG; no extra import) */}
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 2h6" />
                <path d="M12 2v2" />
                <circle cx="12" cy="14" r="8" />
                <path d="M12 14l3-3" />
              </svg>
            </button>
          </div>
        </header>

        <div className="card-body" style={{ display: "grid", gap: 16 }}>
          {sets.map((set, idx) => (
            <div key={idx} className="set-card">
              {/* remove X (no circular background) */}
              <button
                className="icon-btn danger set-remove"
                onClick={() => removeSet(idx)}
                aria-label={`Delete set ${idx + 1}`}
                title="Delete set"
              >
                ×
              </button>

              <div className="set-title">Set {idx + 1}</div>

              <div className="set-fields">
                <input
                  className="input"
                  inputMode="decimal"
                  placeholder="kg"
                  value={set.weight}
                  onChange={(e) => updateSet(idx, { weight: e.target.value })}
                />
                <input
                  className="input"
                  inputMode="numeric"
                  placeholder="reps"
                  value={set.reps}
                  onChange={(e) => updateSet(idx, { reps: e.target.value })}
                />
              </div>
            </div>
          ))}

          <div>
            <button className="btn-primary" onClick={addSet}>+ Add set</button>
          </div>
        </div>
      </section>

      {/* Rest timer modal */}
      {timerOpen && (
        <RestTimer
          initialSeconds={90}
          onClose={() => setTimerOpen(false)}
          // optional callbacks
          onDone={() => setTimerOpen(false)}
        />
      )}
    </div>
  );
}
