import React, { useEffect, useMemo, useRef, useState } from "react";

/** Simple hh:mm (or mm:ss) display for a seconds counter */
function useCountdown(initial = 90) {
  const [secs, setSecs] = useState(initial);
  const [running, setRunning] = useState(false);
  const tickRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setSecs((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [running]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setSecs(initial);
  };

  const label = useMemo(() => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [secs]);

  return { label, start, pause, reset, running, secs };
}

function InputPill({ placeholder, value, onChange, inputMode = "decimal" }) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  return (
    <div className="pill-input">
      <input
        inputMode={inputMode}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowPlaceholder(false)}
        onBlur={(e) => setShowPlaceholder(e.target.value.trim() === "")}
      />
      {showPlaceholder && <span className="pill-placeholder">{placeholder}</span>}
    </div>
  );
}

export default function Session() {
  const timer = useCountdown(90);

  const [sets, setSets] = useState([
    { weight: "", reps: "" },
    { weight: "", reps: "" },
  ]);

  const addSet = () => setSets((arr) => [...arr, { weight: "", reps: "" }]);
  const removeSet = (i) =>
    setSets((arr) => (arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr));

  const update = (i, key, val) =>
    setSets((arr) => arr.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));

  return (
    <div className="page">
      <h1 className="page-title">Session</h1>

      <section className="card session-card">
        <header className="card-head">
          <h2 className="card-title">Current Exercise</h2>

          <div className="timer-row">
            <div className="timer-pill">{timer.label}</div>
            {timer.running ? (
              <button className="btn btn-ghost" onClick={timer.pause}>Pause</button>
            ) : (
              <button className="btn btn-ghost" onClick={timer.start}>Start</button>
            )}
            <button className="btn btn-ghost" onClick={timer.reset}>Reset</button>
          </div>

          <div className="card-actions">
            <button className="btn btn-primary" onClick={addSet}>+ Add set</button>
          </div>
        </header>

        <div className="sets-grid">
          {sets.map((s, i) => (
            <div className="set-card" key={i}>
              <div className="set-head">
                <div className="set-title">Set {i + 1}</div>
                <button className="chip chip-danger" onClick={() => removeSet(i)} aria-label={`Remove set ${i+1}`}>
                  ×
                </button>
              </div>

              <div className="set-row">
                <InputPill
                  placeholder="kg"
                  value={s.weight}
                  onChange={(v) => update(i, "weight", v)}
                />
                <InputPill
                  placeholder="reps"
                  value={s.reps}
                  onChange={(v) => update(i, "reps", v)}
                  inputMode="numeric"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
