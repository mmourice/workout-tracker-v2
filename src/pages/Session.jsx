// src/pages/Session.jsx
import React, { useState } from "react";
import { StopwatchIcon } from "../Icons.jsx";
import RestTimer from "../components/RestTimer.jsx";

export default function Session() {
  const [sets, setSets] = useState([
    { weight: "", reps: "" },
    { weight: "", reps: "" },
  ]);

  const [showTimer, setShowTimer] = useState(false);

  const addSet = () => setSets((s) => [...s, { weight: "", reps: "" }]);
  const removeSet = (idx) =>
    setSets((s) => s.filter((_, i) => i !== idx));

  const updateSet = (idx, key, value) =>
    setSets((s) => s.map((set, i) => (i === idx ? { ...set, [key]: value } : set)));

  return (
    <div className="page">
      <h1 className="title">Session</h1>

      <section className="card card-lg">
        <div className="card-header">
          <h2 className="card-title">Current Exercise</h2>

          {/* Timer button (shared for this exercise) */}
          <button
            className="icon-btn"
            aria-label="Open rest timer"
            onClick={() => setShowTimer(true)}
          >
            <StopwatchIcon />
          </button>
        </div>

        {/* 2-per-row grid of set cards */}
        <div className="setsGrid">
          {sets.map((set, i) => (
            <div className="setCard" key={i}>
              <div className="setHeader">
                <span className="setTitle">Set {i + 1}</span>
                <button
                  className="xBtn"
                  aria-label={`Remove set ${i + 1}`}
                  onClick={() => removeSet(i)}
                >
                  ×
                </button>
              </div>

              <div className="setInputs">
                <input
                  inputMode="decimal"
                  className="input"
                  placeholder="kg"
                  value={set.weight}
                  onChange={(e) => updateSet(i, "weight", e.target.value)}
                />
                <input
                  inputMode="numeric"
                  className="input"
                  placeholder="reps"
                  value={set.reps}
                  onChange={(e) => updateSet(i, "reps", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="card-footer">
          <button className="cta" onClick={addSet}>+ Add set</button>
        </div>
      </section>

      {/* Timer modal */}
      {showTimer && (
        <RestTimer open={showTimer} onClose={() => setShowTimer(false)} />
      )}
    </div>
  );
}
