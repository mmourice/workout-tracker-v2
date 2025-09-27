import React, { useMemo, useState } from "react";
import { useStore, getExerciseById } from "../store.jsx";

export default function History() {
  const { state, deleteLog } = useStore();
  const [exerciseFilter, setExerciseFilter] = useState("all");
  const [onlyLast, setOnlyLast] = useState(false);

  const options = useMemo(() => [
    { id: "all", name: "All" },
    ...state.exercises.map(e => ({ id: e.id, name: e.name }))
  ], [state.exercises]);

  const filtered = useMemo(() => {
    let arr = state.logs;
    if (exerciseFilter !== "all") {
      arr = arr.filter(log => log.entries.some(en => en.exerciseId === exerciseFilter));
    }
    if (onlyLast && exerciseFilter !== "all") {
      // group by date; pick the most recent that contains this exercise
      const first = arr.find(Boolean);
      return first ? [first] : [];
    }
    return arr;
  }, [state.logs, exerciseFilter, onlyLast]);

  return (
    <div className="container">
      <h1 className="app-title">History</h1>

      <div className="row gap wrap">
        {options.map(opt => (
          <button
            key={opt.id}
            className={`chip ${exerciseFilter===opt.id ? "chip-active" : ""}`}
            onClick={()=>setExerciseFilter(opt.id)}
          >
            {opt.name}
          </button>
        ))}
        <button className={`chip ${onlyLast ? "chip-active" : ""}`} onClick={()=>setOnlyLast(v=>!v)}>
          Show last only
        </button>
      </div>

      {filtered.map(log => (
        <details key={log.id} className="card">
          <summary className="row space">
            <div><strong>{new Date(log.dateISO).toLocaleDateString()}</strong> <span className="muted">· {log.dayName}</span></div>
            <button className="ghost small danger" onClick={(e)=>{e.preventDefault(); deleteLog(log.id);}}>🗑︎</button>
          </summary>
          <div className="list">
            {log.entries.map((en, i) => {
              const ex = getExerciseById(state, en.exerciseId);
              return (
                <div key={i} className="list-row">
                  <div className="ex-name">{ex?.name || "Exercise"}</div>
                  <div className="muted">
                    {en.sets.map((s, idx)=>(
                      <span key={idx} className="set-pill">{(s.w ?? "—")} {state.units} × {(s.r ?? "—")} reps</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      ))}

      {filtered.length === 0 && <div className="empty">No history yet.</div>}
    </div>
  );
}
