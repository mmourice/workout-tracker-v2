import React, { useState } from "react";

export default function Session() {
  const [sets, setSets] = useState([
    { kg: "", reps: "" },
    { kg: "", reps: "" },
    { kg: "", reps: "" },
  ]);

  const addSet = () => setSets((s) => [...s, { kg: "", reps: "" }]);
  const removeSet = (i) => setSets((s) => s.filter((_, idx) => idx !== i));
  const update = (i, field, value) =>
    setSets((s) => s.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  return (
    <div className="page">
      <h1 className="title">Session</h1>

      <section className="card">
        <div className="row space-between align-center mb-16">
          <h2 className="h2 m-0">Current Exercise</h2>
          {/* placeholder timer button (no modal yet) */}
          <button
            className="icon-btn"
            onClick={() => alert("Timer coming next")}
            aria-label="Open rest timer"
            title="Open rest timer"
          >
            ⏱
          </button>
        </div>

        {sets.map((s, i) => (
          <div className="set-card" key={i}>
            <div className="row space-between align-center mb-8">
              <div className="set-title">Set {i + 1}</div>
              <button className="close-x" onClick={() => removeSet(i)} aria-label={`Remove set ${i + 1}`}>
                ×
              </button>
            </div>

            <div className="row gap-12">
              <input
                className="input"
                inputMode="decimal"
                placeholder="kg"
                value={s.kg}
                onChange={(e) => update(i, "kg", e.target.value)}
              />
              <input
                className="input"
                inputMode="numeric"
                placeholder="reps"
                value={s.reps}
                onChange={(e) => update(i, "reps", e.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="mt-16">
          <button className="btn-primary wide" onClick={addSet}>+ Add set</button>
        </div>
      </section>
    </div>
  );
}
