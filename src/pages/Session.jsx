import React, { useMemo, useState, useEffect, useRef } from "react";

/**
 * Very small local storage helper
 */
const LS_KEY = "wt_session_sets_v1";
const loadSets = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveSets = (sets) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(sets));
  } catch {}
};

/**
 * Rest Timer (per session for now)
 */
function RestTimer({ defaultSeconds = 90 }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [running, setRunning] = useState(false);
  const tickRef = useRef(null);

  useEffect(() => {
    if (running) {
      tickRef.current = setInterval(() => {
        setSeconds((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(tickRef.current);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="timer">
      <div className="timer-time">{mm}:{ss}</div>
      <div className="timer-actions">
        <button className="btn" onClick={() => setRunning((v) => !v)}>
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="btn"
          onClick={() => {
            setRunning(false);
            setSeconds(defaultSeconds);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function Session() {
  // initial sets: try load from LS, otherwise 2 empty sets
  const initial = useMemo(() => loadSets() ?? [
    { weight: "", reps: "" },
    { weight: "", reps: "" },
  ], []);
  const [sets, setSets] = useState(initial);

  useEffect(() => saveSets(sets), [sets]);

  const addSet = () =>
    setSets((s) => [...s, { weight: "", reps: "" }]);

  const removeSet = (idx) =>
    setSets((s) => s.filter((_, i) => i !== idx));

  const update = (idx, field, value) =>
    setSets((s) =>
      s.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );

  return (
    <div className="page">
      <h1>Session</h1>

      {/* Session card */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Current Exercise</div>
          <div className="card-actions">
            <RestTimer defaultSeconds={90} />
            <button className="btn primary" onClick={addSet}>+ Add set</button>
          </div>
        </div>

        <div className="sets-grid">
          {sets.map((row, i) => (
            <div className="set" key={i}>
              <div className="set-head">
                <div className="set-title">Set {i + 1}</div>
                <button className="chip danger" onClick={() => removeSet(i)}>×</button>
              </div>

              <div className="set-fields">
                <input
                  className="field"
                  inputMode="decimal"
                  placeholder="kg"
                  value={row.weight}
                  onChange={(e) => update(i, "weight", e.target.value)}
                />
                <input
                  className="field"
                  inputMode="numeric"
                  placeholder="reps"
                  value={row.reps}
                  onChange={(e) => update(i, "reps", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
