import React, { useEffect, useMemo, useRef, useState } from "react";
import "../modern.css";

/** ---------------------------
 *  Small helpers
 *  --------------------------*/
const pad = (n) => n.toString().padStart(2, "0");
const formatMMSS = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

/** ---------------------------
 *  RestTimer Modal
 *  --------------------------*/
function RestTimerModal({ open, seconds, onClose, onChange }) {
  const [running, setRunning] = useState(false);
  const rafRef = useRef(null);
  const lastTickRef = useRef(null);

  // start/stop
  useEffect(() => {
    if (!open) return;
    setRunning(true);
    lastTickRef.current = performance.now();

    const loop = (t) => {
      if (running) {
        const last = lastTickRef.current || t;
        if (t - last >= 1000) {
          onChange((s) => Math.max(0, s - 1));
          lastTickRef.current = t;
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [open, running, onChange]);

  useEffect(() => {
    if (open && seconds === 0) {
      setRunning(false);
    }
  }, [open, seconds]);

  const pct = useMemo(() => {
    // visualize remaining out of initial (avoid division by zero)
    // assume initial was anything >= current; use 90 if unknown
    const initial = Math.max(seconds, 1, 90);
    return 1 - seconds / initial;
  }, [seconds]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Rest Time</h3>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="dial-wrap">
          <div
            className="rest-dial"
            style={{
              background: `conic-gradient(var(--brand) ${pct * 360}deg, rgba(255,255,255,.12) 0deg)`,
            }}
          >
            <div className="dial-hole">
              <div className="dial-time">{formatMMSS(seconds)}</div>
            </div>
          </div>
        </div>

        <div className="dial-controls">
          <button
            className="ghost"
            onClick={() => onChange((s) => Math.max(0, s - 30))}
          >
            −30
          </button>

          <button
            className="primary"
            onClick={() => setRunning((r) => !r)}
            aria-pressed={running}
          >
            {running ? "Pause" : "Resume"}
          </button>

          <button
            className="ghost"
            onClick={() => onChange((s) => s + 30)}
          >
            +30
          </button>
        </div>
      </div>
    </div>
  );
}

/** ---------------------------
 *  Session page
 *  --------------------------*/
export default function Session() {
  const DEFAULT_REST = 90;

  const [sets, setSets] = useState([
    { id: 1, kg: "", reps: "" },
    { id: 2, kg: "", reps: "" },
  ]);

  const [restOpen, setRestOpen] = useState(false);
  const [restSeconds, setRestSeconds] = useState(DEFAULT_REST);

  const addSet = () => {
    setSets((arr) => [
      ...arr,
      { id: Date.now(), kg: "", reps: "" },
    ]);
  };

  const removeSet = (id) => {
    setSets((arr) => arr.filter((s) => s.id !== id));
  };

  const setField = (id, field, value) => {
    setSets((arr) => arr.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const startTimer = () => {
    setRestSeconds(DEFAULT_REST);
    setRestOpen(true);
  };

  const resetTimer = () => {
    setRestSeconds(DEFAULT_REST);
  };

  return (
    <div className="page">
      <h1>Session</h1>

      <section className="panel">
        <div className="panel-head">
          <h2>Current Exercise</h2>

          <div className="toolbar">
           <button className="chip" onClick={() => setRestOpen(true)}>
  {formatMMSS(restSeconds)}
</button>
            <button className="ghost" onClick={startTimer}>Start</button>
            <button className="ghost" onClick={resetTimer}>Reset</button>
          </div>

          <button className="primary add-btn" onClick={addSet}>
            + Add set
          </button>
        </div>

        <div className="sets">
          {sets.map((s, idx) => (
            <div className="set-card" key={s.id}>
              <div className="set-title">Set {idx + 1}</div>

              <button
                className="set-remove"
                onClick={() => removeSet(s.id)}
                aria-label={`Remove set ${idx + 1}`}
                title="Remove"
              >
                ×
              </button>

              <div className="set-grid">
                <label className="field">
                  <input
                    inputMode="decimal"
                    placeholder="kg"
                    value={s.kg}
                    onChange={(e) => setField(s.id, "kg", e.target.value)}
                  />
                </label>

                <label className="field">
                  <input
                    inputMode="numeric"
                    placeholder="reps"
                    value={s.reps}
                    onChange={(e) => setField(s.id, "reps", e.target.value)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <RestTimerModal
        open={restOpen}
        seconds={restSeconds}
        onChange={setRestSeconds}
        onClose={() => setRestOpen(false)}
      />
    </div>
  );
}
