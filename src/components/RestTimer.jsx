import React, { useEffect, useRef, useState } from "react";

const ORANGE = "#F16202";

function formatMMSS(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function RestTimer({ initialSeconds = 90, onClose, accent = "#F16202" }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [running, setRunning] = useState(true);
  const raf = useRef(null);
  const last = useRef(performance.now());

  // basic loop
  useEffect(() => {
    if (!open) return;

    setSeconds(defaultSeconds);
    setRunning(true);
    last.current = performance.now();

    const tick = (now) => {
      const elapsed = Math.round((now - last.current) / 1000);
      if (elapsed >= 1) {
        last.current = now;
        setSeconds((s) => Math.max(0, s - elapsed));
      }
      if (running && seconds > 0) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line
  }, [open, running]);

  // draw progress ring
  const pct = seconds / defaultSeconds;
  const R = 88;
  const C = 2 * Math.PI * R;
  const dash = Math.max(0, C * pct);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="title">Rest Time</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="timer-ring">
          <svg width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r={R} stroke="rgba(255,255,255,0.14)" strokeWidth="16" fill="none" />
            <circle
              cx="110"
              cy="110"
              r={R}
              stroke={ORANGE}
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${dash} ${C}`}
              transform="rotate(-90 110 110)"
            />
          </svg>
          <div className="timer-value">{formatMMSS(seconds)}</div>
        </div>

        <div className="timer-controls">
          <button className="ghost small" onClick={() => setSeconds((s) => Math.max(0, s - 30))}>−30</button>

          {running ? (
            <button className="primary round" onClick={() => setRunning(false)} aria-label="Pause">Pause</button>
          ) : (
            <button className="primary round" onClick={() => { last.current = performance.now(); setRunning(true); }} aria-label="Play">Play</button>
          )}

          <button className="ghost small" onClick={() => setSeconds((s) => s + 30)}>+30</button>
        </div>
      </div>
    </div>
  );
}
