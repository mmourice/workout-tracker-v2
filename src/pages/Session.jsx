// src/pages/Session.jsx
import React, { useState } from "react";
import RestTimer from "../components/RestTimer.jsx";
import { StopwatchIcon } from "../Icons.jsx";

export default function Session() {
  // simple sets state
  const [sets, setSets] = useState([
    { kg: "", reps: "" },
    { kg: "", reps: "" },
    { kg: "", reps: "" },
  ]);

  // shared rest timer
  const [timerOpen, setTimerOpen] = useState(false);

  const addSet = () => setSets((s) => [...s, { kg: "", reps: "" }]);
  const removeSet = (idx) =>
    setSets((s) => s.filter((_, i) => i !== idx));

  const updateField = (idx, field, value) =>
    setSets((s) =>
      s.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );

  return (
    <div className="page">
      <h1 className="title">Session</h1>

      <section className="card">
        {/* Header row */}
        <div className="row space-between align-center mb-16">
          <h2 className="h2 m-0">Current Exercise</h2>

          {/* Shared stopwatch button in the header */}
          <button
            className="icon-btn"
            title="Open rest timer"
            aria-label="Open rest timer"
            onClick={() => setTimerOpen(true)}
          >
            <StopwatchIcon />
          </button>
        </div>

        {/* Sets */}
        {sets.map((s, i) => (
          <div className="set-card" key={i}>
            <div className="row space-between align-center mb-8">
              <div className="set-title">Set {i + 1}</div>

              <button
                className="close-x"
                aria-label={`Remove set ${i + 1}`}
                onClick={() => removeSet(i)}
              >
                ×
              </button>
            </div>

            <div className="row gap-12">
              <input
                inputMode="decimal"
                className="input"
                placeholder="kg"
                value={s.kg}
                onChange={(e) => updateField(i, "kg", e.target.value)}
              />
              <input
                inputMode="numeric"
                className="input"
                placeholder="reps"
                value={s.reps}
                onChange={(e) => updateField(i, "reps", e.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="mt-16">
          <button className="btn-primary wide" onClick={addSet}>
            + Add set
          </button>
        </div>
      </section>

      {/* Shared timer modal */}
      <RestTimer
        open={timerOpen}
        onClose={() => setTimerOpen(false)}
        initialSeconds={90}
      />
    </div>
  );
}
