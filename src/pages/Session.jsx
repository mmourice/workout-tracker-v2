// src/pages/Session.jsx
import React, { useState } from "react";

export default function Session() {
  // ultra-simple local state so the page compiles & renders
  const [sets, setSets] = useState([{ w: "", r: "" }, { w: "", r: "" }]);

  const addSet = () => setSets((s) => [...s, { w: "", r: "" }]);
  const removeSet = (i) => setSets((s) => s.filter((_, idx) => idx !== i));

  const update = (i, key, val) =>
    setSets((s) => {
      const next = s.slice();
      next[i] = { ...next[i], [key]: val };
      return next;
    });

  return (
    <div className="page">
      <h2 className="h2">Session</h2>

      <div className="card">
        <div className="row" style={{ justifyContent: "flex-end", gap: 12 }}>
          <button className="btn" onClick={addSet}>+ Add set</button>
        </div>

        <div className="grid-2">
          {sets.map((s, i) => (
            <div key={i} className="card sub">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="label">Set {i + 1}</div>
                <button className="icon-btn" onClick={() => removeSet(i)}>×</button>
              </div>

              <div className="row" style={{ gap: 12 }}>
                <input
                  className="input"
                  inputMode="decimal"
                  placeholder="kg"
                  value={s.w}
                  onChange={(e) => update(i, "w", e.target.value)}
                />
                <input
                  className="input"
                  inputMode="numeric"
                  placeholder="reps"
                  value={s.r}
                  onChange={(e) => update(i, "r", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
