import React, { useState } from "react";
import RestTimer from "../components/RestTimer.jsx";          // must be a DEFAULT export
import { StopwatchIcon } from "../Icons.jsx";                  // must be a NAMED export

// Tiny error guard so we show something instead of a blank screen if a child throws
function Guard({ children }) {
  try {
    return children;
  } catch (e) {
    console.error("Session render error:", e);
    return (
      <div style={{ padding: 16, color: "#ff6a00" }}>
        Something went wrong in Session. Check the console logs.
      </div>
    );
  }
}

export default function Session() {
  // Always start with at least one set so we never map over undefined
  const [sets, setSets] = useState([{ weight: "", reps: "" }]);
  const [timerOpen, setTimerOpen] = useState(false);

  const addSet = () => setSets((prev) => [...prev, { weight: "", reps: "" }]);
  const removeSet = (i) =>
    setSets((prev) => prev.filter((_, idx) => idx !== i));

  const updateSet = (i, field, val) =>
    setSets((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s))
    );

  return (
    <Guard>
      <div className="page">
        <h1 className="page-title">Session</h1>

        <section className="card">
          <header className="card-header">
            <h2 className="card-title">Current Exercise</h2>

            {/* Stopwatch button (icon only) */}
            <button
              type="button"
              className="timer-ghost"
              aria-label="Open rest timer"
              title="Rest timer"
              onClick={() => setTimerOpen(true)}
            >
              <StopwatchIcon />
            </button>
          </header>

          <div className="sets-stack">
            {sets.map((set, i) => (
              <div className="set-card" key={i}>
                <div className="set-title">Set {i + 1}</div>

                <div className="set-grid">
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

                <button
                  type="button"
                  className="close-x"
                  aria-label={`Remove set ${i + 1}`}
                  onClick={() => removeSet(i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="card-footer">
            <button type="button" className="btn-primary wide" onClick={addSet}>
              + Add set
            </button>
          </div>
        </section>
      </div>

      {/* Modal timer (renders nothing when closed) */}
      {timerOpen && (
        <RestTimer
          initialSeconds={90}
          onClose={() => setTimerOpen(false)}
          accent="#F16202"
        />
      )}
    </Guard>
  );
}
