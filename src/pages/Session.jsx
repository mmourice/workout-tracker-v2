// src/pages/Session.jsx
import React, { useState } from "react";
import RestTimer from "../components/RestTimer.jsx";

export default function Session() {
  const [sets, setSets] = useState([
    { weight: "", reps: "" },
    { weight: "", reps: "" },
  ]);
  const [timerOpen, setTimerOpen] = useState(false);

  const addSet = () => setSets((s) => [...s, { weight: "", reps: "" }]);
  const removeSet = (idx) => setSets((s) => s.filter((_, i) => i !== idx));
  const updateSet = (idx, patch) =>
    setSets((s) => s.map((set, i) => (i === idx ? { ...set, ...patch } : set)));

  return (
    <div className="page">
      <h1 className="page-title">Session</h1>

      <section className="card session-card">
        <header className="card-header timer-header">
          <h2 className="card-title">Current Exercise</h2>

          {/* absolutely-positioned timer icon to guarantee clicks */}
          <button
            className="timer-ghost"
            aria-label="Open rest timer"
            title="Rest timer"
            onClick={() => setTimerOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
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
        </header>

        <div className="card-body" style={{ display: "grid", gap: 16 }}>
          {sets.map((set, idx) => (
            <div key={idx} className="set-card">
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

          {/* footer with a nicer, full-width pill button */}
          <div className="set-footer">
            <button className="btn-primary btn-lg btn-block" onClick={addSet}>
              + Add set
            </button>
          </div>
        </div>
      </section>

      {timerOpen && (
        <RestTimer
          initialSeconds={90}
          onClose={() => setTimerOpen(false)}
          onDone={() => setTimerOpen(false)}
        />
      )}
    </div>
  );
}
