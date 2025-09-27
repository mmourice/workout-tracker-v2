// src/pages/Session.jsx
import React from "react";

export default function Session() {
  return (
    <div style={{ padding: "24px" }}>
      <h2>Session</h2>
    </div>
  );
}
import React, { useMemo, useState } from "react";
import { useStore, getExerciseById } from "../store.jsx";
import { Link } from "react-router-dom";

function useTimer(defaultSec = 90) {
  const [sec, setSec] = useState(defaultSec);
  const [on, setOn] = useState(false);

  React.useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setSec(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [on]);

  const reset = () => setSec(defaultSec);
  const toggle = () => setOn(v => !v);

  const label = `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;
  return { sec, label, on, toggle, reset };
}

function SetRow({ idx, values, onChange, units, onRemove }) {
  // two inputs per row (weight, reps) with placeholder fading on focus
  return (
    <div className="set-grid">
      <div className="set-label">Set {idx + 1}</div>
      <input
        className="chip-input"
        inputMode="decimal"
        placeholder={units}
        value={values.w ?? ""}
        onChange={(e)=>onChange({ ...values, w: e.target.value })}
      />
      <input
        className="chip-input"
        inputMode="numeric"
        placeholder="reps"
        value={values.r ?? ""}
        onChange={(e)=>onChange({ ...values, r: e.target.value })}
      />
      <button className="ghost small danger" onClick={onRemove}>×</button>
    </div>
  );
}

export default function Session() {
  const { state, saveLog } = useStore();
  const [activeDayId, setActiveDayId] = useState(state.plan.days[0]?.id);
  const activeDay = useMemo(() => state.plan.days.find(d => d.id === activeDayId), [state, activeDayId]);
  const units = state.units;

  // per-session working data (not in global store)
  const [work, setWork] = useState(() => {
    const m = {};
    (activeDay?.exerciseIds || []).forEach(id => {
      const ex = getExerciseById(state, id);
      if (!m[id]) m[id] = Array.from({ length: ex?.defaultSets || 3 }, () => ({ w: "", r: ex?.defaultReps || 10 }));
    });
    return m;
  });

  React.useEffect(() => {
    // re-init when changing day
    const m = {};
    (activeDay?.exerciseIds || []).forEach(id => {
      const ex = getExerciseById(state, id);
      if (!m[id]) m[id] = Array.from({ length: ex?.defaultSets || 3 }, () => ({ w: "", r: ex?.defaultReps || 10 }));
    });
    setWork(m);
  }, [activeDayId]);

  const addSet = (exId) => {
    setWork(prev => ({ ...prev, [exId]: [...(prev[exId] || []), { w: "", r: "" }] }));
  };
  const removeSet = (exId, i) => {
    setWork(prev => ({ ...prev, [exId]: prev[exId].filter((_, idx) => idx !== i) }));
  };

  const onSave = () => {
    if (!activeDay) return;
    const entries = (activeDay.exerciseIds || []).map(exId => ({
      exerciseId: exId,
      sets: (work[exId] || []).map(s => ({
        w: s.w === "" ? null : Number(s.w),
        r: s.r === "" ? null : Number(s.r)
      }))
    }));
    const log = {
      id: crypto.randomUUID(),
      dateISO: new Date().toISOString(),
      dayName: activeDay.name,
      entries
    };
    saveLog(log);
    alert("Session saved to History ✅");
  };

  return (
    <div className="container">
      <h1 className="app-title">Workout Tracker</h1>

      {/* Day selector */}
      <div className="row gap">
        {state.plan.days.map(d => (
          <button
            key={d.id}
            onClick={()=>setActiveDayId(d.id)}
            className={`chip ${activeDayId===d.id ? "chip-active" : ""}`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="row gap">
        <button className="primary" onClick={onSave}>Save Session</button>
        <Link className="ghost" to="/plan">Edit Plan</Link>
      </div>

      {/* Exercise cards */}
      {(activeDay?.exerciseIds || []).map(exId => {
        const ex = getExerciseById(state, exId);
        const timer = useTimer(90);
        const sets = work[exId] || [];
        return (
          <div key={exId} className="card">
            <div className="card-head">
              <a className="ex-name" href={ex.link || "#"} target="_blank" rel="noreferrer">{ex.name}</a>
              <div className="tools">
                <button className={`ghost ${timer.on ? "pause" : ""}`} onClick={timer.toggle}>{timer.label}</button>
                <button className="ghost" onClick={()=>addSet(exId)}>＋</button>
              </div>
            </div>

            <div className="sets-wrap">
              {sets.map((s, i) => (
                <SetRow
                  key={i}
                  idx={i}
                  values={s}
                  units={units}
                  onChange={(next)=>setWork(prev => {
                    const arr = [...(prev[exId]||[])];
                    arr[i] = next;
                    return { ...prev, [exId]: arr };
                  })}
                  onRemove={()=>removeSet(exId, i)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {(activeDay?.exerciseIds?.length ?? 0) === 0 && (
        <div className="empty">
          No exercises in this day. Go to <Link to="/plan">Plan</Link> and add some.
        </div>
      )}
    </div>
  );
}
