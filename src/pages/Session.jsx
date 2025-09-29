// src/pages/Session.jsx
import React, { useState } from "react";
import RestTimer from "../components/RestTimer.jsx";
import { StopwatchIcon } from "../Icons.jsx";

export default function Session() {
  // ----- state -----
  const [sets, setSets] = useState([
    { id: 1, kg: "", reps: "" },
    { id: 2, kg: "", reps: "" },
  ]);
  const [showTimer, setShowTimer] = useState(false);

  // ----- helpers / handlers -----
  const makeSet = (nextId) => ({ id: nextId, kg: "", reps: "" });

  const addSet = () => {
    setSets((prev) => {
      const nextId = prev.length ? prev[prev.length - 1].id + 1 : 1;
      return [...prev, makeSet(nextId)];
    });
  };

  const removeSet = (id) => {
    setSets((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSet = (id, field, value) => {
    setSets((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const saveSession = () => {
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      dateISO: new Date().toISOString(),
      exerciseName: "Current Exercise", // replace later when selecting exercise
      sets: sets.map((s) => ({ kg: s.kg || "0", reps: s.reps || "0" })),
    };

    try {
      const raw = localStorage.getItem("wt_logs");
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(entry);
      localStorage.setItem("wt_logs", JSON.stringify(arr));
      alert("Session saved ✔");
    } catch (e) {
      console.error(e);
      alert("Could not save session.");
    }
  };

  // ----- render -----
  return (
    <div className="page">
      <h1 className="page-title">Session</h1>

      <div className="card session-card">
        <div className="card-head">
          <h2>Current Exercise</h2>

          {/* Stopwatch hit-area (opens modal) */}
          <div className="stopwatch-hit" onClick={() => setShowTimer(true)} aria-label="Open rest timer">
            <StopwatchIcon />
          </div>
        </div>

        {/* Sets list (single column) */}
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

              <div className="inputs-row">
                <input
                  inputMode="decimal"
                  className="input"
                  placeholder="kg"
                  value={s.kg}
                  onChange={(e) => updateSet(s.id, "kg", e.target.value)}
                />
                <input
                  inputMode="numeric"
                  className="input"
                  placeholder="reps"
                  value={s.reps}
                  onChange={(e) => updateSet(s.id, "reps", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="actions-col">
          <button className="btn-primary wide" onClick={addSet}>
            + Add set
          </button>

          <div style={{ height: 12 }} />

          <button className="btn-secondary wide" onClick={saveSession}>
            Save Session
          </button>
        </div>
      </div>

      {/* Rest timer modal */}
      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
    </div>
  );
}
