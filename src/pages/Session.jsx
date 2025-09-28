import React, { useState } from "react";
import RestTimer from "../components/RestTimer.jsx";
import { StopwatchIcon } from "../Icons.jsx";

function newSet(id) {
  return { id, kg: "", reps: "" };
}

export default function Session() {
  const [sets, setSets] = useState([newSet(1), newSet(2), newSet(3)]);
  const [showTimer, setShowTimer] = useState(false);

  // ---- PERSISTENCE: load once on mount ----
useEffect(() => {
  try {
    const raw = localStorage.getItem("session_sets");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setSets(parsed);
    }
  } catch {/* ignore */}
}, []);

// ---- PERSISTENCE: save whenever sets change ----
useEffect(() => {
  try {
    localStorage.setItem("session_sets", JSON.stringify(sets));
  } catch {/* ignore */}
}, [sets]);

// ---- Optional: clear persistence when leaving the page ----
useEffect(() => {
  return () => {
    // keep it if you want continuity; or uncomment next line to clear when navigating away
    // localStorage.removeItem("session_sets");
  };
}, []);
  

  const addSet = () =>
    setSets((s) => [...s, newSet(s.length ? s[s.length - 1].id + 1 : 1)]);
  const removeSet = (id) => setSets((s) => s.filter((x) => x.id !== id));
  const updateSet = (id, field, value) =>
    setSets((s) => s.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  return (
    <div className="page">
      <h1 className="title">Session</h1>

      <section className="card session-card">
        <div className="card-head">
          <h2 className="card-title">Current Exercise</h2>

          {/* Timer button (top-right) */}
          <button
            className="timer-btn"
            aria-label="Open rest timer"
            onClick={() => setShowTimer(true)}
          >
            <StopwatchIcon />
          </button>
        </div>

        <div className="sets-col">
          {sets.map((s) => (
            <div key={s.id} className="set-card">
              <div className="set-head">
                <span className="set-title">Set {s.id}</span>
                <button
                  className="icon-x"
                  aria-label={`Remove set ${s.id}`}
                  onClick={() => removeSet(s.id)}
                >
                  ×
                </button>
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

        <button className="cta add-set" onClick={addSet}>
          + Add set
        </button>
      </section>

      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
    </div>
  );
}
