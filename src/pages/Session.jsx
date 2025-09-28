import React, { useState } from "react";
import RestTimer from "../components/RestTimer.jsx";
import { StopwatchIcon } from "../Icons.jsx";

export default function Session() {
  const [sets, setSets] = useState([
    { w: "", r: "" },
    { w: "", r: "" },
  ]);
  const [timerOpen, setTimerOpen] = useState(false);

  const addSet = () => setSets((s) => [...s, { w: "", r: "" }]);
  const removeSet = (idx) => setSets((s) => s.filter((_, i) => i !== idx));
  const change = (idx, key, val) =>
    setSets((s) => s.map((it, i) => (i === idx ? { ...it, [key]: val.replace(/[^\d.]/g, "") } : it)));

  return (
    <div className="container">
      <h1 className="page-title">Session</h1>

      <section className="card session-card">
        <div className="card-row between">
          <div className="card-title">Current Exercise</div>

          <button className="icon-chip" onClick={() => setTimerOpen(true)} aria-label="Open rest timer">
            <StopwatchIcon />
            <span>Timer</span>
          </button>
        </div>

        <div className="sets-grid">
          {sets.map((s, i) => (
            {/* --- set card --- */}
<div className="set-card">
  <button
    className="icon-btn danger set-remove"
    onClick={() => removeSet(idx)}
    aria-label={`Delete set ${idx + 1}`}
  >
    ×
  </button>

  <div className="set-title">Set {idx + 1}</div>

  {/* two inputs side-by-side */}
  <div className="set-fields">
    <input
      className="input"
      inputMode="decimal"
      placeholder="kg"
      value={set.weight ?? ""}
      onChange={(e) => updateSet(idx, { weight: e.target.value })}
    />
    <input
      className="input"
      inputMode="numeric"
      placeholder="reps"
      value={set.reps ?? ""}
      onChange={(e) => updateSet(idx, { reps: e.target.value })}
    />
  </div>
</div>
          ))}
        </div>

        <div className="card-row">
          <button className="primary" onClick={addSet}>+ Add set</button>
        </div>
      </section>

      <RestTimer open={timerOpen} onClose={() => setTimerOpen(false)} defaultSeconds={90} />
    </div>
  );
}
