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
            <div className="set-card" key={i}>
              <button className="set-x" onClick={() => removeSet(i)} aria-label={`Remove set ${i + 1}`}>×</button>
              <div className="set-title">Set {i + 1}</div>

              <div className="set-inputs">
                <input
                  inputMode="decimal"
                  placeholder="kg"
                  value={s.w}
                  onChange={(e) => change(i, "w", e.target.value)}
                  className="num"
                />
                <input
                  inputMode="numeric"
                  placeholder="reps"
                  value={s.r}
                  onChange={(e) => change(i, "r", e.target.value)}
                  className="num"
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
