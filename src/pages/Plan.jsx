import React, { useState, useEffect } from "react";

const KEY = "wt_plan";

function loadPlan() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function savePlan(obj) {
  try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch {}
}

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function Plan() {
  const [plan, setPlan] = useState(() => loadPlan());
  const [activeDay, setActiveDay] = useState(null);
  const [newEx, setNewEx] = useState("");

  useEffect(() => { savePlan(plan); }, [plan]);

  const addExercise = () => {
    if (!newEx.trim()) return;
    setPlan(p => ({
      ...p,
      [activeDay]: [...(p[activeDay]||[]), { id: Date.now(), name: newEx }]
    }));
    setNewEx("");
  };

  const removeEx = (day, id) => {
    setPlan(p => ({
      ...p,
      [day]: p[day].filter(e => e.id !== id)
    }));
  };

  return (
    <div className="page">
      <h1 className="title">Weekly Plan</h1>

      <div className="week-grid">
        {DAYS.map(d => (
          <div key={d} className="day-card" onClick={()=>setActiveDay(d)}>
            <div className="day-name">{d}</div>
            <div className="day-list">
              {(plan[d]||[]).map(e => <div key={e.id} className="pill">{e.name}</div>)}
              {!plan[d]?.length && <div className="muted">Empty</div>}
            </div>
          </div>
        ))}
      </div>

      {activeDay && (
        <div className="sheet-backdrop" onClick={()=>setActiveDay(null)}>
          <div className="sheet-card" onClick={e=>e.stopPropagation()}>
            <h2 className="sheet-title">{activeDay} plan</h2>

            <div className="form-card">
              <input
                value={newEx}
                onChange={e=>setNewEx(e.target.value)}
                placeholder="Add exercise"
              />
              <button className="btn primary wide" onClick={addExercise}>
                Add
              </button>
            </div>

            <div className="plan-list">
              {(plan[activeDay]||[]).map(e => (
                <div key={e.id} className="plan-row">
                  <span>{e.name}</span>
                  <button className="icon-x" onClick={()=>removeEx(activeDay, e.id)}>×</button>
                </div>
              ))}
            </div>

            <div className="sheet-actions">
              <button className="btn ghost" onClick={()=>setActiveDay(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
