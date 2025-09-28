import React, { useEffect, useRef, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");
const fmt = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

export default function RestTimer({ onClose }) {
  const [seconds, setSeconds] = useState(90);
  const [running, setRunning] = useState(true);
  const raf = useRef(null);
  const last = useRef(null);

  // countdown loop
  useEffect(() => {
    const loop = (t) => {
      if (!running) return;
      if (last.current == null) last.current = t;
      const dt = (t - last.current) / 1000;
      last.current = t;
      setSeconds((s) => Math.max(0, s - dt));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Rest Time</h3>
          <button className="icon-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="timer-face">
          <div className="timer-circle" />
          <div className="timer-value">{fmt(Math.round(seconds))}</div>
        </div>

        <div className="timer-actions">
          <button onClick={() => setSeconds((s) => Math.max(0, s - 30))}>
            −30
          </button>
          <button
            className="pause"
            onClick={() => setRunning((r) => !r)}
            aria-pressed={!running ? "true" : "false"}
          >
            {running ? "Pause" : "Resume"}
          </button>
          <button onClick={() => setSeconds((s) => s + 30)}>+30</button>
        </div>
      </div>
    </div>
  );
}
