import React from "react";
import { useStore, getExerciseById } from "../store.jsx";
import { useNavigate } from "react-router-dom";

export default function Plan() {
  const { state, addDay, renameDay, deleteDay, setPendingAddDay, removeExerciseFromDay } = useStore();
  const nav = useNavigate();

  return (
    <div className="container">
      <h1 className="app-title">Plan</h1>

      <button className="primary" onClick={()=>addDay("New Day")}>＋ Add Day</button>

      {state.plan.days.map(day => (
        <div key={day.id} className="card">
          <div className="row space">
            <input
              className="title-input"
              value={day.name}
              onChange={e=>renameDay(day.id, e.target.value)}
            />
            <button className="ghost small danger" onClick={()=>deleteDay(day.id)}>🗑︎</button>
          </div>

          <div className="list">
            {day.exerciseIds.map(id => {
              const ex = getExerciseById(state, id);
              if (!ex) return null;
              return (
                <div key={id} className="list-row">
                  <div>
                    <div className="ex-name">{ex.name}</div>
                    <div className="muted">· {ex.group}</div>
                  </div>
                  <button className="ghost small danger" onClick={()=>removeExerciseFromDay(day.id, id)}>🗑︎</button>
                </div>
              );
            })}
            {day.exerciseIds.length === 0 && <div className="muted">No exercises yet.</div>}
          </div>

          <button
            className="ghost"
            onClick={()=>{
              setPendingAddDay(day.id);
              nav("/exercises");
            }}
          >
            ＋ Add exercise
          </button>
        </div>
      ))}
    </div>
  );
}
